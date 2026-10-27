import useDocumentTitle from "../hooks/useDocumentTitle";
import EmptyState from "../components/ui/EmptyState";

/**
 * Placeholder for routes that are protected in Phase 2 but whose full
 * functionality (Cart, Checkout, Orders) ships in Phase 3.
 */
export default function ComingSoonPage({ title, message }: { title: string; message: string }) {
  useDocumentTitle(title);

  return (
    <section className="page">
      <div className="container">
        <EmptyState title={title} message={message} actionLabel="Browse products" actionTo="/products" />
      </div>
    </section>
  );
}
