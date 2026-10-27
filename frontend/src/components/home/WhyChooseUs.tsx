import SectionHeading from "../ui/SectionHeading";
import FeatureCard from "./FeatureCard";
import { BoxIcon, CartIcon, ReceiptIcon, ShieldIcon } from "../ui/Icons";

// Each point maps to something the backend actually supports.
const FEATURES = [
  {
    icon: <ShieldIcon size={22} />,
    title: "Secure sign-in",
    description: "Accounts use hashed passwords and token-based sessions, so your details stay protected.",
  },
  {
    icon: <CartIcon size={22} />,
    title: "Simple shopping",
    description: "Add items to a personal cart, adjust quantities, and check out from one place.",
  },
  {
    icon: <ReceiptIcon size={22} />,
    title: "Order tracking",
    description: "Every order has a status, from pending to delivered, that you can check in your history.",
  },
  {
    icon: <BoxIcon size={22} />,
    title: "Accurate stock",
    description: "Availability is checked when you add to cart and again when an order is placed.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="section section--band" aria-labelledby="why-title">
      <div className="container">
        <SectionHeading
          id="why-title"
          title="Why shop with us"
          description="A small set of basics, done properly."
        />
        <ul className="feature-grid">
          {FEATURES.map((feature) => (
            <li key={feature.title}>
              <FeatureCard {...feature} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
