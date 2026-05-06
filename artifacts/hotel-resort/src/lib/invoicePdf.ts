import jsPDF from "jspdf";

export interface InvoiceBooking {
  id: string;
  guestName: string;
  email: string;
  phone: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  paymentMethod: string;
  createdAt: string;
  status: string;
}

function daysBetween(a: string, b: string) {
  const diff = new Date(b).getTime() - new Date(a).getTime();
  return Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

function formatINR(value: number) {
  return `Rs. ${value.toLocaleString("en-IN")}`;
}

export function downloadInvoicePdf(booking: InvoiceBooking) {
  const nights = daysBetween(booking.checkIn, booking.checkOut);
  const roomPrice = Math.round(booking.totalPrice / nights);
  const taxes = Math.round(booking.totalPrice * 0.12);
  const total = booking.totalPrice + taxes;
  const paymentStatus = booking.status === "approved" ? "Confirmed" : "Pending Confirmation";

  const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 48;
  let y = 56;

  pdf.setFillColor(24, 33, 48);
  pdf.rect(0, 0, pageWidth, 130, "F");

  pdf.setTextColor(255, 255, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(20);
  pdf.text("Grand Azure Resort", margin, y);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  y += 18;
  pdf.text("1, Azure Bay Road, Alibaug, Maharashtra 402201", margin, y);
  y += 14;
  pdf.text("reservations@grandazure.com | +91 22 6600 7700", margin, y);
  y += 14;
  pdf.text("GST No: 27AAACG1234A1Z5", margin, y);

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(24);
  pdf.setTextColor(245, 183, 61);
  pdf.text("INVOICE", pageWidth - margin, 58, { align: "right" });
  pdf.setFontSize(10);
  pdf.setTextColor(220, 224, 230);
  pdf.text(booking.id, pageWidth - margin, 78, { align: "right" });
  pdf.text(`Date: ${booking.createdAt}`, pageWidth - margin, 94, { align: "right" });

  y = 170;
  pdf.setTextColor(30, 41, 59);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.text("BILLED TO", margin, y);
  pdf.text("RESERVATION DETAILS", pageWidth / 2 + 20, y);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  y += 20;
  pdf.text(booking.guestName, margin, y);
  y += 15;
  pdf.text(booking.email, margin, y);
  y += 15;
  pdf.text(booking.phone, margin, y);

  const detailsX = pageWidth / 2 + 20;
  let detailsY = 190;
  const details = [
    ["Reference", booking.id],
    ["Check-in", booking.checkIn],
    ["Check-out", booking.checkOut],
    ["Guests", String(booking.guests)],
    ["Payment", booking.paymentMethod],
  ];

  details.forEach(([label, value]) => {
    pdf.setTextColor(100, 116, 139);
    pdf.text(label, detailsX, detailsY);
    pdf.setTextColor(30, 41, 59);
    pdf.text(value, pageWidth - margin, detailsY, { align: "right" });
    detailsY += 16;
  });

  y = 300;
  pdf.setDrawColor(226, 232, 240);
  pdf.setLineWidth(1);
  pdf.line(margin, y, pageWidth - margin, y);
  y += 24;

  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(71, 85, 105);
  pdf.setFontSize(9);
  pdf.text("DESCRIPTION", margin, y);
  pdf.text("NIGHTS", 320, y, { align: "center" });
  pdf.text("RATE", 420, y, { align: "right" });
  pdf.text("AMOUNT", pageWidth - margin, y, { align: "right" });

  y += 20;
  pdf.setDrawColor(226, 232, 240);
  pdf.line(margin, y, pageWidth - margin, y);
  y += 28;

  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(30, 41, 59);
  pdf.setFontSize(11);
  pdf.text(booking.roomName, margin, y);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(100, 116, 139);
  pdf.text("Deluxe Room Accommodation", margin, y + 14);
  pdf.setFontSize(10);
  pdf.setTextColor(30, 41, 59);
  pdf.text(String(nights), 320, y, { align: "center" });
  pdf.text(formatINR(roomPrice), 420, y, { align: "right" });
  pdf.text(formatINR(booking.totalPrice), pageWidth - margin, y, { align: "right" });

  y += 54;
  pdf.setDrawColor(241, 245, 249);
  pdf.line(margin, y, pageWidth - margin, y);
  y += 26;
  pdf.setTextColor(71, 85, 105);
  pdf.text("Complimentary Breakfast (2 persons)", margin, y);
  pdf.text(String(nights), 320, y, { align: "center" });
  pdf.setTextColor(22, 163, 74);
  pdf.text("Included", 420, y, { align: "right" });
  pdf.text(formatINR(0), pageWidth - margin, y, { align: "right" });

  y += 52;
  const totalsX = pageWidth - margin - 170;
  const valuesX = pageWidth - margin;
  pdf.setTextColor(71, 85, 105);
  pdf.text("Subtotal", totalsX, y, { align: "right" });
  pdf.setTextColor(30, 41, 59);
  pdf.text(formatINR(booking.totalPrice), valuesX, y, { align: "right" });

  y += 20;
  pdf.setTextColor(71, 85, 105);
  pdf.text("GST (12%)", totalsX, y, { align: "right" });
  pdf.setTextColor(30, 41, 59);
  pdf.text(formatINR(taxes), valuesX, y, { align: "right" });

  y += 18;
  pdf.setDrawColor(15, 23, 42);
  pdf.line(totalsX - 10, y, valuesX, y);
  y += 22;
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.text("Total Amount", totalsX, y, { align: "right" });
  pdf.setTextColor(176, 122, 18);
  pdf.text(formatINR(total), valuesX, y, { align: "right" });

  y += 44;
  pdf.setFillColor(255, 251, 235);
  pdf.roundedRect(margin, y - 18, 190, 30, 12, 12, "F");
  pdf.setFontSize(10);
  pdf.setTextColor(146, 64, 14);
  pdf.text(`Payment ${paymentStatus}`, margin + 14, y + 1);

  y = 730;
  pdf.setDrawColor(226, 232, 240);
  pdf.line(margin, y, pageWidth - margin, y);
  y += 28;
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(13);
  pdf.setTextColor(30, 41, 59);
  pdf.text("Thank you for choosing Grand Azure Resort", pageWidth / 2, y, { align: "center" });
  y += 18;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(100, 116, 139);
  pdf.text("We look forward to welcoming you. For any questions, contact us at reservations@grandazure.com", pageWidth / 2, y, { align: "center" });
  y += 18;
  pdf.setFontSize(8);
  pdf.setTextColor(148, 163, 184);
  pdf.text("This is a computer-generated invoice and does not require a signature. Demo only - no real transaction occurred.", pageWidth / 2, y, { align: "center" });

  pdf.save(`Invoice_${booking.id || "download"}.pdf`);
}
