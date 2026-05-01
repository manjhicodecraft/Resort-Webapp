import { Link } from "wouter";
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[hsl(220,35%,8%)] text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-[hsl(42,75%,52%)] flex items-center justify-center">
                <span className="text-[hsl(220,35%,10%)] font-bold text-sm font-serif">G</span>
              </div>
              <span className="text-white font-serif font-semibold text-lg">Grand Azure</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              A sanctuary of luxury and serenity on the Konkan Coast, where every moment is crafted to perfection.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[hsl(42,75%,52%)] hover:text-[hsl(220,35%,10%)] transition-all" data-testid="link-facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[hsl(42,75%,52%)] hover:text-[hsl(220,35%,10%)] transition-all" data-testid="link-instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[hsl(42,75%,52%)] hover:text-[hsl(220,35%,10%)] transition-all" data-testid="link-twitter">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "/rooms", label: "Rooms & Suites" },
                { href: "/booking", label: "Book Now" },
                { href: "/virtual-tour", label: "Virtual Tour" },
                { href: "/reviews", label: "Guest Reviews" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-[hsl(42,75%,62%)] transition-colors" data-testid={`footer-link-${link.label.toLowerCase().replace(/\s+/g, "-")}`}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Fine Dining</li>
              <li>Infinity Pool</li>
              <li>Luxury Spa</li>
              <li>Business Center</li>
              <li>Airport Transfer</li>
              <li>Concierge Service</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4 mt-0.5 text-[hsl(42,75%,52%)] shrink-0" />
                <span>1, Azure Bay Road, Alibaug, Maharashtra 402201, India</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Phone className="w-4 h-4 text-[hsl(42,75%,52%)] shrink-0" />
                <span>+91 22 6600 7700</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Mail className="w-4 h-4 text-[hsl(42,75%,52%)] shrink-0" />
                <span>reservations@grandazure.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            &copy; 2025 Grand Azure Resort. All rights reserved. Demo project for educational purposes.
          </p>
          <div className="flex gap-4 text-xs text-gray-500">
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
