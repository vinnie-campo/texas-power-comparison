'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Zap, Phone, Menu, X } from 'lucide-react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/compare', label: 'Compare Rates' },
    { href: '/providers', label: 'Providers' },
    { href: '/resources', label: 'Resources' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-pink-gradient shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-white hover:opacity-90 transition-opacity"
            onClick={closeMobileMenu}
          >
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
              <Zap className="w-6 h-6 text-[#E5007D]" fill="#E5007D" />
            </div>
            <span className="hidden sm:inline">Texas Power Compare</span>
            <span className="sm:hidden">TPC</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-all ${
                  isActive(link.href)
                    ? 'text-white border-b-2 border-white'
                    : 'text-white/80 hover:text-white'
                } py-1`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Right Side */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Phone Number */}
            <a
              href="tel:1-800-555-0123"
              className="flex items-center gap-2 text-sm text-white/90 hover:text-white transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="font-medium">1-800-555-0123</span>
            </a>

            {/* CTA Button */}
            <Link
              href="/compare"
              className="bg-white text-[#E5007D] font-semibold py-2.5 px-6 rounded-full transition-all duration-200 hover:scale-105 hover:shadow-xl"
            >
              Find Your Plan
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-white hover:opacity-80 transition-opacity"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-full bg-white shadow-xl z-50 transform transition-transform duration-300 lg:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-pink-gradient">
            <div className="flex items-center gap-2 font-bold text-lg text-white">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <Zap className="w-5 h-5 text-[#E5007D]" fill="#E5007D" />
              </div>
              <span>Texas Power Compare</span>
            </div>
            <button
              onClick={closeMobileMenu}
              className="p-2 text-white hover:opacity-80 transition-opacity"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Navigation Links */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={closeMobileMenu}
                    className={`block py-3 px-4 rounded-2xl font-medium transition-all ${
                      isActive(link.href)
                        ? 'bg-[#E8F4FD] text-[#E5007D]'
                        : 'text-[#1E1E50] hover:bg-[#F5F5F5]'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile Menu Footer */}
          <div className="p-4 border-t border-gray-200 space-y-3">
            {/* Phone Number */}
            <a
              href="tel:1-800-555-0123"
              className="flex items-center gap-2 text-[#1E1E50] hover:text-[#E5007D] transition-colors py-2"
            >
              <Phone className="w-5 h-5" />
              <span className="font-medium">1-800-555-0123</span>
            </a>

            {/* CTA Button */}
            <Link
              href="/compare"
              onClick={closeMobileMenu}
              className="block w-full btn-primary text-center"
            >
              Find Your Plan
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
