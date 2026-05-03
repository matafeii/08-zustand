import type { ReactNode } from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import TanStackProvider from "../components/TanStackProvider/TanStackProvider";
import "./globals.css";

export const metadata = {
  title: "NoteHub",
  description: "Manage personal notes with NoteHub",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TanStackProvider>
          <Header />
          {children}
          <Footer />
        </TanStackProvider>
      </body>
    </html>
  );
}

