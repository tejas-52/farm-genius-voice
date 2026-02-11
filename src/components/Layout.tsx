import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { WeatherPopup } from "@/components/WeatherPopup";

export function Layout() {
  const location = useLocation();
  const hideWeatherOnCopilot = location.pathname === "/copilot";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Outlet />
      {!hideWeatherOnCopilot && <WeatherPopup />}
    </div>
  );
}
