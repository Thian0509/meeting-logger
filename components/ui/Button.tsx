import { ButtonHTMLAttributes } from "react";
import { clsx } from "clsx";

export default function Button(props: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "outline" }) {
  const { className, variant = "primary", ...rest } = props;
  return (
    <button
      className={clsx(
        "px-4 py-2 rounded-xl",
        variant === "primary" ? "bg-black text-white dark:bg-white dark:text-black" : "border",
        className
      )}
      {...rest}
    />
  );
}
