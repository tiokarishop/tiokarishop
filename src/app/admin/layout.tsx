import Link from "next/link";
import { LayoutDashboard, Package, ShoppingCart, Users, Tag, BarChart3, Settings, MessageCircle, ShoppingBag } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6">
          <Link href="/admin" className="text-xl font-bold">
            TiokariShop
          </Link>
          <p className="text-xs text-gray-400 mt-1">Admin Dashboard</p>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {[
            { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
            { href: "/admin/products", icon: Package, label: "Products" },
            { href: "/admin/orders", icon: ShoppingCart, label: "Orders" },
            { href: "/admin/customers", icon: Users, label: "Customers" },
            { href: "/admin/categories", icon: Tag, label: "Categories" },
            { href: "/admin/analytics", icon: BarChart3, label: "Analytics" },
            { href: "/admin/whatsapp", icon: MessageCircle, label: "WhatsApp" },
            { href: "/admin/abandoned-carts", icon: ShoppingBag, label: "Abandoned Carts" },
            { href: "/admin/settings", icon: Settings, label: "Settings" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 bg-gray-50 p-8">{children}</main>
    </div>
  );
}
