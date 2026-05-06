import type { InvoiceBooking } from "@/lib/invoicePdf";

export type PassType = "check-in" | "check-out";

export function getBookingUserId(email: string) {
  return email.trim().toLowerCase();
}

export function buildBookingPassPayload(booking: InvoiceBooking, type: PassType) {
  return JSON.stringify({
    passType: type,
    bookingId: booking.id,
    guest: booking.guestName,
    email: booking.email,
    room: booking.roomName,
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
    guests: booking.guests,
    status: booking.status,
    issuedBy: "Grand Azure Resort",
  });
}

export function getQrCodeUrl(payload: string, size = 180) {
  const encoded = encodeURIComponent(payload);
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=12&data=${encoded}`;
}

export function getBookingPassUrl(booking: InvoiceBooking, type: PassType, size = 180) {
  return getQrCodeUrl(buildBookingPassPayload(booking, type), size);
}
