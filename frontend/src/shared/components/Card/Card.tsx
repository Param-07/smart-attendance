import clsx from "clsx";

import type { CardProps } from "./Card.types";

export default function Card({
  children,
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={clsx(
        "w-full rounded-xl border border-gray-200 bg-white p-8 shadow-sm",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}