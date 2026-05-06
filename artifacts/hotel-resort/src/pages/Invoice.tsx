import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getBookings, getCurrentUser } from "@/lib/auth";
import { getBookingUserId } from "@/lib/bookingPass";
import { downloadInvoicePdf, type InvoiceBooking } from "@/lib/invoicePdf";

function daysBetween(a: string, b: string) {
  const diff = new Date(b).getTime() - new Date(a).getTime();
  return Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

export default function Invoice() {
  const [booking, setBooking] = useState<InvoiceBooking | null>(null);
  const [location] = useLocation();

  useEffect(() => {
    const bookings = getBookings();
    const params = new URLSearchParams(location.split("?")[1] || "");
    const bookingId = params.get("id");
    const user = getCurrentUser();
    const userId = user ? getBookingUserId(user.email) : "";
    const visibleBookings = user?.isAdmin
      ? bookings
      : bookings.filter((item: InvoiceBooking & { userId?: string }) => {
          const bookingUserId = item.userId || getBookingUserId(item.email);
          return !userId || bookingUserId === userId;
        });
    const selectedBooking = bookingId
      ? visibleBookings.find((item: InvoiceBooking) => item.id === bookingId)
      : visibleBookings[0];

    if (selectedBooking) {
      setBooking(selectedBooking);
    } else {
      setBooking(null);
    }
  }, [location]);
  const handleDownloadPDF = () => {
    if (booking) downloadInvoicePdf(booking);
  };

  if (!booking) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-[hsl(40,20%,97%)]" data-testid="page-invoice-empty">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No booking found. Please make a booking first.</p>
          <a href="/booking" className="text-[hsl(42,75%,45%)] font-medium hover:underline">Make a Booking</a>
        </div>
      </div>
    );
  }

  const nights = daysBetween(booking.checkIn, booking.checkOut);
  const roomPrice = Math.round(booking.totalPrice / nights);
  const taxes = Math.round(booking.totalPrice * 0.12);
  const total = booking.totalPrice + taxes;

  return (
    <div className="min-h-screen pt-16 bg-[hsl(40,20%,97%)]" data-testid="page-invoice">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="flex gap-3 mb-6 print:hidden">
          <Button onClick={handleDownloadPDF} className="bg-[hsl(220,35%,14%)] text-white" data-testid="button-download-invoice">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden" id="invoice">
          {/* Header */}
          <div className="bg-[hsl(220,35%,12%)] p-8 text-white">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-full bg-[hsl(42,75%,52%)] flex items-center justify-center">
                    <span className="text-[hsl(220,35%,10%)] font-bold text-sm font-serif">G</span>
                  </div>
                  <span className="font-serif font-bold text-xl">Grand Azure Resort</span>
                </div>
                <p className="text-gray-400 text-xs">1, Azure Bay Road, Alibaug, Maharashtra 402201</p>
                <p className="text-gray-400 text-xs">reservations@grandazure.com | +91 22 6600 7700</p>
                <p className="text-gray-400 text-xs">GST No: 27AAACG1234A1Z5</p>
              </div>
              <div className="text-right">
                <p className="font-serif text-2xl font-bold text-[hsl(42,75%,62%)]">INVOICE</p>
                <p className="text-gray-400 text-sm mt-1">{booking.id}</p>
                <p className="text-gray-400 text-xs">Date: {booking.createdAt}</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Guest Info */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Billed To</p>
                <p className="font-semibold text-gray-900" data-testid="text-invoice-guest">{booking.guestName}</p>
                <p className="text-sm text-gray-600">{booking.email}</p>
                <p className="text-sm text-gray-600">{booking.phone}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Reservation Details</p>
                <div className="space-y-1 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Reference</span>
                    <span className="font-bold text-[hsl(42,75%,40%)]">{booking.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Check-in</span>
                    <span>{booking.checkIn}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Check-out</span>
                    <span>{booking.checkOut}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Guests</span>
                    <span>{booking.guests}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Payment</span>
                    <span>{booking.paymentMethod}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 text-gray-600 font-semibold uppercase text-xs tracking-wider">Description</th>
                    <th className="text-center py-3 text-gray-600 font-semibold uppercase text-xs tracking-wider">Nights</th>
                    <th className="text-right py-3 text-gray-600 font-semibold uppercase text-xs tracking-wider">Rate</th>
                    <th className="text-right py-3 text-gray-600 font-semibold uppercase text-xs tracking-wider">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-4">
                      <p className="font-medium text-gray-900">{booking.roomName}</p>
                      <p className="text-xs text-gray-500">Deluxe Room Accommodation</p>
                    </td>
                    <td className="py-4 text-center">{nights}</td>
                    <td className="py-4 text-right">&#8377;{roomPrice.toLocaleString("en-IN")}</td>
                    <td className="py-4 text-right font-medium">&#8377;{booking.totalPrice.toLocaleString("en-IN")}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 text-gray-600">Complimentary Breakfast (2 persons)</td>
                    <td className="py-3 text-center">{nights}</td>
                    <td className="py-3 text-right text-green-600">Included</td>
                    <td className="py-3 text-right text-green-600">&#8377;0</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="border-t border-gray-200">
                    <td colSpan={3} className="py-2 text-right text-gray-600">Subtotal</td>
                    <td className="py-2 text-right font-medium">&#8377;{booking.totalPrice.toLocaleString("en-IN")}</td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="py-2 text-right text-gray-600">GST (12%)</td>
                    <td className="py-2 text-right font-medium">&#8377;{taxes.toLocaleString("en-IN")}</td>
                  </tr>
                  <tr className="border-t-2 border-gray-900">
                    <td colSpan={3} className="py-3 text-right font-bold text-gray-900 text-base">Total Amount</td>
                    <td className="py-3 text-right font-bold text-[hsl(42,75%,40%)] text-base">&#8377;{total.toLocaleString("en-IN")}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Payment Status */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8 ${booking.status === "approved" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
              <div className={`w-2 h-2 rounded-full ${booking.status === "approved" ? "bg-green-600" : "bg-amber-600"}`} />
              Payment {booking.status === "approved" ? "Confirmed" : "Pending Confirmation"}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 pt-6 text-center">
              <p className="font-serif text-lg font-semibold text-gray-900 mb-1">Thank you for choosing Grand Azure Resort</p>
              <p className="text-gray-500 text-sm">We look forward to welcoming you. For any questions, contact us at reservations@grandazure.com</p>
              <p className="text-xs text-gray-400 mt-4">This is a computer-generated invoice and does not require a signature. Demo only — no real transaction occurred.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
