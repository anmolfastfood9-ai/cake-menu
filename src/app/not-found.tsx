import Link from "next/link";
import styles from "./not-found.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Page Not Found | Raman Sweet Bakery",
  description: "Look like you're lost. The page you are looking for not available!",
};

export default function NotFound() {
  return (
    <section className={styles.page_404}>
      <div className={styles.container}>
        <div className={styles.content_wrapper}>
          <div className={styles.four_zero_four_bg}>
            <h1>404</h1>
          </div>

          <div className={styles.contant_box_404}>
            <h3>Look like you&apos;re lost</h3>
            <p>The page you are looking for not avaible!</p>
            <Link href="/menu" className={styles.link_404} aria-label="Go to Cake Menu Home Page">
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
