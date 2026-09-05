import "server-only";
import fs from "fs";
import path from "path";
import { formatBDT } from "@/lib/format";
import { getZone } from "@/lib/commerce";
import { site } from "@/lib/site";

interface InvoiceOrderItem {
  product_name: string;
  quantity: number;
  unit_price: number;
  line_total: number;
}

interface InvoiceOrder {
  order_number: string;
  created_at: string;
  full_name: string;
  phone: string;
  address_line: string;
  city?: string | null;
  zone_id: string;
  subtotal: number;
  delivery_fee: number;
  total: number;
  payment_method: string;
  payment_status: string;
  status: string;
  order_items: InvoiceOrderItem[];
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildInvoiceHtml(order: InvoiceOrder, fonts: { regular: string; bold: string }): string {
  const zone = getZone(order.zone_id);
  const date = new Date(order.created_at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const rows = order.order_items
    .map(
      (item) => `
        <tr>
          <td class="item-name">${escapeHtml(item.product_name)}</td>
          <td class="num">${item.quantity}</td>
          <td class="num">${formatBDT(item.unit_price)}</td>
          <td class="num">${formatBDT(item.line_total)}</td>
        </tr>`,
    )
    .join("");

  const paymentMethodLabel = order.payment_method === "cod" ? "Cash on Delivery" : "Online Payment (SSLCommerz)";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<style>
  @font-face {
    font-family: 'Noto Sans Bengali';
    src: url('data:font/ttf;base64,${fonts.regular}') format('truetype');
    font-weight: 400;
  }
  @font-face {
    font-family: 'Noto Sans Bengali';
    src: url('data:font/ttf;base64,${fonts.bold}') format('truetype');
    font-weight: 700;
  }
  * { box-sizing: border-box; }
  body {
    font-family: 'Noto Sans Bengali', 'Helvetica Neue', Arial, sans-serif;
    color: #1a1a2e;
    padding: 48px;
    font-size: 13px;
  }
  .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #2A49DD; padding-bottom: 20px; }
  .brand { font-size: 22px; font-weight: 700; color: #2A49DD; }
  .tagline { font-size: 11px; color: #6b7280; margin-top: 2px; }
  .invoice-title { font-size: 22px; font-weight: 700; text-align: right; }
  .invoice-meta { font-size: 11px; color: #6b7280; text-align: right; margin-top: 4px; }
  .parties { display: flex; justify-content: space-between; margin-top: 28px; gap: 40px; }
  .party h3 { font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; margin: 0 0 6px; }
  .party p { margin: 0 0 3px; line-height: 1.5; }
  table { width: 100%; border-collapse: collapse; margin-top: 28px; }
  thead th { text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; border-bottom: 1px solid #e5e7eb; padding: 8px 6px; }
  thead th.num, td.num { text-align: right; }
  tbody td { padding: 10px 6px; border-bottom: 1px solid #f0f0f2; }
  .item-name { font-weight: 600; }
  .totals { width: 280px; margin-left: auto; margin-top: 16px; }
  .totals .row { display: flex; justify-content: space-between; padding: 5px 6px; }
  .totals .grand { border-top: 2px solid #1a1a2e; font-weight: 700; font-size: 15px; margin-top: 6px; padding-top: 10px; }
  .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 11px; color: #6b7280; text-align: center; }
  .status-badge { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 10px; font-weight: 700; text-transform: capitalize; background: #eef1ff; color: #2A49DD; }
</style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">${escapeHtml(site.fullName)}</div>
      <div class="tagline">${escapeHtml(site.tagline)} · ${escapeHtml(site.phone)} · ${escapeHtml(site.email)}</div>
    </div>
    <div>
      <div class="invoice-title">INVOICE</div>
      <div class="invoice-meta">#${escapeHtml(order.order_number)}</div>
      <div class="invoice-meta">${date}</div>
    </div>
  </div>

  <div class="parties">
    <div class="party">
      <h3>Bill To</h3>
      <p><strong>${escapeHtml(order.full_name)}</strong></p>
      <p>${escapeHtml(order.phone)}</p>
      <p>${escapeHtml(order.address_line)}${order.city ? ", " + escapeHtml(order.city) : ""}</p>
      ${zone ? `<p>${escapeHtml(zone.label)}</p>` : ""}
    </div>
    <div class="party" style="text-align: right;">
      <h3>Order Status</h3>
      <p><span class="status-badge">${escapeHtml(order.status)}</span></p>
      <h3 style="margin-top: 14px;">Payment</h3>
      <p>${escapeHtml(paymentMethodLabel)}</p>
      <p style="text-transform: capitalize;">${escapeHtml(order.payment_status)}</p>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Item</th>
        <th class="num">Qty</th>
        <th class="num">Unit Price</th>
        <th class="num">Total</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>

  <div class="totals">
    <div class="row"><span>Subtotal</span><span>${formatBDT(order.subtotal)}</span></div>
    <div class="row"><span>Delivery Fee</span><span>${formatBDT(order.delivery_fee)}</span></div>
    <div class="row grand"><span>Total</span><span>${formatBDT(order.total)}</span></div>
  </div>

  <div class="footer">
    Thank you for shopping with ${escapeHtml(site.fullName)}! For any questions about this order, contact us at ${escapeHtml(site.phone)} or ${escapeHtml(site.email)}.
  </div>
</body>
</html>`;
}

/**
 * Renders an order invoice to PDF bytes via headless Chromium.
 *
 * Chromium (not a plain PDF library like pdf-lib) is used deliberately:
 * Bengali is a complex script requiring conjunct/matra reordering that
 * pdf-lib's shaping engine renders incorrectly, while Chromium's own text
 * layout — the same engine that already renders Bengali correctly across
 * this site — handles it properly. The Bengali font is inlined into the
 * HTML as a base64 @font-face, since @sparticuz/chromium's serverless
 * Chromium only ships Latin/Greek/Cyrillic (Open Sans) by default.
 *
 * Locally, set CHROME_EXECUTABLE_PATH in .env.local to your own Chrome/Edge
 * install (e.g. "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe")
 * to test this. In production (Vercel), @sparticuz/chromium's bundled
 * Linux binary is used automatically — no setup needed there.
 */
export async function generateInvoicePdf(order: InvoiceOrder): Promise<Buffer> {
  const puppeteer = await import("puppeteer-core");

  const fontsDir = path.join(process.cwd(), "src/lib/invoice-fonts");
  const fonts = {
    regular: fs.readFileSync(path.join(fontsDir, "NotoSansBengali-Regular.ttf")).toString("base64"),
    bold: fs.readFileSync(path.join(fontsDir, "NotoSansBengali-Bold.ttf")).toString("base64"),
  };
  const html = buildInvoiceHtml(order, fonts);

  const localChromePath = process.env.CHROME_EXECUTABLE_PATH;

  let launchOptions: Parameters<typeof puppeteer.launch>[0];
  if (localChromePath) {
    launchOptions = {
      executablePath: localChromePath,
      headless: true,
      // Harmless on a normal dev machine; only actually needed when running
      // as root (e.g. inside a container), which some dev setups do.
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    };
  } else {
    const chromium = (await import("@sparticuz/chromium")).default;
    launchOptions = {
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    };
  }

  const browser = await puppeteer.launch(launchOptions);
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "load" });
    const pdfBytes = await page.pdf({
      format: "a4",
      printBackground: true,
      margin: { top: "0", bottom: "0", left: "0", right: "0" },
    });
    return Buffer.from(pdfBytes);
  } finally {
    await browser.close();
  }
}
