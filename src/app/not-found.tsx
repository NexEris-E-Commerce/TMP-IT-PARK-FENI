import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Container className="grid min-h-[60vh] place-items-center py-16 text-center">
      <div>
        <p className="font-display text-7xl font-extrabold text-brand-600">404</p>
        <h1 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-ink">
          Page not found
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-ink-soft">
          The page you’re looking for doesn’t exist or may have moved.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button href="/">Back to Home</Button>
          <Button href="/shop" variant="outline">
            Browse Shop
          </Button>
        </div>
      </div>
    </Container>
  );
}
