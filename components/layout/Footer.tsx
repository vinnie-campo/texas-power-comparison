import Link from 'next/link';
import { Zap } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: '/compare', label: 'Compare Rates' },
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
  ];

  const resources = [
    { href: '/resources/understanding-bill', label: 'Understanding Your Bill' },
    { href: '/resources/fixed-vs-variable', label: 'Fixed vs Variable Rates' },
    { href: '/resources/switching', label: 'Switching Providers' },
    { href: '/resources/faq', label: 'FAQ' },
  ];

  const serviceAreas = [
    { href: '/cities/houston', label: 'Houston' },
    { href: '/cities/dallas', label: 'Dallas' },
    { href: '/cities/austin', label: 'Austin' },
    { href: '/cities/san-antonio', label: 'San Antonio' },
    { href: '/cities/fort-worth', label: 'Fort Worth' },
    { href: '/cities', label: 'View All Cities' },
  ];

  return (
    <footer className="bg-[#003366] text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Column 1: Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#00943C] rounded-full flex items-center justify-center shadow-md">
                <Zap className="w-6 h-6 text-white" fill="white" />
              </div>
              <span className="text-white font-bold text-lg">
                Texas Power Compare
              </span>
            </div>
            <p className="text-sm text-white/90">
              Find the best electricity rates in Texas
            </p>
            <p className="text-sm text-white/70">
              © {currentYear} Texas Power Compare
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/90 hover:text-[#00943C] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">
              Resources
            </h3>
            <ul className="space-y-3">
              {resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/90 hover:text-[#00943C] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Service Areas */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">
              Service Areas
            </h3>
            <ul className="space-y-3">
              {serviceAreas.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-sm text-white/90 hover:text-[#00943C] transition-colors ${
                      link.label === 'View All Cities' ? 'font-semibold' : ''
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Legal Links */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <Link
                href="/privacy"
                className="text-white/80 hover:text-[#00943C] transition-colors"
              >
                Privacy Policy
              </Link>
              <span className="text-white/40">|</span>
              <Link
                href="/terms"
                className="text-white/80 hover:text-[#00943C] transition-colors"
              >
                Terms of Service
              </Link>
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-white/60">
              Not affiliated with PUCT or Power to Choose
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
