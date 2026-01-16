'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Zap } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import LanguageToggle from './LanguageToggle'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { t } = useLanguage()

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-green-600 p-2 rounded-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">Texas Power Compare</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-600 hover:text-gray-900 font-medium">
              {t('home')}
            </Link>
            <Link href="/compare" className="text-green-600 hover:text-green-700 font-medium">
              {t('compareRates')}
            </Link>
            <Link href="/providers" className="text-gray-600 hover:text-gray-900 font-medium">
              {t('providers')}
            </Link>
            <Link href="/resources" className="text-gray-600 hover:text-gray-900 font-medium">
              {t('resources')}
            </Link>
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageToggle />
            <Link
              href="/compare"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
            >
              {t('findYourPlan')}
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900 font-medium">
                {t('home')}
              </Link>
              <Link href="/compare" className="text-green-600 hover:text-green-700 font-medium">
                {t('compareRates')}
              </Link>
              <Link href="/providers" className="text-gray-600 hover:text-gray-900 font-medium">
                {t('providers')}
              </Link>
              <Link href="/resources" className="text-gray-600 hover:text-gray-900 font-medium">
                {t('resources')}
              </Link>
              <div className="pt-4 border-t flex items-center justify-between">
                <LanguageToggle />
                <Link
                  href="/compare"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
                >
                  {t('findYourPlan')}
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
