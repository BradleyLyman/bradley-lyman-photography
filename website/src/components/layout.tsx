import React, { ReactNode } from "react";
import { Link, useStaticQuery, graphql } from "gatsby";
import {
  container,
  heading,
  navLinks,
  navLinkItem,
  navLinkText,
} from "./layout.module.css";

interface Props {
  pageTitle: String;
  children: ReactNode;
}

const Layout = ({ pageTitle, children }: Props) => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  const title = `${pageTitle} | ${data.site.siteMetadata.title}`;

  return (
    <div className={container}>
      <title>{title}</title>

      <nav>
        <ul className={navLinks}>
          <li className={navLinkItem}>
            <Link className={navLinkText} to="/">
              Home
            </Link>
          </li>
          <li className={navLinkItem}>
            <Link className={navLinkText} to="/about">
              About
            </Link>
          </li>
          <li className={navLinkItem}>
            <Link className={navLinkText} to="/blog">
              Blog
            </Link>
          </li>
          <li className={navLinkItem}>
            <Link className={navLinkText} to="/album">
              Albums
            </Link>
          </li>
        </ul>
      </nav>

      <main>
        <h1 className={heading}>{title}</h1>
        {children}
      </main>
    </div>
  );
};

export default Layout;
