import { Outlet } from "react-router-dom";
import { NavBar } from "./NavBar";
import { Footer } from "./Footer";
import { NicknameGate } from "../quiz/NicknameGate";

export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
      <NicknameGate />
    </div>
  );
}
