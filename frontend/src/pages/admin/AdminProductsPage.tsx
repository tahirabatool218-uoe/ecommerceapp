import { useState } from "react";
import type { Product } from "../../types";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import useAdminProducts from "../../hooks/useAdminProducts";
import { deleteProduct } from "../../services/productService";
import { getApiErrorMessage } from "../../utils/errors";
import { formatPrice, pluralize } from "../../utils/formatters";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ErrorMessage from "../../components/ui/ErrorMessage";
import EmptyState from "../../components/ui/EmptyState";
import Button from "../../components/ui/Button";
import ProductFormModal from "../../components/admin/ProductFormModal";
import { BoxIcon } from "../../components/ui/Icons";

type ProductModalState = { mode: "add" | "edit" | null; product: Product | null };

export default function AdminProductsPage() {
  useDocumentTitle("Manage products");
  const { products, status, error, reload, setProducts } = useAdminProducts();

  // "add" | "edit" | null — which modal (if any) is open, and for edit, which product.
  const [modal, setModal] = useState<ProductModalState>({ mode: null, product: null });
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [rowError, setRowError] = useState("");

  function handleSaved(saved: Product | null): void {
    if (!saved) {
      reload();
      setModal({ mode: null, product: null });
      return;
    }
    setProducts((prev) => {
      const exists = prev.some((p) => p._id === saved._id);
      return exists ? prev.map((p) => (p._id === saved._id ? saved : p)) : [saved, ...prev];
    });
    setModal({ mode: null, product: null });
  }

  async function handleDelete(product: Product): Promise<void> {
    if (!window.confirm(`Delete "${product.name}"? This can't be undone.`)) return;

    setRowError("");
    setDeletingId(product._id);
    try {
      await deleteProduct(product._id);
      setProducts((prev) => prev.filter((p) => p._id !== product._id));
    } catch (err) {
      setRowError(getApiErrorMessage(err, "Couldn't delete this product. Please try again."));
    } finally {
      setDeletingId(null);
    }
  }

  let content;
  if (status === "loading") {
    content = <LoadingSpinner label="Loading products…" />;
  } else if (status === "error") {
    content = <ErrorMessage title="Products unavailable" message={error} onRetry={reload} />;
  } else if (products.length === 0) {
    content = (
      <EmptyState
        icon={<BoxIcon size={22} />}
        title="No products yet"
        message="Use the “Add product” button above to get the catalog started."
      />
    );
  } else {
    content = (
      <div className="card admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Category</th>
              <th scope="col">Price</th>
              <th scope="col">Stock</th>
              <th scope="col">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td data-label="Name">
                  <span className="admin-table__name">{product.name}</span>
                </td>
                <td data-label="Category">{product.category}</td>
                <td data-label="Price">{formatPrice(product.price)}</td>
                <td data-label="Stock">{product.stock}</td>
                <td data-label="Actions" className="admin-table__actions">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setModal({ mode: "edit", product })}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleDelete(product)}
                    disabled={deletingId === product._id}
                    aria-busy={deletingId === product._id}
                  >
                    {deletingId === product._id ? "Deleting…" : "Delete"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <section className="page">
      <div className="container">
        <header className="page__header admin-header">
          <div>
            <h1 className="page__title">Products</h1>
            <p className="page__description">
              {status === "success" ? pluralize(products.length, "product") : "Manage the catalog."}
            </p>
          </div>
          <Button onClick={() => setModal({ mode: "add", product: null })}>Add product</Button>
        </header>

        {rowError && (
          <p className="feedback feedback--error" role="alert">
            {rowError}
          </p>
        )}

        {content}
      </div>

      {modal.mode && (
        <ProductFormModal
          product={modal.product}
          onClose={() => setModal({ mode: null, product: null })}
          onSaved={handleSaved}
        />
      )}
    </section>
  );
}
