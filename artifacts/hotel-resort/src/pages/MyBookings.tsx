import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Download,
  FileText,
  IndianRupee,
  LogIn,
  QrCode,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getBookings, getCurrentUser } from "@/lib/auth";
import { getBookingPassUrl, getBookingUserId } from "@/lib/bookingPass";
import { downloadInvoicePdf, type InvoiceBooking } from "@/lib/invoicePdf";

type StoredBooking = InvoiceBooking & {
  userId?: string;
  roomId?: number;
};

type BookingTab = "all" | "upcoming" | "completed" | "cancelled";
type SortMode = "newest" | "oldest" | "highest" | "upcoming";

const PAGE_SIZE = 5;

const TABS: Array<{ id: BookingTab; label: string }> = [
  { id: "all", label: "All Bookings" },
  { id: "upcoming", label: "Upcoming" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

function todayStart() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

function getStatus(booking: StoredBooking) {
  if (booking.status === "cancelled") return "cancelled";
  if (new Date(booking.checkOut).getTime() < todayStart().getTime()) return "completed";
  if (booking.status === "approved") return "confirmed";
  return "pending";
}

function getTabForBooking(booking: StoredBooking): BookingTab {
  const status = getStatus(booking);
  if (status === "cancelled") return "cancelled";
  if (status === "completed") return "completed";
  return "upcoming";
}

function statusMeta(booking: StoredBooking) {
  const status = getStatus(booking);

  if (status === "confirmed") {
    return { label: "Confirmed", className: "bg-blue-100 text-blue-700 border-blue-200" };
  }
  if (status === "completed") {
    return { label: "Completed", className: "bg-green-100 text-green-700 border-green-200" };
  }
  if (status === "cancelled") {
    return { label: "Cancelled", className: "bg-red-100 text-red-700 border-red-200" };
  }
  return { label: "Pending", className: "bg-amber-100 text-amber-700 border-amber-200" };
}

function formatRange(start: number, end: number, total: number) {
  if (total === 0) return "Showing 0 of 0 bookings";
  return `Showing ${start}-${end} of ${total} bookings`;
}

function BookingPassQr({ booking, type }: { booking: InvoiceBooking; type: "check-in" | "check-out" }) {
  const label = type === "check-in" ? "Check-in" : "Check-out";
  const qrUrl = getBookingPassUrl(booking, type, 150);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold text-gray-700">{label} QR</p>
        <QrCode className="w-4 h-4 text-[hsl(42,75%,40%)]" />
      </div>
      <img
        src={qrUrl}
        alt={`${label} QR pass for ${booking.id}`}
        className="w-full aspect-square rounded-md border border-gray-100 bg-white object-contain"
        loading="lazy"
      />
      <p className="mt-2 text-[11px] text-gray-500 font-mono break-all">{booking.id}</p>
    </div>
  );
}

function SummaryCard({
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
        <div className="w-10 h-10 rounded-lg bg-[hsl(42,75%,94%)] text-[hsl(42,75%,38%)] flex items-center justify-center">
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

export default function MyBookings() {
  const [, setLocation] = useLocation();
  const [bookings, setBookings] = useState<StoredBooking[]>([]);
  const [activeTab, setActiveTab] = useState<BookingTab>("all");
  const [search, setSearch] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [page, setPage] = useState(1);
  const [expandedQr, setExpandedQr] = useState<Record<string, boolean>>({});
  const user = getCurrentUser();

  useEffect(() => {
    setBookings(getBookings());
  }, []);

  useEffect(() => {
    setPage(1);
  }, [activeTab, search, sortMode]);

  const userBookings = useMemo(() => {
    if (!user) return [];
    const userId = getBookingUserId(user.email);
    return bookings.filter(booking => {
      const bookingUserId = booking.userId || getBookingUserId(booking.email);
      return bookingUserId === userId;
    });
  }, [bookings, user]);

  const summary = useMemo(() => {
    const upcoming = userBookings.filter(booking => getTabForBooking(booking) === "upcoming").length;
    const completed = userBookings.filter(booking => getTabForBooking(booking) === "completed").length;
    const totalSpent = userBookings
      .filter(booking => getStatus(booking) !== "cancelled")
      .reduce((sum, booking) => sum + booking.totalPrice, 0);

    return {
      completed,
      total: userBookings.length,
      totalSpent,
      upcoming,
    };
  }, [userBookings]);

  const filteredBookings = useMemo(() => {
    const query = search.trim().toLowerCase();

    return userBookings
      .filter(booking => activeTab === "all" || getTabForBooking(booking) === activeTab)
      .filter(booking => {
        if (!query) return true;
        return (
          booking.id.toLowerCase().includes(query) ||
          booking.roomName.toLowerCase().includes(query) ||
          booking.checkIn.includes(query) ||
          booking.checkOut.includes(query)
        );
      })
      .sort((a, b) => {
        if (sortMode === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        if (sortMode === "highest") return b.totalPrice - a.totalPrice;
        if (sortMode === "upcoming") return new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime();
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [activeTab, search, sortMode, userBookings]);

  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const pageBookings = filteredBookings.slice(pageStart, pageStart + PAGE_SIZE);
  const showingStart = filteredBookings.length ? pageStart + 1 : 0;
  const showingEnd = Math.min(pageStart + PAGE_SIZE, filteredBookings.length);

  if (!user) {
    return (
      <div className="min-h-screen pt-24 bg-[hsl(40,20%,97%)] px-4">
        <div className="max-w-xl mx-auto bg-white rounded-xl border border-gray-100 p-8 text-center">
          <LogIn className="w-10 h-10 mx-auto text-[hsl(42,75%,45%)] mb-3" />
          <h1 className="font-serif text-2xl font-bold text-gray-900 mb-2">Login required</h1>
          <p className="text-gray-600 text-sm mb-5">Please login to view your bookings, invoices, and QR passes.</p>
          <Button onClick={() => setLocation("/auth")} className="bg-[hsl(220,35%,14%)] text-white">
            Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-[hsl(40,20%,97%)] px-4 pb-24" data-testid="page-my-bookings">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <p className="text-sm font-semibold text-[hsl(42,75%,40%)] uppercase tracking-wide">Guest Profile</p>
            <h1 className="font-serif text-3xl font-bold text-gray-900 mt-1">My Bookings</h1>
            <p className="text-gray-600 text-sm mt-2">{user.name} | {user.email}</p>
          </div>
          <Link href="/booking" className="hidden md:block">
            <Button className="bg-[hsl(220,35%,14%)] text-white">Book Another Stay</Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <SummaryCard icon={<CalendarDays className="w-5 h-5" />} label="Total Bookings" value={String(summary.total)} />
          <SummaryCard icon={<CalendarDays className="w-5 h-5" />} label="Upcoming Stays" value={String(summary.upcoming)} />
          <SummaryCard icon={<FileText className="w-5 h-5" />} label="Completed Trips" value={String(summary.completed)} />
          <SummaryCard icon={<IndianRupee className="w-5 h-5" />} label="Total Spent" value={`Rs. ${summary.totalSpent.toLocaleString("en-IN")}`} />
        </div>

        <div className="sticky top-16 z-20 -mx-4 px-4 py-3 bg-[hsl(40,20%,97%)] border-y border-gray-100 mb-5">
          <div className="max-w-6xl mx-auto flex flex-col gap-3">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`shrink-0 rounded-md px-3 py-2 text-sm font-semibold border transition-colors ${
                    activeTab === tab.id
                      ? "bg-[hsl(220,35%,14%)] text-white border-[hsl(220,35%,14%)]"
                      : "bg-white text-gray-700 border-gray-200 hover:border-[hsl(42,75%,45%)]"
                  }`}
                  data-testid={`tab-${tab.id}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  value={search}
                  onChange={event => setSearch(event.target.value)}
                  placeholder="Search Booking ID..."
                  className="pl-9 bg-white"
                  data-testid="input-search-bookings"
                />
              </div>
              <select
                value={sortMode}
                onChange={event => setSortMode(event.target.value as SortMode)}
                className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700"
                data-testid="select-sort-bookings"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Amount</option>
                <option value="upcoming">Upcoming First</option>
              </select>
            </div>
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
            <CalendarDays className="w-10 h-10 mx-auto text-[hsl(42,75%,45%)] mb-3" />
            <h2 className="font-serif text-xl font-semibold text-gray-900 mb-2">No bookings yet</h2>
            <p className="text-gray-600 text-sm mb-5">Book your first luxury stay.</p>
            <Link href="/booking">
              <Button className="bg-[hsl(42,75%,45%)] text-white">Book Now</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
              <p className="text-sm text-gray-600">{formatRange(showingStart, showingEnd, filteredBookings.length)}</p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={safePage === 1}
                  onClick={() => setPage(current => Math.max(1, current - 1))}
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }).map((_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <Button
                      key={pageNumber}
                      variant={pageNumber === safePage ? "default" : "outline"}
                      size="sm"
                      className={pageNumber === safePage ? "bg-[hsl(220,35%,14%)] text-white" : ""}
                      onClick={() => setPage(pageNumber)}
                    >
                      {pageNumber}
                    </Button>
                  );
                })}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={safePage === totalPages}
                  onClick={() => setPage(current => Math.min(totalPages, current + 1))}
                >
                  Next
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {pageBookings.map(booking => {
                const meta = statusMeta(booking);
                const qrOpen = Boolean(expandedQr[booking.id]);

                return (
                  <div key={booking.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden" data-testid={`card-booking-${booking.id}`}>
                    <div className="p-5">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h2 className="font-serif text-xl font-bold text-gray-900">{booking.roomName}</h2>
                            <Badge variant="outline" className={meta.className}>{meta.label}</Badge>
                          </div>
                          <p className="font-mono text-xs font-semibold text-[hsl(42,75%,40%)]">{booking.id}</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                            <div>
                              <p className="text-gray-500 text-xs">Dates</p>
                              <p className="font-semibold text-gray-900">{booking.checkIn}</p>
                              <p className="text-xs text-gray-500">to {booking.checkOut}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 text-xs">Guests</p>
                              <p className="font-semibold text-gray-900">{booking.guests}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 text-xs">Payment</p>
                              <p className="font-semibold text-gray-900">{booking.paymentMethod}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 text-xs">Amount</p>
                              <p className="font-semibold text-[hsl(42,75%,40%)]">Rs. {booking.totalPrice.toLocaleString("en-IN")}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 lg:justify-end">
                          <Link href={`/invoice?id=${encodeURIComponent(booking.id)}`}>
                            <Button variant="outline" className="border-[hsl(220,35%,14%)] text-[hsl(220,35%,14%)]" data-testid={`button-view-invoice-${booking.id}`}>
                              <FileText className="w-4 h-4 mr-2" />
                              Invoice
                            </Button>
                          </Link>
                          <Button onClick={() => downloadInvoicePdf(booking)} className="bg-[hsl(220,35%,14%)] text-white" data-testid={`button-download-invoice-${booking.id}`}>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setExpandedQr(current => ({ ...current, [booking.id]: !current[booking.id] }))}
                            data-testid={`button-toggle-qr-${booking.id}`}
                          >
                            <QrCode className="w-4 h-4 mr-2" />
                            View QR
                            {qrOpen ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {qrOpen && (
                      <div className="p-5 bg-[hsl(40,20%,98%)] border-t border-gray-100">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
                          <BookingPassQr booking={booking} type="check-in" />
                          <BookingPassQr booking={booking} type="check-out" />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <Link href="/booking" className="md:hidden fixed right-4 bottom-4 z-30">
        <Button className="rounded-full shadow-lg bg-[hsl(220,35%,14%)] text-white px-5">Book Another Stay</Button>
      </Link>
    </div>
  );
}
