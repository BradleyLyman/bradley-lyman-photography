import * as React from "react";
import { graphql, Link } from "gatsby";
import Layout from "../../components/layout";
import { MDXRenderer } from "gatsby-plugin-mdx";

const BlogPage = ({ data }: any) => {
  return (
    <Layout pageTitle="My Blog Posts">
      <p>posts go here</p>
      {data.allMdx.nodes.map((node: any) => (
        <article>
          <h2>
            <Link to={`/blog/${node.slug}`}>{node.frontmatter.title}</Link>
          </h2>
          <p>Posted: {node.frontmatter.date}</p>
          <p>{node.excerpt}</p>
          <hr />
        </article>
      ))}
    </Layout>
  );
};

export const query = graphql`
  query {
    allMdx(sort: { fields: frontmatter___date, order: DESC }) {
      nodes {
        frontmatter {
          date(formatString: "MMM D, YYYY")
          title
        }
        excerpt(pruneLength: 64)
        id
        slug
      }
    }
  }
`;

export default BlogPage;
