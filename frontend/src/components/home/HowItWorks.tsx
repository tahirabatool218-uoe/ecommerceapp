import SectionHeading from "../ui/SectionHeading";

const STEPS = [
  { title: "Browse products", description: "Explore the catalog and open any product for details." },
  { title: "Add to cart", description: "Pick your quantity. Stock is checked as you go." },
  { title: "Check out", description: "Confirm your shipping address and place the order." },
  { title: "Track orders", description: "Follow each order's status from your account." },
];

export default function HowItWorks() {
  return (
    <section className="section" aria-labelledby="how-title">
      <div className="container">
        <SectionHeading
          id="how-title"
          title="How it works"
          description="From browsing to delivery in four steps."
        />
        <ol className="steps">
          {STEPS.map((step, index) => (
            <li key={step.title} className="step">
              <span className="step__number" aria-hidden="true">
                {index + 1}
              </span>
              <h3 className="step__title">{step.title}</h3>
              <p className="step__description">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
