"use client";
import Sidebar from "./sidebar/page";
import TopNavbar from "./TopNavbar/page";
import BottomNav from "./components/BottomNav";
import { MainProvider } from "../mainPage/MainContext";
import "./courier-theme.css";
export default function CourierLayout({children}) {
  return <MainProvider><div className="courier-shell dark"><Sidebar/><div className="courier-workspace"><TopNavbar/><main className="courier-content">{children}</main></div><BottomNav/></div></MainProvider>;
}
