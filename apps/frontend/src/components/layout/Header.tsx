'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Menu, X, User, ChevronDown, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';

const languages = [
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'en', name: 'English' },
];

export function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  
  // TODO: Replace with actual auth state
  const isAuthenticated = false;

  const navItems = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/diagnosis`, label: t('diagnosis') },
    { href: `/${locale}/chat`, label: t('chat') },
  ];

  return (
    <header className="sticky top-0 z-50 bg-soft-white/90 backdrop-blur-md border-b border-sand-brown/20">
      <div className="container-wide">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-deep-navy rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">心</span>
            </div>
            <span className="font-semibold text-deep-navy hidden tablet:block">
              {t('home')}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden tablet:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-deep-navy hover:text-sand-brown transition-colors duration-hover font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center space-x-1 text-deep-navy hover:text-sand-brown transition-colors"
              >
                <Globe className="w-5 h-5" />
                <ChevronDown className="w-4 h-4" />
              </button>
              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-soft-white rounded-card shadow-card border border-sand-brown/20 py-1 animate-fade-in">
                  {languages.map((lang) => (
                    <Link
                      key={lang.code}
                      href={`/${lang.code}`}
                      className={cn(
                        'block px-4 py-2 text-sm hover:bg-calm-beige transition-colors',
                        locale === lang.code && 'font-semibold text-deep-navy'
                      )}
                      onClick={() => setIsLangMenuOpen(false)}
                    >
                      {lang.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Auth Buttons */}
            <div className="hidden tablet:flex items-center space-x-3">
              {isAuthenticated ? (
                <Link href={`/${locale}/mypage`}>
                  <Button variant="ghost" size="sm" leftIcon={<User className="w-4 h-4" />}>
                    {t('mypage')}
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href={`/${locale}/auth/login`}>
                    <Button variant="ghost" size="sm">
                      {t('login')}
                    </Button>
                  </Link>
                  <Link href={`/${locale}/auth/register`}>
                    <Button variant="primary" size="sm">
                      {t('register')}
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="tablet:hidden p-2 text-deep-navy"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="tablet:hidden py-4 border-t border-sand-brown/20 animate-slide-down">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-deep-navy hover:text-sand-brown transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <hr className="border-sand-brown/20" />
              {isAuthenticated ? (
                <Link
                  href={`/${locale}/mypage`}
                  className="text-deep-navy hover:text-sand-brown transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('mypage')}
                </Link>
              ) : (
                <>
                  <Link
                    href={`/${locale}/auth/login`}
                    className="text-deep-navy hover:text-sand-brown transition-colors font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t('login')}
                  </Link>
                  <Link
                    href={`/${locale}/auth/register`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button variant="primary" className="w-full">
                      {t('register')}
                    </Button>
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
