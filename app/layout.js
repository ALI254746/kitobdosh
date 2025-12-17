import "./globals.css";

export const metadata = {
  title: "Kitobdoash",
  description: "Qiziqishlarni kashf qil",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
