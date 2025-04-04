import "nextra-theme-docs/style.css";

import { Banner, Head } from "nextra/components";
/* eslint-env node */
import { Footer, Layout, Navbar } from "nextra-theme-docs";

import { GlobalStylings } from "./GlobalStylings";
import { getPageMap } from "nextra/page-map";

export const metadata = {
  metadataBase: new URL("https://stylings.dev"),
  title: {
    template: "%s - stylings",
  },
  description: "stylings: joyful styling for React and Styled Components",
  applicationName: "stylings",
  generator: "Next.js",
  appleWebApp: {
    title: "stylings",
  },
  // other: {
  //   "msapplication-TileImage": "/ms-icon-144x144.png",
  //   "msapplication-TileColor": "#fff",
  // },
  twitter: {
    site: "https://stylings.dev",
    card: "summary_large_image",
  },
  openGraph: {
    type: "website",
    url: "https://stylings.dev",
    title: "stylings",
    description: "stylings: joyful styling for React and Styled Components",
    images: [
      {
        url: "https://stylings.dev/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "stylings",
      },
    ],
  },
};

export default async function RootLayout({ children }) {
  const navbar = (
    <Navbar
      logo={
        <div>
          <b>stylings</b>
        </div>
      }
      projectLink="https://github.com/pie6k/stylings"
    />
  );
  const pageMap = await getPageMap();
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head faviconGlyph="✦" />
      <body>
        <Layout
          // banner={<Banner storageKey="Nextra 2">Nextra 2 Alpha</Banner>}
          navbar={navbar}
          footer={<Footer>MIT {new Date().getFullYear()} © stylings.</Footer>}
          editLink="Edit this page on GitHub"
          docsRepositoryBase="https://github.com/pie6k/stylings/blob/main/docs"
          sidebar={{ defaultMenuCollapseLevel: 1 }}
          pageMap={pageMap}
        >
          <GlobalStylings />
          {children}
        </Layout>
      </body>
    </html>
  );
}
