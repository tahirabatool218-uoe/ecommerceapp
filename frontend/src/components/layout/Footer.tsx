import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { APP_NAME } from "../../config";
import Brand from "./Brand";

type FooterLink = {
  to: string;
  label: string;
};

const EXPLORE_LINKS: FooterLink[] = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
];

const ACCOUNT_LINKS: FooterLink[] = [
  { to: "/login", label: "Login" },
  { to: "/register", label: "Register" },
];

function FooterLinks({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <nav aria-label={title}>
      <h2 className="footer__title">{title}</h2>
      <ul className="footer__list">
        {links.map(({ to, label }: FooterLink) => (
          <li key={to}>
            <Link to={to}>{label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__about">
          <Brand />
          <p>
            A full-stack e-commerce portfolio project. Browse products, manage a cart, and
            track orders through a REST API built with Node.js, Express, and MongoDB.
          </p>
        </div>
        <FooterLinks title="Explore" links={EXPLORE_LINKS} />
        <FooterLinks title="Account" links={ACCOUNT_LINKS} />
      </div>
      <div className="container">
        <div className="footer__bottom">
          <p>
            &copy; {new Date().getFullYear()} {APP_NAME}. Built for portfolio purposes.
          </p>
          <p>React frontend, Express and MongoDB backend</p>
        </div>
      </div>
    </footer>
  );
}
