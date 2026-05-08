import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import { getCurrentUser, logout } from "@/lib/auth";
import type { User as UserType } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  lang: "en" | "hi";
  onLangToggle: () => void;
}

const NAV_LINKS = [
  { href: "/", label: { en: "Home", hi: "होम" } },
  { href: "/rooms", label: { en: "Rooms", hi: "कमरे" } },
  { href: "/search", label: { en: "Search", hi: "खोज" } },
  { href: "/reviews", label: { en: "Reviews", hi: "समीक्षा" } },
  { href: "/virtual-tour", label: { en: "Virtual Tour", hi: "वर्चुअल टूर" } },
  { href: "/contact", label: { en: "Contact", hi: "संपर्क" } },
];


export default function Navbar({ lang, onLangToggle }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [location, setLocation] = useLocation();

  useEffect(() => {
    setUser(getCurrentUser());
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    setLocation("/");
  };

  const refreshUser = () => {
    setUser(getCurrentUser());
  };

  useEffect(() => {
    window.addEventListener("focus", refreshUser);
    return () => window.removeEventListener("focus", refreshUser);
  }, []);

  // Home page par transparent, baaki par solid dark
  const isHome = location === "/";
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isHome
          ? (scrolled ? "bg-[hsl(220,35%,10%)] shadow-lg" : "bg-[hsl(220,35%,10%/0.95)]")
          : "bg-[hsl(220,35%,10%)] shadow-lg"
      }`}
      data-testid="navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group" data-testid="link-home-logo">
            <div className="w-8 h-8 rounded-full bg-[hsl(42,75%,52%)] flex items-center justify-center">
              <span className="text-[hsl(220,35%,10%)] font-bold text-sm font-serif">G</span>
            </div>
            <span className="text-white font-serif font-semibold text-lg tracking-wide group-hover:text-[hsl(42,75%,62%)] transition-colors">
              Grand Azure
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-300 hover:text-[hsl(42,75%,62%)] px-3 py-2 text-sm font-medium transition-colors rounded-md hover:bg-white/5"
                data-testid={`link-nav-${link.href.replace("/", "") || "home"}`}
              >
                {link.label[lang]}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={onLangToggle}
              className="text-gray-300 hover:text-white text-xs font-medium px-2 py-1 rounded border border-white/20 hover:border-white/40 transition-all"
              data-testid="button-lang-toggle"
            >
              {lang === "en" ? "HI" : "EN"}
            </button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-gray-300 hover:text-white hover:bg-white/10 flex items-center gap-2"
                    data-testid="button-user-menu"
                  >
                    <div className="w-7 h-7 rounded-full bg-[hsl(42,75%,52%)] flex items-center justify-center">
                      <span className="text-[hsl(220,35%,10%)] font-bold text-xs">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm">{user.name}</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {user.isAdmin && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/admin" data-testid="link-admin-panel">Admin Panel</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/user-profile" data-testid="link-user-profile">User Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/my-bookings" data-testid="link-my-bookings">My Bookings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive"
                    data-testid="button-logout"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {lang === "en" ? "Logout" : "लॉगआउट"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth">
                <Button
                  size="sm"
                  className="bg-[hsl(42,75%,52%)] hover:bg-[hsl(42,75%,45%)] text-[hsl(220,35%,10%)] font-semibold"
                  data-testid="button-login"
                >
                  <User className="w-4 h-4 mr-1" />
                  {lang === "en" ? "Login" : "लॉगिन"}
                </Button>
              </Link>
            )}
          </div>

          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
            data-testid="button-mobile-menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-[hsl(220,35%,8%)] border-t border-white/10" data-testid="mobile-menu">
          <div className="px-4 py-4 space-y-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-gray-300 hover:text-[hsl(42,75%,62%)] py-2 text-sm font-medium transition-colors"
                onClick={() => setMenuOpen(false)}
                data-testid={`link-mobile-nav-${link.href.replace("/", "") || "home"}`}
              >
                {link.label[lang]}
              </Link>
            ))}
            <div className="pt-2 border-t border-white/10 flex items-center gap-3">
              <button
                onClick={onLangToggle}
                className="text-gray-400 hover:text-white text-xs px-2 py-1 rounded border border-white/20"
                data-testid="button-mobile-lang-toggle"
              >
                {lang === "en" ? "HI" : "EN"}
              </button>
              {user ? (
                <>
                  <Link
                    href="/user-profile"
                    className="text-[hsl(42,75%,62%)] text-sm font-medium"
                    onClick={() => setMenuOpen(false)}
                    data-testid="link-mobile-user-profile"
                  >
                    User Profile
                  </Link>
                  <Link
                    href="/my-bookings"
                    className="text-[hsl(42,75%,62%)] text-sm font-medium"
                    onClick={() => setMenuOpen(false)}
                    data-testid="link-mobile-my-bookings"
                  >
                    My Bookings
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setMenuOpen(false); }}
                    className="text-red-400 text-sm font-medium"
                    data-testid="button-mobile-logout"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/auth"
                  className="text-[hsl(42,75%,62%)] text-sm font-medium"
                  onClick={() => setMenuOpen(false)}
                  data-testid="link-mobile-login"
                >
                  Login / Signup
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
