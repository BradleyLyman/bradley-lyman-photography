import * as React from "react";
import Layout from "../components/layout";
//import { MDXRenderer } from "gatsby-plugin-mdx";
import { graphql } from "gatsby";

const Post = ({ data }: any) => {
  return (
    <Layout pageTitle="something">
      <p>Name {data.myS3Image.key}</p>
      <hr />
    </Layout>
  );
};

export const query = graphql`
  query ($id: String) {
    myS3Image(id: { eq: $id }) {
      key
    }
  }
`;

export default Post;
