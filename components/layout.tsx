import Header from "./header"
import Footer from "./footer"
import styles from "../styles/Home.module.css";
import type { ReactNode } from "react"

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className={styles.main}>{children}</main>
      <Footer />
    </>
  )
}
