import { ButtonHTMLAttributes, forwardRef } from "react";
import styles from "./button.module.css";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    return (
      <button className={styles.button} ref={ref} {...props}>
        {props.children}
      </button>
    );
  }
);
