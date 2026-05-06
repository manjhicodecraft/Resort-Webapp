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

type Align = "left" | "center" | "right";

interface TableColumn {
  label: string;
  x: number;
  width: number;
  align: Align;
}

interface LineItem {
  description: string;
  note?: string;
  nights: string;
  rate: string;
  amount: string;
  muted?: boolean;
}

const PAGE = {
  width: 595.28,
  height: 841.89,
  margin: 46,
};

const COLORS = {
  navy: [24, 33, 48] as const,
  navySoft: [42, 55, 78] as const,
  gold: [194, 137, 36] as const,
  goldLight: [250, 243, 224] as const,
  ink: [30, 41, 59] as const,
  muted: [100, 116, 139] as const,
  line: [226, 232, 240] as const,
  panel: [248, 250, 252] as const,
  success: [22, 163, 74] as const,
  warning: [146, 64, 14] as const,
};

function daysBetween(a: string, b: string) {
  const diff = new Date(b).getTime() - new Date(a).getTime();
  return Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

function formatINR(value: number) {
  return `Rs. ${value.toLocaleString("en-IN")}`;
}

function setColor(pdf: jsPDF, type: "draw" | "fill" | "text", color: readonly [number, number, number]) {
  if (type === "draw") pdf.setDrawColor(...color);
  if (type === "fill") pdf.setFillColor(...color);
  if (type === "text") pdf.setTextColor(...color);
}

function text(
  pdf: jsPDF,
  value: string,
  x: number,
  y: number,
  options: {
    align?: Align;
    color?: readonly [number, number, number];
    font?: "normal" | "bold";
    size?: number;
    maxWidth?: number;
  } = {},
) {
  const { align = "left", color = COLORS.ink, font = "normal", size = 10, maxWidth } = options;
  pdf.setFont("helvetica", font);
  pdf.setFontSize(size);
  setColor(pdf, "text", color);
  pdf.text(value, x, y, { align, maxWidth });
}

function wrappedText(
  pdf: jsPDF,
  value: string,
  x: number,
  y: number,
  maxWidth: number,
  options: {
    color?: readonly [number, number, number];
    font?: "normal" | "bold";
    lineHeight?: number;
    size?: number;
  } = {},
) {
  const { color = COLORS.ink, font = "normal", lineHeight = 13, size = 10 } = options;
  pdf.setFont("helvetica", font);
  pdf.setFontSize(size);
  setColor(pdf, "text", color);

  const lines = pdf.splitTextToSize(value, maxWidth);
  lines.forEach((line: string, index: number) => {
    pdf.text(line, x, y + index * lineHeight);
  });

  return lines.length * lineHeight;
}

function panel(pdf: jsPDF, x: number, y: number, width: number, height: number) {
  setColor(pdf, "fill", COLORS.panel);
  setColor(pdf, "draw", COLORS.line);
  pdf.roundedRect(x, y, width, height, 8, 8, "FD");
}

function drawKeyValue(
  pdf: jsPDF,
  label: string,
  value: string,
  x: number,
  y: number,
  width: number,
  options: { valueColor?: readonly [number, number, number] } = {},
) {
  text(pdf, label, x, y, { color: COLORS.muted, size: 9 });
  text(pdf, value, x + width, y, {
    align: "right",
    color: options.valueColor || COLORS.ink,
    font: "bold",
    maxWidth: width * 0.6,
    size: 9,
  });
}

function drawTable(pdf: jsPDF, startY: number, columns: TableColumn[], rows: LineItem[]) {
  const left = PAGE.margin;
  const tableWidth = PAGE.width - PAGE.margin * 2;
  const headerHeight = 34;
  const rowPaddingX = 12;
  let y = startY;

  setColor(pdf, "fill", COLORS.navySoft);
  pdf.roundedRect(left, y, tableWidth, headerHeight, 7, 7, "F");

  columns.forEach(column => {
    const x = column.align === "right" ? column.x + column.width - rowPaddingX : column.x + rowPaddingX;
    const align = column.align === "center" ? "center" : column.align;
    text(pdf, column.label, align === "center" ? column.x + column.width / 2 : x, y + 22, {
      align,
      color: [255, 255, 255],
      font: "bold",
      size: 8.5,
    });
  });

  y += headerHeight;

  rows.forEach((row, index) => {
    const descriptionWidth = columns[0].width - rowPaddingX * 2;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);
    const descriptionLines = pdf.splitTextToSize(row.description, descriptionWidth);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8.5);
    const noteLines = row.note ? pdf.splitTextToSize(row.note, descriptionWidth) : [];
    const rowHeight = Math.max(54, 20 + descriptionLines.length * 13 + noteLines.length * 11);

    if (index % 2 === 0) {
      setColor(pdf, "fill", [252, 253, 255]);
      pdf.rect(left, y, tableWidth, rowHeight, "F");
    }

    setColor(pdf, "draw", COLORS.line);
    pdf.line(left, y + rowHeight, left + tableWidth, y + rowHeight);

    const textY = y + 21;
    wrappedText(pdf, row.description, columns[0].x + rowPaddingX, textY, descriptionWidth, {
      font: "bold",
      lineHeight: 13,
      size: 10,
    });

    if (row.note) {
      wrappedText(pdf, row.note, columns[0].x + rowPaddingX, textY + descriptionLines.length * 13 + 3, descriptionWidth, {
        color: COLORS.muted,
        lineHeight: 11,
        size: 8.5,
      });
    }

    const valueY = y + rowHeight / 2 + 4;
    text(pdf, row.nights, columns[1].x + columns[1].width / 2, valueY, {
      align: "center",
      color: row.muted ? COLORS.muted : COLORS.ink,
      size: 9.5,
    });
    text(pdf, row.rate, columns[2].x + columns[2].width - rowPaddingX, valueY, {
      align: "right",
      color: row.muted ? COLORS.success : COLORS.ink,
      size: 9.5,
    });
    text(pdf, row.amount, columns[3].x + columns[3].width - rowPaddingX, valueY, {
      align: "right",
      color: row.muted ? COLORS.success : COLORS.ink,
      font: row.muted ? "normal" : "bold",
      size: 9.5,
    });

    y += rowHeight;
  });

  setColor(pdf, "draw", COLORS.line);
  columns.slice(1).forEach(column => {
    pdf.line(column.x, startY, column.x, y);
  });

  return y;
}

function drawTotals(pdf: jsPDF, y: number, subtotal: number, taxes: number, total: number) {
  const boxWidth = 250;
  const boxX = PAGE.width - PAGE.margin - boxWidth;
  const labelX = boxX + 18;
  const valueX = boxX + boxWidth - 18;

  panel(pdf, boxX, y, boxWidth, 112);

  text(pdf, "Subtotal", labelX, y + 28, { color: COLORS.muted, size: 9.5 });
  text(pdf, formatINR(subtotal), valueX, y + 28, { align: "right", size: 9.5 });

  text(pdf, "GST (12%)", labelX, y + 52, { color: COLORS.muted, size: 9.5 });
  text(pdf, formatINR(taxes), valueX, y + 52, { align: "right", size: 9.5 });

  setColor(pdf, "draw", COLORS.line);
  pdf.line(labelX, y + 70, valueX, y + 70);

  text(pdf, "Total Amount", labelX, y + 94, { font: "bold", size: 11 });
  text(pdf, formatINR(total), valueX, y + 94, { align: "right", color: COLORS.gold, font: "bold", size: 12 });
}

export function downloadInvoicePdf(booking: InvoiceBooking) {
  const nights = daysBetween(booking.checkIn, booking.checkOut);
  const roomPrice = Math.round(booking.totalPrice / nights);
  const taxes = Math.round(booking.totalPrice * 0.12);
  const total = booking.totalPrice + taxes;
  const paymentStatus = booking.status === "approved" ? "Confirmed" : "Pending Confirmation";
  const statusColor = booking.status === "approved" ? COLORS.success : COLORS.warning;

  const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const contentWidth = PAGE.width - PAGE.margin * 2;

  setColor(pdf, "fill", COLORS.navy);
  pdf.rect(0, 0, PAGE.width, 132, "F");
  setColor(pdf, "fill", COLORS.gold);
  pdf.circle(PAGE.margin + 14, 52, 14, "F");
  text(pdf, "G", PAGE.margin + 14, 57, {
    align: "center",
    color: COLORS.navy,
    font: "bold",
    size: 12,
  });

  text(pdf, "Grand Azure Resort", PAGE.margin + 38, 48, {
    color: [255, 255, 255],
    font: "bold",
    size: 20,
  });
  text(pdf, "1, Azure Bay Road, Alibaug, Maharashtra 402201", PAGE.margin + 38, 70, {
    color: [220, 224, 230],
    size: 8.8,
  });
  text(pdf, "reservations@grandazure.com | +91 22 6600 7700", PAGE.margin + 38, 85, {
    color: [220, 224, 230],
    size: 8.8,
  });
  text(pdf, "GST No: 27AAACG1234A1Z5", PAGE.margin + 38, 100, {
    color: [220, 224, 230],
    size: 8.8,
  });

  text(pdf, "INVOICE", PAGE.width - PAGE.margin, 54, {
    align: "right",
    color: [245, 183, 61],
    font: "bold",
    size: 24,
  });
  text(pdf, booking.id, PAGE.width - PAGE.margin, 78, {
    align: "right",
    color: [220, 224, 230],
    font: "bold",
    size: 10,
  });
  text(pdf, `Date: ${booking.createdAt}`, PAGE.width - PAGE.margin, 96, {
    align: "right",
    color: [220, 224, 230],
    size: 9,
  });

  const cardY = 160;
  const gap = 18;
  const cardWidth = (contentWidth - gap) / 2;
  panel(pdf, PAGE.margin, cardY, cardWidth, 112);
  panel(pdf, PAGE.margin + cardWidth + gap, cardY, cardWidth, 112);

  text(pdf, "BILLED TO", PAGE.margin + 16, cardY + 24, {
    color: COLORS.gold,
    font: "bold",
    size: 8.5,
  });
  wrappedText(pdf, booking.guestName, PAGE.margin + 16, cardY + 48, cardWidth - 32, {
    font: "bold",
    lineHeight: 13,
    size: 10.5,
  });
  text(pdf, booking.email, PAGE.margin + 16, cardY + 72, {
    color: COLORS.muted,
    maxWidth: cardWidth - 32,
    size: 9,
  });
  text(pdf, booking.phone, PAGE.margin + 16, cardY + 90, {
    color: COLORS.muted,
    maxWidth: cardWidth - 32,
    size: 9,
  });

  const detailsX = PAGE.margin + cardWidth + gap + 16;
  const detailsWidth = cardWidth - 32;
  text(pdf, "RESERVATION DETAILS", detailsX, cardY + 24, {
    color: COLORS.gold,
    font: "bold",
    size: 8.5,
  });
  drawKeyValue(pdf, "Reference", booking.id, detailsX, cardY + 48, detailsWidth, { valueColor: COLORS.gold });
  drawKeyValue(pdf, "Check-in", booking.checkIn, detailsX, cardY + 66, detailsWidth);
  drawKeyValue(pdf, "Check-out", booking.checkOut, detailsX, cardY + 84, detailsWidth);
  drawKeyValue(pdf, "Guests", String(booking.guests), detailsX, cardY + 102, detailsWidth);

  const tableY = 306;
  const columns: TableColumn[] = [
    { label: "DESCRIPTION", x: PAGE.margin, width: 260, align: "left" },
    { label: "NIGHTS", x: PAGE.margin + 260, width: 64, align: "center" },
    { label: "RATE", x: PAGE.margin + 324, width: 82, align: "right" },
    { label: "AMOUNT", x: PAGE.margin + 406, width: contentWidth - 406, align: "right" },
  ];

  const endTableY = drawTable(pdf, tableY, columns, [
    {
      amount: formatINR(booking.totalPrice),
      description: booking.roomName,
      nights: String(nights),
      note: "Deluxe Room Accommodation",
      rate: formatINR(roomPrice),
    },
    {
      amount: formatINR(0),
      description: "Complimentary Breakfast",
      muted: true,
      nights: String(nights),
      note: "Included for 2 persons",
      rate: "Included",
    },
  ]);

  const paymentY = endTableY + 28;
  setColor(pdf, "fill", COLORS.goldLight);
  setColor(pdf, "draw", [245, 218, 151]);
  pdf.roundedRect(PAGE.margin, paymentY, 220, 36, 10, 10, "FD");
  text(pdf, `Payment ${paymentStatus}`, PAGE.margin + 16, paymentY + 23, {
    color: statusColor,
    font: "bold",
    size: 9.5,
  });
  text(pdf, `Method: ${booking.paymentMethod}`, PAGE.margin + 250, paymentY + 23, {
    color: COLORS.muted,
    size: 9.5,
  });

  drawTotals(pdf, endTableY + 20, booking.totalPrice, taxes, total);

  const footerY = PAGE.height - 104;
  setColor(pdf, "draw", COLORS.line);
  pdf.line(PAGE.margin, footerY, PAGE.width - PAGE.margin, footerY);
  text(pdf, "Thank you for choosing Grand Azure Resort", PAGE.width / 2, footerY + 30, {
    align: "center",
    font: "bold",
    size: 13,
  });
  text(pdf, "We look forward to welcoming you. For any questions, contact us at reservations@grandazure.com", PAGE.width / 2, footerY + 50, {
    align: "center",
    color: COLORS.muted,
    size: 8.8,
  });
  text(pdf, "This is a computer-generated invoice and does not require a signature. Demo only - no real transaction occurred.", PAGE.width / 2, footerY + 68, {
    align: "center",
    color: [148, 163, 184],
    size: 7.8,
  });

  pdf.save(`Invoice_${booking.id || "download"}.pdf`);
}
