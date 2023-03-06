import type { GatsbyNode } from "gatsby";
import path from "path";
import type { AlbumPageContext } from "./src/templates/album-page";

export const createPages: GatsbyNode["createPages"] = async ({ actions }) => {
  console.log("create pages");

  let albums: AlbumPageContext[] = [
    {
      albumName: "2021_11_08__SunsetWalk",
      albumDisplayName: "Sunset Walk: Nov 08, 2021",
    },
    {
      albumName: "2021_11_26__SunriseWalk",
      albumDisplayName: "Sunrise Walk: Nov 26, 2021",
    },
    {
      albumName: "2021_11_26__SunsetWalk",
      albumDisplayName: "Sunset Walk: Nov 26, 2021",
    },
  ];

  for (let album of albums) {
    actions.createPage({
      path: `/album/${album.albumName}`,
      component: path.resolve("src/templates/album-page.tsx"),
      context: album,
    });
  }
};
