'use client'

import { useLanguage } from '@/lib/i18n/LanguageContext'
import { Globe } from 'lucide-react'

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition text-sm font-medium"
    >
      <Globe className="w-4 h-4" />
      {language === 'en' ? 'ES' : 'EN'}
    </button>
  )
}
