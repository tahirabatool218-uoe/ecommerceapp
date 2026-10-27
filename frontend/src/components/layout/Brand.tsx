import { Link } from "react-router-dom";
import { APP_NAME } from "../../config";
import { BagIcon } from "../ui/Icons";
import type { BrandProps } from "../../types";

export default function Brand({ onClick }: BrandProps) {
  return (
    <Link to="/" className="brand" onClick={onClick} aria-label={`${APP_NAME} home`}>
      <span className="brand__mark">
        <BagIcon size={18} />
      </span>
      <span className="brand__name">{APP_NAME}</span>
    </Link>
  );
}
