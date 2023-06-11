import styles from "./Header.module.css";

export const Header = () => {
  return (
    <p className={styles.root}>
      <span className={styles.flickerFast}>A</span>uto Movie{" "}
      <span className={styles.flickerSlow}>M</span>aker
    </p>
  );
};
