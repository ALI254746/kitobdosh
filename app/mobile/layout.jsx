import MobileNavbar from "./components/navbar/MobileNavbar";
import MobileFooterBar from "./components/footer/MobileFooterBar";
import { ThemeProvider } from "./context/ThemeContext";

export const metadata = {
  title: "Kitobdoash",
  description: "Qiziqishlarni kashf qil",
};

export default function RootLayout({ children }) {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900 transition-colors duration-300">
        <MobileNavbar />
        <main className="flex-1">{children}</main>
        <MobileFooterBar />
      </div>
    </ThemeProvider>
  );
}
