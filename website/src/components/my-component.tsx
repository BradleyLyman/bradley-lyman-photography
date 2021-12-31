import * as React from "react";
import { title } from "./my-component.module.css";
import { useStaticQuery, graphql } from "gatsby";

const MyComponent = (album_name: string) => {
  return (
    <div>
      <p className={title}>Content</p>
    </div>
  );
};

export default MyComponent;
