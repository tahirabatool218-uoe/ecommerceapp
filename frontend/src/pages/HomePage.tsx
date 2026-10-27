import { useMemo } from "react";
import useProducts from "../hooks/useProducts";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { deriveCategories } from "../utils/products";
import Hero from "../components/home/Hero";
import FeaturedProducts from "../components/home/FeaturedProducts";
import CategoriesSection from "../components/home/CategoriesSection";
import WhyChooseUs from "../components/home/WhyChooseUs";
import HowItWorks from "../components/home/HowItWorks";
import CallToAction from "../components/home/CallToAction";

export default function HomePage() {
  useDocumentTitle("");
  // One request feeds the hero, featured products, and categories.
  const { products, status, error, reload } = useProducts();
  const categories = useMemo(() => deriveCategories(products), [products]);

  return (
    <>
      <Hero products={products} categoryCount={categories.length} status={status} />
      <FeaturedProducts products={products} status={status} error={error} onRetry={reload} />
      <CategoriesSection categories={categories} status={status} />
      <WhyChooseUs />
      <HowItWorks />
      <CallToAction />
    </>
  );
}
