import * as React from "react";
import { Link, HeadFC, PageProps } from "gatsby";
import { mainClass } from "../styles/main.css";

const NotFoundPage: React.FC<PageProps> = () => {
  return <main className={mainClass}></main>;
};

export default NotFoundPage;

export const Head: HeadFC = () => <title>Not found</title>;
