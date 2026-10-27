import { useEffect } from "react";
import { APP_NAME } from "../config";

export default function useDocumentTitle(title?: string): void {
  useEffect(() => {
    document.title = title ? `${title} | ${APP_NAME}` : APP_NAME;
  }, [title]);
}
