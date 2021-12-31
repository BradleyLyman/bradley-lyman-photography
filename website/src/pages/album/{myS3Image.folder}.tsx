import * as React from "react";
import Layout from "../../components/layout";
import { graphql } from "gatsby";
import { MDXRenderer } from "gatsby-plugin-mdx";
import { GatsbyImage } from "gatsby-plugin-image";

const Post = (props: any) => {
  let { data } = props;
  return (
    <Layout pageTitle={data.mdx.frontmatter.title}>
      <h2>Featured</h2>
      <MDXRenderer>{data.mdx.body}</MDXRenderer>
      <hr />
      <h2>Complete Album</h2>
      {data.allMyS3Image.nodes.map((image: any) => {
        return <GatsbyImage image={image.gatsbyImageData} alt="woops" />;
      })}
      <pre>{JSON.stringify(data, null, 4)}</pre>
    </Layout>
  );
};

export const query = graphql`
  query ($folder: String) {
    mdx(frontmatter: { album: { eq: $folder } }) {
      frontmatter {
        title
        date(formatString: "MMM D, YYYY")
      }
      body
    }
    allMyS3Image(filter: { folder: { eq: $folder } }) {
      nodes {
        key
        width
        height
        gatsbyImageData(placeholder: "blurred")
      }
    }
  }
`;

export default Post;
