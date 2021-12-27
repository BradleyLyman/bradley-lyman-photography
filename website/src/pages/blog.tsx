import * as React from "react";
import { graphql, useStaticQuery } from "gatsby";
import Layout from "../components/layout";

const BlogPage = () => {
  const data = useStaticQuery(graphql`
    query MyQuery {
      allFile {
        nodes {
          name
          sourceInstanceName
        }
      }
    }
  `);

  return (
    <Layout pageTitle="My Blog Posts">
      <p>posts go here</p>
      <ul>
        {data.allFile.nodes.map((node: any) => (
          <li key={node.name}>{node.name}</li>
        ))}
      </ul>
    </Layout>
  );
};

export default BlogPage;
