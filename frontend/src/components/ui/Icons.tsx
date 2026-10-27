import type { ReactNode, SVGProps } from "react";

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

// Small inline icon set (24px grid, 1.75 stroke). Decorative by default.
function Icon({ children, size = 20, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export const BagIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M5 8h14l-1 11.2a1.5 1.5 0 0 1-1.5 1.3h-9A1.5 1.5 0 0 1 6 19.2L5 8Z" />
    <path d="M8.5 8V7a3.5 3.5 0 0 1 7 0v1" />
  </Icon>
);

export const MenuIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Icon>
);

export const CloseIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Icon>
);

export const ChevronRightIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M9 6l6 6-6 6" />
  </Icon>
);

export const ShieldIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 3l7 3v5.5c0 4.2-2.9 7.7-7 9.5-4.1-1.8-7-5.3-7-9.5V6l7-3Z" />
    <path d="M9 12l2.2 2.2L15.5 10" />
  </Icon>
);

export const CartIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M3 4h2.3l2 11h10.4l1.8-8H6.4" />
    <circle cx="9.5" cy="19" r="1.3" />
    <circle cx="16.5" cy="19" r="1.3" />
  </Icon>
);

export const ReceiptIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M6 3h12v18l-3-1.8L12 21l-3-1.8L6 21V3Z" />
    <path d="M9.5 8h5M9.5 12h5" />
  </Icon>
);

export const BoxIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 3l8 4.2v9.6L12 21l-8-4.2V7.2L12 3Z" />
    <path d="M4 7.2l8 4.3 8-4.3M12 11.5V21" />
  </Icon>
);

export const TagIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7a1 1 0 0 1 .7.3l7.3 7.3a1 1 0 0 1 0 1.4l-7.7 7.7a1 1 0 0 1-1.4 0l-7.3-7.3a1 1 0 0 1-.3-.7Z" />
    <circle cx="8.5" cy="8.5" r="1.2" />
  </Icon>
);

export const AlertIcon = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5v5M12 16v.01" />
  </Icon>
);

export const SearchIcon = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M20 20l-4.2-4.2" />
  </Icon>
);

export const ClockIcon = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.5 2" />
  </Icon>
);

export const LoaderIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M20 12a8 8 0 1 1-2.34-5.66" />
    <path d="M20 4v5h-5" />
  </Icon>
);

export const TruckIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M3 7h11v9H3z" />
    <path d="M14 10.5h3.5L20 13v3h-6" />
    <circle cx="7.5" cy="18" r="1.6" />
    <circle cx="16.5" cy="18" r="1.6" />
  </Icon>
);

export const CheckCircleIcon = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8.5 12.3l2.4 2.4L15.5 9.5" />
  </Icon>
);

export const XCircleIcon = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.2 9.2l5.6 5.6M14.8 9.2l-5.6 5.6" />
  </Icon>
);

export const ShoppingCartIcon = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="9" cy="18" r="1.4" />
    <circle cx="17" cy="18" r="1.4" />
    <path d="M3.5 5.5h2l2.1 9.2a1.5 1.5 0 0 0 1.5 1.2h8.8a1.5 1.5 0 0 0 1.4-1.1L20.5 7H6.1" />
  </Icon>
);

export const SunIcon = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="4.2" />
    <path d="M12 2.5v2.4M12 19.1v2.4M4.2 4.2l1.7 1.7M18.1 18.1l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.2 19.8l1.7-1.7M18.1 5.9l1.7-1.7" />
  </Icon>
);

export const MoonIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M20 14.6A8.5 8.5 0 1 1 9.4 4a6.8 6.8 0 0 0 10.6 10.6Z" />
  </Icon>
);

export const EyeIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
    <circle cx="12" cy="12" r="3" />
  </Icon>
);

export const EyeOffIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M9.9 5.7A10.6 10.6 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a13.4 13.4 0 0 1-3.1 3.9M6.5 6.7C4 8.4 2.5 12 2.5 12s3.5 6.5 9.5 6.5a10 10 0 0 0 4.2-.9" />
    <path d="M9.9 10.1a3 3 0 0 0 4.1 4.1" />
    <path d="M3 3l18 18" />
  </Icon>
);

export const ClipboardListIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M9 4.5v2M15 4.5v2" />
    <path d="M7.5 7.5h9A1.5 1.5 0 0 1 18 9v8.5A2.5 2.5 0 0 1 15.5 20h-7A2.5 2.5 0 0 1 6 17.5V9a1.5 1.5 0 0 1 1.5-1.5Z" />
    <path d="M8.5 12h7M8.5 15h7" />
  </Icon>
);
