import SectionHeading from "../ui/SectionHeading";
import EmptyState from "../ui/EmptyState";
import CategoryCard from "./CategoryCard";
import { AlertIcon } from "../ui/Icons";
import type { ProductCategorySummary } from "../../types";

const SKELETON_COUNT = 4;

interface CategoriesSectionProps {
  categories: ProductCategorySummary[];
  status: "loading" | "success" | "error";
}

export default function CategoriesSection({ categories, status }: CategoriesSectionProps) {
  let content;

  if (status === "loading") {
    content = (
      <div role="status" aria-busy="true">
        <span className="sr-only">Loading categories…</span>
        <div className="category-grid" aria-hidden="true">
          {Array.from({ length: SKELETON_COUNT }, (_, i) => (
            <div key={i} className="category-card category-card--skeleton skeleton" />
          ))}
        </div>
      </div>
    );
  } else if (status === "error") {
    content = (
      <EmptyState
        compact
        icon={<AlertIcon size={22} />}
        title="Categories unavailable"
        message="They'll load together with the products."
      />
    );
  } else if (categories.length === 0) {
    content = (
      <EmptyState
        compact
        title="No categories yet"
        message="Categories appear once products have been added."
      />
    );
  } else {
    content = (
      <ul className="category-grid">
        {categories.map((category) => (
          <li key={category.name}>
            <CategoryCard name={category.name} count={category.count} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className="section section--tight" aria-labelledby="categories-title">
      <div className="container">
        <SectionHeading
          id="categories-title"
          title="Shop by category"
          description="Jump straight to the part of the catalog you need."
        />
        {content}
      </div>
    </section>
  );
}
