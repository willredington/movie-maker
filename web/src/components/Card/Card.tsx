import styles from "./Card.module.css";

export const Card = ({ children }: { children: React.ReactNode }) => {
  return <div className={styles.root}>{children}</div>;
};
