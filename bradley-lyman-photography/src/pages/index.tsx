import * as React from "react";
import type { HeadFC, PageProps } from "gatsby";
import { mainClass } from "../styles/main.css";

const IndexPage: React.FC<PageProps> = () => {
  return <main className={mainClass}></main>;
};

export default IndexPage;

export const Head: HeadFC = () => <title>Home Page</title>;
