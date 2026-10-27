import type { Dispatch, MouseEventHandler, ReactNode, SetStateAction } from "react";

export type ThemeName = "light" | "dark";
export type UserRole = "admin" | "user";

export const ORDER_STATUS_OPTIONS = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
] as const;
export type OrderStatus = (typeof ORDER_STATUS_OPTIONS)[number];

/** Standard shape for successful API responses that include a payload. */
export type ApiResponse<T extends object> = { message?: string } & T;

export interface ApiErrorPayload {
  message: string;
  error?: string;
}

export interface User {
  /** The auth API serializes MongoDB IDs as `id`. */
  id: string;
  /** Some populated Mongoose responses may expose `_id` instead. */
  _id?: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number | string;
  category: string;
  stock: number | string;
  image?: string;
  createdAt?: string;
}

export interface CartItem {
  _id?: string;
  name?: string;
  quantity: number;
  product?: Product | null;
  price?: number | string;
}

export interface Cart {
  _id?: string;
  items?: CartItem[];
}

export interface OrderItem {
  _id?: string;
  product?: Product | null;
  name: string;
  quantity: number;
  price?: number | string;
}

export interface Order {
  _id: string;
  status: OrderStatus;
  createdAt?: string;
  totalAmount: number | string;
  items?: OrderItem[];
  shippingAddress?: string;
  user?: {
    name?: string;
    email?: string;
  };
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends AuthCredentials {
  name: string;
}

export interface AuthSession {
  token: string | null;
  user: User | null;
}

export interface AuthContextValue {
  user: User | null;
  token: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: AuthCredentials) => Promise<User>;
  register: (credentials: RegisterCredentials) => Promise<User>;
  logout: () => void;
}

export interface ThemeContextValue {
  theme: ThemeName;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: Dispatch<SetStateAction<ThemeName>>;
}

export interface ProductFormState {
  name: string;
  description: string;
  price: string;
  category: string;
  stock: string;
}

export type ProductMutationInput = Omit<ProductFormState, "price" | "stock"> & {
  price: number;
  stock: number;
  image?: string;
};

export type ProductFormErrors = Partial<Record<keyof ProductFormState, string>>;

export interface CheckoutFormState {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

export type CheckoutFormErrors = Partial<Record<keyof CheckoutFormState, string>>;

export interface LoginFormState {
  email: string;
  password: string;
}

export type LoginFormErrors = Partial<Record<keyof LoginFormState, string>>;

export interface RegisterFormState extends LoginFormState {
  name: string;
  confirmPassword: string;
}

export type RegisterFormErrors = Partial<Record<keyof RegisterFormState, string>>;

export type ApiErrorResponse = {
  response?: {
    status?: number;
    data?: { message?: string };
  };
};

export interface ProductCategorySummary {
  name: string;
  count: number;
}

export interface CartSummaryResult {
  items: CartItem[];
  itemCount: number;
  total: number;
  issueCount: number;
  isEmpty: boolean;
  canCheckout: boolean;
}

export type RequestStatus = "loading" | "success" | "error" | "idle" | "not-found";

export interface ProductListState {
  products: Product[];
  status: "loading" | "success" | "error";
  error: string;
}

export interface CartState {
  cart: Cart | null;
  status: "loading" | "success" | "error";
  error: string;
}

export interface OrderListState {
  orders: Order[];
  status: "loading" | "success" | "error";
  error: string;
}

export interface ButtonProps {
  to?: string;
  variant?: "primary" | "secondary" | "ghost" | "light";
  size?: "sm" | "md" | "lg";
  block?: boolean;
  className?: string;
  children: ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  "aria-busy"?: boolean;
  form?: string;
  [key: string]: unknown;
}

export interface EmptyStateProps {
  title: string;
  message?: string;
  actionLabel?: string;
  actionTo?: string;
  icon?: ReactNode;
  compact?: boolean;
}

export interface ErrorMessageProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export interface SectionHeadingProps {
  id?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  actionTo?: string;
  align?: "start" | "center";
}

export interface BrandProps {
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

export interface QuantityStepperProps {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  label?: string;
}

export interface PasswordInputProps {
  id: string;
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  autoComplete?: string;
  ariaInvalid?: boolean;
  ariaDescribedBy?: string;
}

export interface ThemeToggleProps {
  className?: string;
}

export interface AuthPlaceholderField {
  id: string;
  label: string;
  type: string;
  autoComplete?: string;
}

export interface AuthPlaceholderProps {
  title: string;
  description: string;
  fields: AuthPlaceholderField[];
  submitLabel: string;
  notice: string;
  alternateText: string;
  alternateLabel: string;
  alternateTo: string;
}

export interface CartItemProps {
  item: CartItem;
  disabled?: boolean;
  onQuantityChange: (productId: string, nextQuantity: number) => void;
  onRemove: (productId: string) => void;
}

export interface FooterLink {
  to: string;
  label: string;
}

export interface FooterLinksProps {
  title: string;
  links: FooterLink[];
}

export interface HeroProps {
  products: Product[];
  categoryCount: number;
  status: "loading" | "success" | "error";
}

export interface HeroShowcaseProps {
  products: Product[];
  status: "loading" | "success" | "error";
}

export interface ProductFormModalProps {
  product?: Product | null;
  onClose: () => void;
  onSaved: (saved: Product | null) => void;
}

export interface BreadcrumbProps {
  current?: string;
}

export type FormErrorsMap = Record<string, string | undefined>;
