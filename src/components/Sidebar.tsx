import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const menuItems = [
  { path: "/dashboard", label: "Dashboard", icon: "📊" },
  { path: "/products", label: "Products", icon: "📦" },
  { path: "/customers", label: "Customers", icon: "👥" },
  { path: "/quotes", label: "Quotes", icon: "💰" },
  { path: "/inventory", label: "Inventory", icon: "📋" },
  { path: "/reports", label: "Reports", icon: "📈" },
] as const;

export function Sidebar() {
  const { logout } = useAuth();

  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen fixed left-0 top-0">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-8">Coastal CS - Updated</h1>
        <nav className="flex flex-col h-full">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-gray-700"
                    }`
                  }
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Logout button */}
          <button
            onClick={logout}
            className="mt-auto mb-8 flex items-center space-x-3 px-4 py-3 w-full text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <span className="text-xl">🚪</span>
            <span>Logout</span>
          </button>
        </nav>
      </div>
    </aside>
  );
}
