import * as React from "react";
import Layout from "../../components/layout";
import { MDXRenderer } from "gatsby-plugin-mdx";
import { graphql } from "gatsby";

const Post = ({ data }: any) => {
  return (
    <Layout pageTitle={data.mdx.frontmatter.title}>
      <h3>{data.mdx.frontmatter.date}</h3>
      <MDXRenderer>{data.mdx.body}</MDXRenderer>
    </Layout>
  );
};

export const query = graphql`
  query ($id: String) {
    mdx(id: { eq: $id }) {
      frontmatter {
        title
        date(formatString: "MMM D, YYYY")
      }
      body
    }
  }
`;

export default Post;
