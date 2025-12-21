import "./globals.css";
import Providers from "./Providers";

export const metadata = {
  title: "Kitobdosh",
  description: "Qiziqishlarni kashf qil",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
            {children}
        </Providers>
      </body>
    </html>
  );
}
