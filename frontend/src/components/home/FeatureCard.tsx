import type { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <article className="feature-card">
      <span className="feature-card__icon">{icon}</span>
      <h3 className="feature-card__title">{title}</h3>
      <p className="feature-card__description">{description}</p>
    </article>
  );
}
