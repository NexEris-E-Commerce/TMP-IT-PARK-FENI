"use client";

import { useEffect, useRef, useState } from "react";
import { useActionState } from "react";
import { saveAddress, deleteAddress, setDefaultAddress, type AddressFormState } from "@/lib/actions/addresses";
import { DELIVERY_ZONES } from "@/lib/commerce";
import { Button } from "@/components/ui/Button";
import { MapPin, Plus, Edit, Trash, Star, Close } from "@/components/ui/icons";

export interface SavedAddress {
  id: string;
  label: string;
  full_name: string;
  phone: string;
  zone_id: string;
  address_line: string;
  city: string | null;
  is_default: boolean;
}

const inputClass =
  "h-11 w-full rounded-xl border border-line-strong bg-surface px-3.5 text-sm text-ink outline-none transition focus:border-brand-500 focus:ring-1 focus:ring-brand-500";

export function AddressBook({ addresses }: { addresses: SavedAddress[] }) {
  const [editing, setEditing] = useState<SavedAddress | "new" | null>(null);

  return (
    <div>
      {addresses.length === 0 && editing === null && (
        <div className="rounded-2xl border border-dashed border-line-strong bg-surface p-8 text-center">
          <MapPin size={28} className="mx-auto text-ink-dim" />
          <p className="mt-3 text-sm text-ink-soft">
            You haven&rsquo;t saved any addresses yet. Add one to check out faster next time.
          </p>
        </div>
      )}

      {addresses.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <li
              key={address.id}
              className="relative rounded-2xl border border-line bg-surface p-5"
            >
              {address.is_default && (
                <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-bold text-brand-700">
                  <Star size={11} filled /> Default
                </span>
              )}
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-dim">{address.label}</p>
              <p className="mt-1.5 font-semibold text-ink">{address.full_name}</p>
              <p className="text-sm text-ink-soft">{address.phone}</p>
              <p className="mt-1 text-sm text-ink-soft">
                {address.address_line}
                {address.city ? `, ${address.city}` : ""}
              </p>
              <p className="text-sm text-ink-dim">{DELIVERY_ZONES.find((z) => z.id === address.zone_id)?.label}</p>

              <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-line pt-3.5">
                <button
                  type="button"
                  onClick={() => setEditing(address)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 transition hover:text-brand-800"
                >
                  <Edit size={13} /> Edit
                </button>
                {!address.is_default && (
                  <form action={setDefaultAddress.bind(null, address.id)}>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-soft transition hover:text-brand-700"
                    >
                      <Star size={13} /> Set as Default
                    </button>
                  </form>
                )}
                <form
                  action={deleteAddress.bind(null, address.id)}
                  onSubmit={(e) => {
                    if (!confirm("Delete this address?")) e.preventDefault();
                  }}
                  className="ml-auto"
                >
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-danger transition hover:text-danger/80"
                  >
                    <Trash size={13} /> Delete
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editing === null ? (
        <Button variant="outline" className="mt-5" onClick={() => setEditing("new")}>
          <Plus size={16} />
          Add New Address
        </Button>
      ) : (
        <AddressFormPanel
          key={editing === "new" ? "new" : editing.id}
          initial={editing === "new" ? null : editing}
          onDone={() => setEditing(null)}
        />
      )}
    </div>
  );
}

function AddressFormPanel({
  initial,
  onDone,
}: {
  initial: SavedAddress | null;
  onDone: () => void;
}) {
  const [state, formAction, pending] = useActionState<AddressFormState, FormData>(saveAddress, {});
  const doneRef = useRef(onDone);

  useEffect(() => {
    doneRef.current = onDone;
  });

  useEffect(() => {
    if (state.success) doneRef.current();
  }, [state.success]);

  return (
    <form
      action={formAction}
      className="mt-5 space-y-4 rounded-2xl border border-line bg-surface p-5 sm:p-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-display text-base font-bold text-ink">
          {initial ? "Edit Address" : "Add New Address"}
        </h3>
        <button
          type="button"
          onClick={onDone}
          aria-label="Cancel"
          className="grid h-8 w-8 place-items-center rounded-full text-ink-dim transition hover:bg-muted hover:text-ink"
        >
          <Close size={16} />
        </button>
      </div>

      {initial && <input type="hidden" name="id" value={initial.id} />}

      <div>
        <span className="text-xs font-semibold text-ink-soft">Label</span>
        <input
          name="label"
          defaultValue={initial?.label ?? "Home"}
          placeholder="Home, Office, etc."
          className={`${inputClass} mt-1.5`}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <span className="text-xs font-semibold text-ink-soft">Full Name</span>
          <input name="fullName" defaultValue={initial?.full_name} className={`${inputClass} mt-1.5`} required />
        </div>
        <div>
          <span className="text-xs font-semibold text-ink-soft">Phone</span>
          <input
            name="phone"
            defaultValue={initial?.phone}
            placeholder="01XXXXXXXXX"
            className={`${inputClass} mt-1.5`}
            required
          />
        </div>
      </div>

      <div>
        <span className="text-xs font-semibold text-ink-soft">Delivery Zone</span>
        <select name="zoneId" defaultValue={initial?.zone_id ?? DELIVERY_ZONES[0].id} className={`${inputClass} mt-1.5`}>
          {DELIVERY_ZONES.map((zone) => (
            <option key={zone.id} value={zone.id}>
              {zone.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <span className="text-xs font-semibold text-ink-soft">Address</span>
        <textarea
          name="addressLine"
          defaultValue={initial?.address_line}
          rows={2}
          className="mt-1.5 w-full rounded-xl border border-line-strong bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          required
        />
      </div>

      <div>
        <span className="text-xs font-semibold text-ink-soft">City (optional)</span>
        <input name="city" defaultValue={initial?.city ?? ""} className={`${inputClass} mt-1.5`} />
      </div>

      <label className="flex items-center gap-2.5 text-sm font-medium text-ink">
        <input
          type="checkbox"
          name="isDefault"
          defaultChecked={initial?.is_default ?? false}
          className="h-4 w-4 accent-brand-600"
        />
        Set as default address
      </label>

      {state.error && (
        <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm font-medium text-danger">{state.error}</p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-brand-600 px-6 text-sm font-bold text-white transition hover:bg-brand-700 disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save Address"}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="inline-flex h-11 items-center justify-center rounded-xl border border-line-strong px-5 text-sm font-semibold text-ink-soft transition hover:bg-muted"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
