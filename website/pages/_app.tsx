import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Noto_Sans, Montserrat } from "next/font/google";

const montserrat_font = Montserrat({ weight: "600", subsets: ["latin-ext"] });
const noto_font = Noto_Sans({ weight: "400", subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>{`
        html {
          --normal-font: ${noto_font.style.fontFamily};
          --title-font: ${montserrat_font.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
    </>
  );
}
