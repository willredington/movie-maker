import { ButtonHTMLAttributes, forwardRef } from "react";
import styles from "./button.module.css";
import clsx from "clsx";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    return (
      <button
        className={clsx(styles.button, props.className)}
        ref={ref}
        {...props}
      >
        {props.children}
      </button>
    );
  }
);
