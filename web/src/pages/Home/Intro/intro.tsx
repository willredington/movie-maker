import { Link } from "react-router-dom";
import styles from "./intro.module.css";

export function Intro() {
  return (
    <div className={styles.root}>
      <p className={styles.description}>
        Generate videos based on a prompt in just a few minutes
      </p>
      <div className={styles.steps}>
        <div className={styles.item}>
          <span className={styles.number}>1</span>
          <p className={styles.label}>
            Enter a simple prompt about a concept you'd like explained
          </p>
        </div>
        <div className={styles.item}>
          <span className={styles.number}>2</span>
          <p className={styles.label}>
            Make any necessary edits, like adding GIFs, backgrounds, and text
          </p>
        </div>
        <div className={styles.item}>
          <span className={styles.number}>3</span>
          <p className={styles.label}>
            Finalize your edits and create your video!
          </p>
        </div>
      </div>
      <div className={styles.cta}>
        <Link className={styles.link} to="dashboard">
          Get Started
        </Link>
      </div>
    </div>
  );
}
