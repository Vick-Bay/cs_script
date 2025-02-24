import { createBrowserRouter } from "react-router-dom";
import { Dashboard } from "./components/dashboard/Dashboard";
import { Sidebar } from "./components/layout/Sidebar";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div className="flex">
        <Sidebar />
        <main className="ml-60 flex-1">
          <Dashboard />
        </main>
      </div>
    ),
  },
]);
