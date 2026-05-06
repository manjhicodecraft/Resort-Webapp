import type { InvoiceBooking } from "@/lib/invoicePdf";

function buildInvoiceUrl(bookingId: string) {
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
  return `${window.location.origin}${basePath}/invoice?id=${encodeURIComponent(bookingId)}`;
}

export function openBookingConfirmationEmail(booking: InvoiceBooking) {
  const invoiceUrl = buildInvoiceUrl(booking.id);
  const subject = `Grand Azure booking confirmed - ${booking.id}`;
  const body = [
    `Dear ${booking.guestName},`,
    "",
    "Your booking at Grand Azure Resort has been received.",
    "",
    `Booking ID: ${booking.id}`,
    `Room: ${booking.roomName}`,
    `Check-in: ${booking.checkIn}`,
    `Check-out: ${booking.checkOut}`,
    `Guests: ${booking.guests}`,
    `Payment Method: ${booking.paymentMethod}`,
    `Amount Paid: Rs. ${booking.totalPrice.toLocaleString("en-IN")}`,
    "",
    `View and download your invoice: ${invoiceUrl}`,
    "",
    "Your check-in and check-out QR passes are available in My Bookings.",
    "",
    "Regards,",
    "Grand Azure Resort",
  ].join("\n");

  const gmailUrl = new URL("https://mail.google.com/mail/");
  gmailUrl.searchParams.set("view", "cm");
  gmailUrl.searchParams.set("fs", "1");
  gmailUrl.searchParams.set("to", booking.email);
  gmailUrl.searchParams.set("su", subject);
  gmailUrl.searchParams.set("body", body);

  window.open(gmailUrl.toString(), "_blank", "noopener,noreferrer");
}
