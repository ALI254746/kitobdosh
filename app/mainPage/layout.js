import React from "react";
import Navbar from "./navbar"; // Navbar component yo'lini moslashtiring
import Footer from "./footer"; // Footer component yo'lini moslashtiring

function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar har doim yuqorida */}
      <Navbar />

      {/* Asosiy kontent */}
      <main className="flex-grow">{children}</main>

      {/* Footer har doim pastda */}
      <Footer />
    </div>
  );
}

export default Layout;
