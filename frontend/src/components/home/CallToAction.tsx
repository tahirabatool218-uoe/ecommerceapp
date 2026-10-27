import Button from "../ui/Button";

export default function CallToAction() {
  return (
    <section className="section section--cta" aria-labelledby="cta-title">
      <div className="container">
        <div className="cta">
          <div className="cta__text">
            <h2 id="cta-title" className="cta__title">
              Ready to find something you like?
            </h2>
            <p className="cta__description">
              The full catalog is open to browse, no account needed.
            </p>
          </div>
          <Button to="/products" variant="light" size="lg">
            Explore products
          </Button>
        </div>
      </div>
    </section>
  );
}
