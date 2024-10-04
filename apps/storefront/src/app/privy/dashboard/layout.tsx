import styles from "./page.module.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
      <div className={styles.body}>{children}</div>
  );
}
