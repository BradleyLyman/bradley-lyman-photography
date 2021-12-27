import * as React from "react";
import { graphql, useStaticQuery } from "gatsby";
import Layout from "../components/layout";
import { MDXRenderer } from "gatsby-plugin-mdx";

const BlogPage = () => {
  const blogQuery = useStaticQuery(graphql`
    query {
      allMdx(sort: { fields: frontmatter___date, order: DESC }) {
        nodes {
          frontmatter {
            date(formatString: "MMM D, YYYY")
            title
          }
          id
          body
        }
      }
    }
  `);

  return (
    <Layout pageTitle="My Blog Posts">
      <p>posts go here</p>
      {blogQuery.allMdx.nodes.map((node: any) => (
        <article>
          <h2>{node.frontmatter.title}</h2>
          <p>Posted: {node.frontmatter.date}</p>
          <MDXRenderer>{node.body}</MDXRenderer>
          <hr />
        </article>
      ))}
    </Layout>
  );
};

export default BlogPage;
