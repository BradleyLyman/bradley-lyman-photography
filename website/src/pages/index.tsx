import { Link } from "gatsby";
import React from "react";
import Layout from "../components/layout";

export default function Home() {
  return (
    <Layout pageTitle="Home">
      <hr />
      <p>hello world</p>
      <div
        style={{
          border: "3px blue solid",
          backgroundColor: "cornflower",
          maxWidth: "20vw",
          width: "100%",
          margin: "auto",
          padding: "0 1rem 0 1rem ",
        }}
      >
        <p>some content</p>
        <Link to="/about">About</Link>
      </div>
    </Layout>
  );
}
