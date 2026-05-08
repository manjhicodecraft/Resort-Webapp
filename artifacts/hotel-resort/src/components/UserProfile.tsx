import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  CalendarDays,
  IndianRupee,
  LogIn,
  Mail,
  ShieldCheck,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getBookings, getCurrentUser } from "@/lib/auth";
import { getBookingUserId } from "@/lib/bookingPass";
import type { InvoiceBooking } from "@/lib/invoicePdf";

type StoredBooking = InvoiceBooking & {
  userId?: string;
};

function ProfileMetric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(42,75%,94%)] text-[hsl(42,75%,38%)]">
          {icon}
        </div>
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="text-xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default function UserProfile() {
  const [, setLocation] = useLocation();
  const [bookings, setBookings] = useState<StoredBooking[]>([]);
  const user = getCurrentUser();

  useEffect(() => {
    setBookings(getBookings());
  }, []);

  const userBookings = useMemo(() => {
    if (!user) return [];

    const userId = getBookingUserId(user.email);
    return bookings.filter(booking => {
      const bookingUserId = booking.userId || getBookingUserId(booking.email);
      return bookingUserId === userId;
    });
  }, [bookings, user]);

  const profileStats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming = userBookings.filter(booking => new Date(booking.checkOut).getTime() >= today.getTime()).length;
    const totalSpent = userBookings
      .filter(booking => booking.status !== "cancelled")
      .reduce((sum, booking) => sum + booking.totalPrice, 0);

    return {
      totalBookings: userBookings.length,
      totalSpent,
      upcoming,
    };
  }, [userBookings]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[hsl(40,20%,97%)] px-4 pt-24">
        <div className="mx-auto max-w-xl rounded-xl border border-gray-100 bg-white p-8 text-center shadow-sm">
          <LogIn className="mx-auto mb-3 h-10 w-10 text-[hsl(42,75%,45%)]" />
          <h1 className="mb-2 font-serif text-2xl font-bold text-gray-900">Login required</h1>
          <p className="mb-5 text-sm text-gray-600">Please login to view your profile and stay history.</p>
          <Button onClick={() => setLocation("/auth")} className="bg-[hsl(220,35%,14%)] text-white">
            Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(40,20%,97%)] px-4 pb-24 pt-24" data-testid="page-user-profile">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="bg-[hsl(220,35%,14%)] px-6 py-8 text-white">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[hsl(42,75%,52%)] text-2xl font-bold text-[hsl(220,35%,10%)]">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-[hsl(42,75%,62%)]">Guest Profile</p>
                  <h1 className="mt-1 font-serif text-3xl font-bold">{user.name}</h1>
                  <p className="mt-1 flex items-center gap-2 text-sm text-gray-300">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </p>
                </div>
              </div>
              {user.isAdmin && (
                <div className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/10 px-3 py-2 text-sm font-semibold">
                  <ShieldCheck className="h-4 w-4 text-[hsl(42,75%,62%)]" />
                  Admin Account
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-4 p-6 md:grid-cols-3">
            <ProfileMetric
              icon={<CalendarDays className="h-5 w-5" />}
              label="Total Bookings"
              value={String(profileStats.totalBookings)}
            />
            <ProfileMetric
              icon={<CalendarDays className="h-5 w-5" />}
              label="Upcoming Stays"
              value={String(profileStats.upcoming)}
            />
            <ProfileMetric
              icon={<IndianRupee className="h-5 w-5" />}
              label="Total Spent"
              value={`Rs. ${profileStats.totalSpent.toLocaleString("en-IN")}`}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr_280px]">
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(42,75%,94%)] text-[hsl(42,75%,38%)]">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold text-gray-900">Account Details</h2>
                <p className="text-sm text-gray-500">Your current Grand Azure account information.</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-gray-100 bg-[hsl(40,20%,98%)] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Full Name</p>
                <p className="mt-1 font-semibold text-gray-900">{user.name}</p>
              </div>
              <div className="rounded-lg border border-gray-100 bg-[hsl(40,20%,98%)] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Email</p>
                <p className="mt-1 break-all font-semibold text-gray-900">{user.email}</p>
              </div>
              <div className="rounded-lg border border-gray-100 bg-[hsl(40,20%,98%)] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Account Type</p>
                <p className="mt-1 font-semibold text-gray-900">{user.isAdmin ? "Admin" : "Guest"}</p>
              </div>
              <div className="rounded-lg border border-gray-100 bg-[hsl(40,20%,98%)] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Member Status</p>
                <p className="mt-1 font-semibold text-gray-900">Active</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="font-serif text-xl font-bold text-gray-900">Quick Actions</h2>
            <div className="mt-5 flex flex-col gap-3">
              <Link href="/my-bookings">
                <Button className="w-full bg-[hsl(220,35%,14%)] text-white">View My Bookings</Button>
              </Link>
              <Link href="/booking">
                <Button variant="outline" className="w-full border-[hsl(42,75%,45%)] text-[hsl(42,75%,38%)]">
                  Book Another Stay
                </Button>
              </Link>
              {user.isAdmin && (
                <Link href="/admin">
                  <Button variant="outline" className="w-full">
                    Open Admin Panel
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
