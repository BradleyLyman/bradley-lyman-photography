import * as React from "react";
import { graphql, Link } from "gatsby";
import Layout from "../../components/layout";
import { StaticImage } from "gatsby-plugin-image";

const AlbumIndex = ({ data }: any) => {
  return (
    <Layout pageTitle="Albums">
      {data.allMyS3Image.group.map((group: any) => (
        <article>
          <h2>
            <Link to={group.nodes[0].gatsbyPath}>{group.fieldValue}</Link>
          </h2>
        </article>
      ))}
    </Layout>
  );
};

export const query = graphql`
  query MyQuery {
    allMyS3Image {
      group(field: folder, limit: 1) {
        fieldValue
        nodes {
          gatsbyPath(filePath: "/album/{myS3Image.folder}")
        }
      }
    }
  }
`;

export default AlbumIndex;
