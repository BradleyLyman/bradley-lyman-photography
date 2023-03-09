import Head from "next/head";
import styles from "@/styles/Home.module.css";

import { listAlbumMetadata, AlbumMetadata } from "photo-archive";

interface Props {
  albumMetadata: AlbumMetadata[];
}

export async function getStaticProps(_context: any) {
  let albumMetadata = await listAlbumMetadata();
  let result = {
    props: {
      albumMetadata,
    },
  };
  return result;
}

export default function Home(props: Props) {
  let info: JSX.Element[] = [];
  for (const album of props.albumMetadata) {
    info.push(
      <div key={album.prefix}>
        <hr />
        <h2>{album.name}</h2>
        <h3>{album.date.toDateString()}</h3>
      </div>
    );
  }

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
      <main className={styles["main"]}>
        <h1>Bradley Lyman&aposs Photography Archive</h1>
        <p>aoeu</p>
        {info}
      </main>
    </>
  );
}
