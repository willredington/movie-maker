import { PropsWithChildren } from "react";
// import { Navbar } from "../Navbar";
import { Title } from "../Title";
import styles from "./layout.module.css";

export function Layout({ children }: PropsWithChildren) {
  return (
    <div className={styles.container}>
      <Title />
      {children}
    </div>
  );
}
