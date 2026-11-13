import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import { LandingPage } from "./pages/landing/LandingPage";
import { SettingsProvider } from "./core/context/SettingsContext";

export const appRouter = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/login",
    lazy: async () => {
      const { LoginPage } = await import("./pages/login/LoginPage");
      return { Component: LoginPage };
    },
  },
  {
    path: "/nosotros",
    lazy: async () => {
      const { NosotrosPage } = await import("./pages/nosotros/NosotrosPage");
      return { Component: NosotrosPage };
    },
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export function App() {
  return (
    <SettingsProvider>
      <RouterProvider router={appRouter} />
    </SettingsProvider>
  );
}

