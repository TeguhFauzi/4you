import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "./providers";
export const viewport: Viewport = {
  themeColor: "#2563EB",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};
export const metadata: Metadata = {
  title: "Jasa Bersih - Premium Cleaning Service",
  description: "Pesan jasa pembersihan rumah secara mudah dengan layanan per ruangan atau per jam.",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <Providers>
          <div className="app-container">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
