import "../styles/globals.css";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-black dark:bg-neutral-950 dark:text-neutral-100">
        <div className="max-w-6xl mx-auto p-6">{children}</div>
      </body>
    </html>
  );
}
