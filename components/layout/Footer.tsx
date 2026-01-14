import Link from 'next/link';
import { Zap } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: '/compare', label: 'compare rates' },
    { href: '/how-it-works', label: 'how it works' },
    { href: '/about', label: 'about us' },
    { href: '/contact', label: 'contact' },
  ];

  const resources = [
    { href: '/resources/understanding-bill', label: 'understanding your bill' },
    { href: '/resources/fixed-vs-variable', label: 'fixed vs variable rates' },
    { href: '/resources/switching', label: 'switching providers' },
    { href: '/resources/faq', label: 'FAQ' },
  ];

  const serviceAreas = [
    { href: '/cities/houston', label: 'Houston' },
    { href: '/cities/dallas', label: 'Dallas' },
    { href: '/cities/austin', label: 'Austin' },
    { href: '/cities/san-antonio', label: 'San Antonio' },
    { href: '/cities/fort-worth', label: 'Fort Worth' },
    { href: '/cities', label: 'view all cities' },
  ];

  return (
    <footer className="bg-secondary-blue text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Column 1: Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                <Zap className="w-6 h-6 text-[#E5007D]" fill="#E5007D" />
              </div>
              <span className="text-white font-bold text-lg">
                Texas Power Compare
              </span>
            </div>
            <p className="text-sm text-white/80">
              find the best electricity rates in Texas
            </p>
            <p className="text-sm text-white/60">
              © {currentYear} Texas Power Compare
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">
              quick links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/80 hover:text-[#E5007D] transition-colors"
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
              resources
            </h3>
            <ul className="space-y-3">
              {resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/80 hover:text-[#E5007D] transition-colors"
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
              service areas
            </h3>
            <ul className="space-y-3">
              {serviceAreas.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-sm text-white/80 hover:text-[#E5007D] transition-colors ${
                      link.label === 'view all cities' ? 'font-medium' : ''
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
                className="text-white/70 hover:text-[#E5007D] transition-colors"
              >
                privacy policy
              </Link>
              <span className="text-white/30">|</span>
              <Link
                href="/terms"
                className="text-white/70 hover:text-[#E5007D] transition-colors"
              >
                terms of service
              </Link>
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-white/50">
              not affiliated with PUCT or Power to Choose
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
