"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface DropdownItem {
  name: string;
  href: string;
  description?: string;
}

interface MenuItem {
  name: string;
  href?: string;
  items?: DropdownItem[];
}

const menuItems: MenuItem[] = [
  {
    name: "Öne Çıkanlar",
    href: "/featured",
  },
  {
    name: "Danışmanlıklar",
    items: [
      { name: "Avukatlar", href: "/law-partners" },
      { name: "Sigortacılar", href: "/real-estate-insurance" },
      { name: "Teknoloji Danışmanlıkları", href: "/technology-partners" },
      { name: "Vergi Danışmanlıkları", href: "/tax-consulting" },
      { name: "Mimarlar", href: "/engineering-partners" },
      { name: "İç Mimarlar", href: "/interior-design-partners" },
      { name: "Mühendisler", href: "/engineering-consultants" },
      { name: "Ekspertiz", href: "/real-estate-appraisal" },
    ]
  },
  {
    name: "İş Ortakları",
    items: [
      { name: "Proje Sahipleri", href: "/partners/project-owners" },
      { name: "Emlak Ofisleri", href: "/partners/real-estate-offices" },
      { name: "Gayrimenkul Sahipleri", href: "/partners/property-owners" },
      { name: "Kurumlarla İlişkiler", href: "/partners/institutional-relations" },
      { name: "Bankalar", href: "/partners/banks" },
      { name: "GYO'lar", href: "/partners/reits" },
      { name: "Devlet Kurumları", href: "/partners/government-agencies" },
    ]
  },
  {
    name: "Mağazalar",
    href: "/store"
  },
  {
    name: "İletişim",
    href: "/contact"
  },
];

export default function ModernNavbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleMouseEnter = (menuName: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setOpenDropdown(menuName);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  const isActive = (path?: string, items?: DropdownItem[]) => {
    if (path) return pathname === path || pathname.startsWith(path);
    if (items) return items.some(item => pathname === item.href || pathname.startsWith(item.href));
    return false;
  };

  // Portal sayfasında navbar gösterme - hydration için client-side check
  if (!isMounted || pathname === "/") return null;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out ${
        isScrolled
          ? "bg-white/95 backdrop-blur-2xl shadow-lg shadow-gray-900/5 border-b border-gray-200/60"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-16 lg:h-20">
          {/* Logo */}
          <Link
            href="/"
            aria-label="Anasayfa"
            className="group flex h-full w-[200px] sm:w-[240px] lg:w-[299px] items-center justify-start"
          >
            <div className="flex h-[3rem] sm:h-[3.25rem] lg:h-[3.5rem] w-full items-center">
              <Image
                src="/images/kurumsal-logo/iremworld-logo.png"
                alt="IREMWORLD Logo"
                width={299}
                height={120}
                priority
                className="h-full w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03]"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex flex-1 items-center justify-center space-x-1">
            {menuItems.map((item) => {
              const hasDropdown = item.items && item.items.length > 0;
              const itemIsActive = isActive(item.href, item.items);

              if (hasDropdown) {
                return (
                  <div
                    key={item.name}
                    className="relative"
                    onMouseEnter={() => handleMouseEnter(item.name)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button
                      className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg whitespace-nowrap ${
                        itemIsActive
                          ? "text-primary-600 bg-primary-50/80"
                          : isScrolled 
                          ? "text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                          : "text-gray-900 hover:text-primary-600 hover:bg-white/50"
                      }`}
                    >
                      {item.name}
                      <svg 
                        className={`w-4 h-4 transition-transform duration-300 ${
                          openDropdown === item.name ? 'rotate-180' : ''
                        }`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {openDropdown === item.name && (
                      <div className="absolute top-full left-0 mt-2 w-64 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="bg-white/95 backdrop-blur-2xl rounded-2xl shadow-xl shadow-gray-900/10 border border-gray-200/60 overflow-hidden">
                          <div className="p-2">
                            {item.items!.map((subItem) => (
                              <Link
                                key={subItem.href}
                                href={subItem.href}
                                onClick={() => setOpenDropdown(null)}
                                className={`block px-4 py-3 rounded-xl transition-all duration-200 ${
                                  pathname === subItem.href
                                    ? "bg-primary-50 text-primary-600"
                                    : "text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                                }`}
                              >
                                <div className="font-medium text-sm">{subItem.name}</div>
                                {subItem.description && (
                                  <div className="text-xs text-gray-500 mt-0.5">{subItem.description}</div>
                                )}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href!}
                  className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg whitespace-nowrap ${
                    itemIsActive
                      ? "text-primary-600 bg-primary-50/80"
                      : isScrolled
                      ? "text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                      : "text-gray-900 hover:text-primary-600 hover:bg-white/50"
                  }`}
                >
                  {item.name}
                  {itemIsActive && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary-600 rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex w-[200px] sm:w-[240px] lg:w-[299px] items-center justify-end gap-3">
            {/* Search Button */}
            <button
              onClick={() => router.push('/for-sale')}
              className={`hidden lg:flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                isScrolled
                  ? "text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100"
                  : "text-gray-700 hover:text-gray-900 bg-white/50 hover:bg-white/80 backdrop-blur-sm"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Ara</span>
            </button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="hidden lg:flex items-center gap-2">
                <Link
                  href="/iw-management"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  Yönetim
                </Link>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden lg:flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Giriş Yap
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300 ${
                isScrolled 
                  ? "hover:bg-gray-100" 
                  : "hover:bg-white/50 backdrop-blur-sm"
              }`}
              aria-label="Menü"
            >
              <div className="flex flex-col items-center justify-center w-5 h-5 gap-1">
                <span
                  className={`block w-5 h-0.5 transition-all duration-300 ${
                    isScrolled ? "bg-gray-900" : "bg-gray-900"
                  } ${isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""}`}
                />
                <span
                  className={`block w-5 h-0.5 transition-all duration-300 ${
                    isScrolled ? "bg-gray-900" : "bg-gray-900"
                  } ${isMobileMenuOpen ? "opacity-0" : ""}`}
                />
                <span
                  className={`block w-5 h-0.5 transition-all duration-300 ${
                    isScrolled ? "bg-gray-900" : "bg-gray-900"
                  } ${isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-white/95 backdrop-blur-2xl z-40 overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="px-4 py-6 space-y-2">
            {menuItems.map((item) => {
              const hasDropdown = item.items && item.items.length > 0;
              const itemIsActive = isActive(item.href, item.items);

              if (hasDropdown) {
                return (
                  <div key={item.name} className="space-y-1">
                    <div className="px-4 py-3 text-base font-semibold text-gray-900 bg-gray-50 rounded-lg">
                      {item.name}
                    </div>
                    <div className="pl-4 space-y-1">
                      {item.items!.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`block px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 ${
                            pathname === subItem.href
                              ? "text-primary-600 bg-primary-50"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href!}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 text-base font-medium rounded-lg transition-all duration-300 ${
                    itemIsActive
                      ? "text-primary-600 bg-primary-50"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}

            {/* Mobile Actions */}
            <div className="pt-4 mt-4 border-t border-gray-100 space-y-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  router.push('/for-sale');
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                İlan Ara
              </button>

              {isAuthenticated ? (
                <Link
                  href="/iw-management"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-base font-medium text-white bg-gradient-to-r from-primary-600 to-primary-500 rounded-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  Yönetim Paneli
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-base font-medium text-white bg-gradient-to-r from-primary-600 to-primary-500 rounded-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Giriş Yap
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
