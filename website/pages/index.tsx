import Head from "next/head";
import styles from "@/styles/Home.module.css";

export default function Home() {
  return (
    <>
      <Head>
        <title>Bradley Lyman Photography</title>
        <meta
          name="description"
          content="Bradley Lyman's photography archive."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="favicon.ico" />
        <link rel="manifest" href="site.webmanifest" />
      </Head>
      <main className={styles.main}>
        <h1>Bradley Lyman's Photography Archive</h1>
        <p>aoeu</p>
      </main>
    </>
  );
}
