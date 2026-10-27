import useDocumentTitle from "../hooks/useDocumentTitle";
import EmptyState from "../components/ui/EmptyState";
import { SearchIcon } from "../components/ui/Icons";

export default function NotFoundPage() {
  useDocumentTitle("Page not found");
  return (
    <section className="page">
      <div className="container">
        <EmptyState
          icon={<SearchIcon size={22} />}
          title="Page not found"
          message="The page you're looking for doesn't exist or has moved."
          actionLabel="Go to home"
          actionTo="/"
        />
      </div>
    </section>
  );
}
