import { PropsWithChildren } from "react";
import styles from "./glass.module.css";

export function Glass({ children }: PropsWithChildren) {
  return <div className={styles.root}>{children}</div>;
}
