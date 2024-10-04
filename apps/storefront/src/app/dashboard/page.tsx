import { use } from 'react';
import "../../styles/globals.css";
import styles from "./page.module.css";
import FinancialDashboard from './FinancialDashboard';


export default function Home(): JSX.Element {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <FinancialDashboard />
      </main>
    </div>
  );
}