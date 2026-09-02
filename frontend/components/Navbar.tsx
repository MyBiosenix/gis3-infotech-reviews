'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ChevronDown,
  Menu,
  X,
  Star,
} from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  /*
   * Detect mobile viewport.
   * This avoids breakpoint conflicts from other CSS.
   */
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');

    const updateViewport = () => {
      const mobile = mediaQuery.matches;

      setIsMobile(mobile);

      // Always close mobile menu when switching to desktop
      if (!mobile) {
        setMobileMenuOpen(false);
        setMobileDropdownOpen(false);
      }
    };

    updateViewport();

    mediaQuery.addEventListener('change', updateViewport);

    return () => {
      mediaQuery.removeEventListener('change', updateViewport);
    };
  }, []);

  /*
   * Close desktop dropdown when clicking outside.
   */
  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDesktopDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  /*
   * Prevent body scrolling while mobile menu is open.
   */
  useEffect(() => {
    if (!isMobile) return;

    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen, isMobile]);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-dash-border bg-white/95 backdrop-blur-md">
      {/* Main Navbar */}
      <div className="mx-auto flex h-[72px] w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          onClick={closeMobileMenu}
          className="flex shrink-0 items-center gap-2.5"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber font-display text-sm font-bold text-court shadow-sm">
            SC
          </span>

          <span className="font-display text-lg font-bold tracking-wide text-dash-text sm:text-xl">
            GIS3 Infotech
          </span>
        </Link>

        {/* =====================================================
            DESKTOP NAVIGATION
        ====================================================== */}

        {!isMobile && (
          <>
            <nav className="flex items-center gap-1">
              <Link
                href="/"
                className="rounded-full px-4 py-2.5 text-sm font-medium text-dash-text transition-colors duration-200 hover:bg-dash-bg"
              >
                Home
              </Link>

              <Link
                href="/reviews"
                className="rounded-full px-4 py-2.5 text-sm font-medium text-dash-text transition-colors duration-200 hover:bg-dash-bg"
              >
                All Reviews
              </Link>

              {/* Imported Reviews */}
              <div
                ref={dropdownRef}
                className="relative"
              >
                <button
                  type="button"
                  onClick={() =>
                    setDesktopDropdownOpen((previous) => !previous)
                  }
                  aria-expanded={desktopDropdownOpen}
                  aria-haspopup="menu"
                  className="flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium text-dash-text transition-colors duration-200 hover:bg-dash-bg"
                >
                  Imported Reviews

                  <ChevronDown
                    size={15}
                    className={`transition-transform duration-200 ${
                      desktopDropdownOpen
                        ? 'rotate-180'
                        : ''
                    }`}
                  />
                </button>

                {desktopDropdownOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-full mt-3 w-56 overflow-hidden rounded-2xl border border-dash-border bg-white p-2 shadow-[0_15px_45px_rgba(15,23,42,0.12)]"
                  >
                     {/* Google */}
                    <Link
  href="/reviews/google"
  role="menuitem"
  onClick={() => setDesktopDropdownOpen(false)}
  className="mt-1 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-dash-text transition-colors hover:bg-blue-50"
>
  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
    <span className="text-sm font-bold text-blue-600">
      G
    </span>
  </span>

  <div>
    <p className="font-semibold">
      Google
    </p>

    <p className="text-[11px] text-slate-400">
      View reviews
    </p>
  </div>
</Link>
                    {/* Trustpilot */}
                    <Link
                      href="/reviews/trustpilot"
                      role="menuitem"
                      onClick={() =>
                        setDesktopDropdownOpen(false)
                      }
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-dash-text transition-colors hover:bg-trustpilot-bg"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-trustpilot-bg">
                        <Star
                          size={16}
                          className="fill-trustpilot text-trustpilot"
                        />
                      </span>

                      <div>
                        <p className="font-semibold">
                          Trustpilot
                        </p>

                        <p className="text-[11px] text-slate-400">
                          View reviews
                        </p>
                      </div>
                    </Link>

                    {/* Glassdoor */}
                    <Link
                      href="/reviews/glassdoor"
                      role="menuitem"
                      onClick={() =>
                        setDesktopDropdownOpen(false)
                      }
                      className="mt-1 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-dash-text transition-colors hover:bg-glassdoor-bg"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-glassdoor-bg">
                        <span className="h-3 w-3 rounded-full bg-glassdoor" />
                      </span>

                      <div>
                        <p className="font-semibold">
                          Glassdoor
                        </p>

                        <p className="text-[11px] text-slate-400">
                          View reviews
                        </p>
                      </div>
                    </Link>

                  </div>
                )}
              </div>
            </nav>

            {/* Desktop Write Review */}
            <Link
              href="/reviews/new"
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-amber px-5 py-2.5 font-display text-xs font-bold uppercase tracking-[0.08em] text-court shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              Write a Review
            </Link>
          </>
        )}

        {/* =====================================================
            MOBILE MENU BUTTON
        ====================================================== */}

        {isMobile && (
          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen((previous) => !previous)
            }
            aria-label={
              mobileMenuOpen
                ? 'Close navigation menu'
                : 'Open navigation menu'
            }
            aria-expanded={mobileMenuOpen}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-dash-border bg-white text-dash-text shadow-sm transition active:scale-95"
          >
            {mobileMenuOpen ? (
              <X size={21} />
            ) : (
              <Menu size={21} />
            )}
          </button>
        )}
      </div>

      {/* =====================================================
          MOBILE NAVIGATION
      ====================================================== */}

      {isMobile && mobileMenuOpen && (
        <div className="absolute left-0 top-full w-full border-t border-dash-border bg-white shadow-xl">
          <nav className="mx-auto max-h-[calc(100vh-72px)] overflow-y-auto px-4 py-4">
            <div className="flex flex-col gap-1">
              {/* Home */}
              <Link
                href="/"
                onClick={closeMobileMenu}
                className="rounded-xl px-4 py-3.5 text-sm font-semibold text-dash-text transition hover:bg-dash-bg"
              >
                Home
              </Link>

              {/* All Reviews */}
              <Link
                href="/reviews"
                onClick={closeMobileMenu}
                className="rounded-xl px-4 py-3.5 text-sm font-semibold text-dash-text transition hover:bg-dash-bg"
              >
                All Reviews
              </Link>

              {/* Imported Reviews */}
              <div className="overflow-hidden">
                <button
                  type="button"
                  onClick={() =>
                    setMobileDropdownOpen(
                      (previous) => !previous
                    )
                  }
                  className="flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-left text-sm font-semibold text-dash-text transition hover:bg-dash-bg"
                >
                  Imported Reviews

                  <ChevronDown
                    size={17}
                    className={`transition-transform duration-200 ${
                      mobileDropdownOpen
                        ? 'rotate-180'
                        : ''
                    }`}
                  />
                </button>

                {mobileDropdownOpen && (
                  <div className="mx-3 mb-2 mt-1 space-y-1 rounded-xl bg-slate-50 p-2">
                        {/* Google */}
                      <Link
                      href="/reviews/google"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-dash-text transition hover:bg-glassdoor-bg"
                    >
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-glassdoor" />

                      Google
                    </Link>
                    {/* Trustpilot */}
                    <Link
                      href="/reviews/trustpilot"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-dash-text transition hover:bg-trustpilot-bg"
                    >
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-trustpilot" />

                      Trustpilot
                    </Link>

                    {/* Glassdoor */}
                    <Link
                      href="/reviews/glassdoor"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-dash-text transition hover:bg-glassdoor-bg"
                    >
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-glassdoor" />

                      Glassdoor
                    </Link>

                      
                  </div>
                )}
              </div>

              {/* Mobile CTA */}
              <Link
                href="/reviews/new"
                onClick={closeMobileMenu}
                className="mt-3 flex w-full items-center justify-center rounded-xl bg-amber px-5 py-3.5 font-display text-sm font-bold uppercase tracking-wide text-court shadow-sm transition active:scale-[0.99]"
              >
                Write a Review
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}