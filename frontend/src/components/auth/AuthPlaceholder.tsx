import { Link } from "react-router-dom";
import type { AuthPlaceholderProps } from "../../types";

/**
 * Visual shell for the Login / Register pages. The form is intentionally
 * disabled: authentication is implemented in a later phase.
 */
export default function AuthPlaceholder({
  title,
  description,
  fields,
  submitLabel,
  notice,
  alternateText,
  alternateLabel,
  alternateTo,
}: AuthPlaceholderProps) {
  return (
    <section className="page page--auth">
      <div className="container">
        <div className="auth card">
          <h1 className="auth__title">{title}</h1>
          <p className="auth__description">{description}</p>

          <form className="auth__form" onSubmit={(event) => event.preventDefault()}>
            <fieldset disabled className="auth__fieldset">
              <legend className="sr-only">{title} form (not available yet)</legend>
              {fields.map(({ id, label, type, autoComplete }) => (
                <div className="field" key={id}>
                  <label className="field__label" htmlFor={id}>
                    {label}
                  </label>
                  <input id={id} className="input" type={type} autoComplete={autoComplete} />
                </div>
              ))}
              <button type="submit" className="btn btn--primary btn--block">
                {submitLabel}
              </button>
            </fieldset>
          </form>

          <p className="auth__notice" role="note">
            {notice}
          </p>
          <p className="auth__alternate">
            {alternateText} <Link to={alternateTo}>{alternateLabel}</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
