import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Shop</h3>
            <ul className="space-y-2">
              <li><Link href="/category/clothes" className="text-sm text-gray-600 hover:text-gray-900">Clothes</Link></li>
              <li><Link href="/category/shoes" className="text-sm text-gray-600 hover:text-gray-900">Shoes</Link></li>
              <li><Link href="/category/perfumes" className="text-sm text-gray-600 hover:text-gray-900">Perfumes</Link></li>
              <li><Link href="/category/accessories" className="text-sm text-gray-600 hover:text-gray-900">Accessories</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Help</h3>
            <ul className="space-y-2">
              <li><Link href="/help" className="text-sm text-gray-600 hover:text-gray-900">FAQ</Link></li>
              <li><Link href="/shipping" className="text-sm text-gray-600 hover:text-gray-900">Shipping</Link></li>
              <li><Link href="/returns" className="text-sm text-gray-600 hover:text-gray-900">Returns</Link></li>
              <li><Link href="/contact" className="text-sm text-gray-600 hover:text-gray-900">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm text-gray-600 hover:text-gray-900">About</Link></li>
              <li><Link href="/careers" className="text-sm text-gray-600 hover:text-gray-900">Careers</Link></li>
              <li><Link href="/press" className="text-sm text-gray-600 hover:text-gray-900">Press</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-900">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-gray-600 hover:text-gray-900">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-10 pt-8 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} TiokariShop. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
