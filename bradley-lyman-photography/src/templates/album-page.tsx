import * as React from "react";
import { graphql } from "gatsby";
import type { HeadFC, PageProps } from "gatsby";
import { mainClass } from "../styles/main.css";

export interface AlbumPageContext {
  /**
   * The Album name is the folder name for the album in s3.
   */
  albumName: string;

  /**
   * The display name is how the Album should be presented on screen.
   */
  albumDisplayName: string;
}

const AlbumPage: React.FC<PageProps<object, AlbumPageContext>> = ({
  data,
  pageContext,
}) => {
  return (
    <main className={mainClass}>
      <h1>{pageContext.albumDisplayName}</h1>
    </main>
  );
};

export default AlbumPage;

export const Head: HeadFC<object, AlbumPageContext> = ({ pageContext }) => (
  <title>{pageContext.albumDisplayName}</title>
);

//export const query = graphql`
//  query AlbumQuery {
//    site {
//      siteMetadata {
//        title
//      }
//    }
//
//    album(name: { eq: "2021_11_08__SunsetWalk" }) {
//      name
//    }
//  }
//`;
