import { Link, useLocation } from "react-router-dom";

type NavItem = {
  path: string;
  label: string;
};

export function Navbar() {
  const location = useLocation();

  const navItems: NavItem[] = [
    { path: "/", label: "Customers" },
    { path: "/products", label: "Products" },
    { path: "/quotes", label: "Quotes" },
  ];

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  location.pathname === item.path
                    ? "border-blue-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
