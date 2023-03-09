import Head from "next/head";
import styles from "@/styles/Home.module.css";

export default function Album() {
  return (
    <>
      <Head>
        <title>My Album</title>
        <meta name="description" content="An album" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1>My Album</h1>
        <p>aoeu</p>
      </main>
    </>
  );
}
