import type { Metadata } from "next";
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/Header";
// import { VisualEditing } from "next-sanity";
// import { DisableDraftMode } from "@/components/DraftDisableMode";
// import { draftMode } from "next/headers";

export const metadata: Metadata = {
  title: "Val's Shop",
  description: "Full functional e-commerce site",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const { isEnabled } = await draftMode();

  return (
    <ClerkProvider dynamic>
      <html lang="en">
        <body>
          <Header />
          <main>
            {children}
            {/* <SanityLive/> */}
            {/* {isEnabled && (
            <>
              <VisualEditing />
              <DisableDraftMode />
            </>
          )} */}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
