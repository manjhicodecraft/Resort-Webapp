import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Check, CreditCard, Smartphone, ChevronRight, Download } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ROOMS } from "@/data/demo";
import { saveBooking, getCurrentUser } from "@/lib/auth";
import { getBookingUserId } from "@/lib/bookingPass";
import { openBookingConfirmationEmail } from "@/lib/bookingEmail";
import { downloadInvoicePdf, type InvoiceBooking } from "@/lib/invoicePdf";

type Step = "form" | "payment" | "confirmed";

function generateRef() {
  return "GAR-" + new Date().getFullYear() + "-" + String(Math.floor(Math.random() * 9000) + 1000);
}

function daysBetween(a: string, b: string) {
  if (!a || !b) return 0;
  const diff = new Date(b).getTime() - new Date(a).getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

export default function Booking() {
  const [searchStr] = useLocation();
  const { toast } = useToast();
  const user = getCurrentUser();

  const params = new URLSearchParams(searchStr.split("?")[1] || "");
  const defaultRoomId = params.get("room") ? Number(params.get("room")) : ROOMS[0].id;

  const [step, setStep] = useState<Step>("form");
  const [payMethod, setPayMethod] = useState<"card" | "upi">("card");
  const [bookingRef, setBookingRef] = useState("");
  const [confirmedBooking, setConfirmedBooking] = useState<InvoiceBooking | null>(null);

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    checkIn: "",
    checkOut: "",
    guests: "2",
    roomId: defaultRoomId,
    cardNum: "",
    cardName: "",
    expiry: "",
    cvv: "",
    upiId: "",
  });

  const selectedRoom = ROOMS.find(r => r.id === form.roomId) || ROOMS[0];
  const nights = daysBetween(form.checkIn, form.checkOut);
  const total = selectedRoom.price * (nights || 1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.checkIn || !form.checkOut) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    if (nights < 1) {
      toast({ title: "Check-out must be after check-in", variant: "destructive" });
      return;
    }
    setStep("payment");
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    const ref = generateRef();
    setBookingRef(ref);

    const booking = {
      id: ref,
      userId: getBookingUserId(user?.email || form.email),
      guestName: form.name,
      email: form.email,
      phone: form.phone,
      roomId: form.roomId,
      roomName: selectedRoom.name,
      checkIn: form.checkIn,
      checkOut: form.checkOut,
      guests: Number(form.guests),
      totalPrice: total,
      status: "pending",
      paymentMethod: payMethod === "card" ? "Card" : "UPI",
      createdAt: new Date().toISOString().split("T")[0],
    };

    saveBooking(booking);
    setConfirmedBooking(booking);
    setStep("confirmed");
    openBookingConfirmationEmail(booking);
    toast({
      title: "Booking confirmed",
      description: "Gmail confirmation draft opened. Invoice and QR passes are available in My Bookings.",
    });
  };

  if (step === "confirmed") {
    return (
      <div className="min-h-screen pt-20 bg-[hsl(40,20%,97%)] flex items-center justify-center px-4" data-testid="section-booking-confirmed">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-6 text-sm">
            Thank you, {form.name}. Your reservation has been received and is pending confirmation.
          </p>

          <div className="bg-[hsl(40,20%,97%)] rounded-xl p-4 text-left mb-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Reference</span>
              <span className="font-bold text-[hsl(42,75%,40%)]" data-testid="text-booking-ref">{bookingRef}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Room</span>
              <span className="font-medium">{selectedRoom.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Check-in</span>
              <span className="font-medium">{form.checkIn}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Check-out</span>
              <span className="font-medium">{form.checkOut}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Guests</span>
              <span className="font-medium">{form.guests}</span>
            </div>
            <div className="flex justify-between text-sm font-semibold border-t pt-2 mt-2">
              <span>Total Paid</span>
              <span className="text-[hsl(42,75%,40%)]">&#8377;{total.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button
              type="button"
              variant="outline"
              className="w-full border-[hsl(220,35%,14%)] text-[hsl(220,35%,14%)]"
              onClick={() => confirmedBooking && downloadInvoicePdf(confirmedBooking)}
              disabled={!confirmedBooking}
              data-testid="button-download-invoice"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            <a href="/my-bookings">
              <Button variant="outline" className="w-full border-[hsl(42,75%,45%)] text-[hsl(42,75%,40%)]" data-testid="button-view-my-bookings">
                My Bookings
              </Button>
            </a>
            <a href="/">
              <Button className="w-full bg-[hsl(220,35%,14%)] text-white" data-testid="button-back-home">
                Back to Home
              </Button>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-[hsl(40,20%,97%)]">
      <PageHeader
        eyebrow="Reservations"
        title="Book Your Stay"
        description="Choose your dates, pick a room, and reserve your Grand Azure escape in a few simple steps."
        image="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1920&auto=format&fit=crop"
        testId="section-booking-header"
      />

      {/* Steps indicator */}
      <div className="max-w-xl mx-auto px-4 pt-8">
        <div className="flex items-center justify-center gap-4 mb-8">
          {(["form", "payment", "confirmed"] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === s ? "bg-[hsl(220,35%,14%)] text-white" : step === "payment" && s === "form" ? "bg-[hsl(42,75%,52%)] text-white" : "bg-gray-200 text-gray-500"}`}>
                {i === 0 && step === "payment" ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className="text-xs font-medium text-gray-600 hidden sm:block capitalize">{s === "form" ? "Details" : s === "payment" ? "Payment" : "Confirmed"}</span>
              {i < 2 && <ChevronRight className="w-4 h-4 text-gray-400" />}
            </div>
          ))}
        </div>

        {step === "form" && (
          <form onSubmit={handleFormSubmit} className="bg-white rounded-2xl shadow-sm p-6 space-y-5" data-testid="form-booking-details">
            <h2 className="font-serif text-xl font-semibold text-gray-900">Guest Information</h2>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input id="name" name="name" value={form.name} onChange={handleChange} placeholder="Your full name" required className="mt-1" data-testid="input-guest-name" />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@email.com" required className="mt-1" data-testid="input-guest-email" />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input id="phone" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" required className="mt-1" data-testid="input-guest-phone" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="checkIn">Check-in *</Label>
                <Input id="checkIn" name="checkIn" type="date" value={form.checkIn} onChange={handleChange} required className="mt-1" data-testid="input-checkin" />
              </div>
              <div>
                <Label htmlFor="checkOut">Check-out *</Label>
                <Input id="checkOut" name="checkOut" type="date" value={form.checkOut} onChange={handleChange} required className="mt-1" data-testid="input-checkout" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="guests">Guests</Label>
                <select id="guests" name="guests" value={form.guests} onChange={handleChange} className="mt-1 w-full border rounded-md px-3 py-2 text-sm" data-testid="select-guests">
                  {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} Guest{n>1?"s":""}</option>)}
                </select>
              </div>
              <div>
                <Label htmlFor="roomId">Room</Label>
                <select
                  id="roomId"
                  name="roomId"
                  value={form.roomId}
                  onChange={e => setForm(prev => ({ ...prev, roomId: Number(e.target.value) }))}
                  className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
                  data-testid="select-room"
                >
                  {ROOMS.filter(r => r.available).map(r => (
                    <option key={r.id} value={r.id}>{r.name} — &#8377;{r.price.toLocaleString("en-IN")}/night</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Summary */}
            {nights > 0 && (
              <div className="bg-[hsl(40,20%,97%)] rounded-xl p-4 text-sm">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">{selectedRoom.name} x {nights} night{nights>1?"s":""}</span>
                  <span>&#8377;{(selectedRoom.price * nights).toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between font-bold text-base pt-2 border-t">
                  <span>Total</span>
                  <span className="text-[hsl(42,75%,40%)]">&#8377;{total.toLocaleString("en-IN")}</span>
                </div>
              </div>
            )}

            <Button type="submit" className="w-full bg-[hsl(220,35%,14%)] hover:bg-[hsl(42,75%,45%)] text-white font-semibold py-3" data-testid="button-proceed-to-payment">
              Proceed to Payment
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </form>
        )}

        {step === "payment" && (
          <form onSubmit={handlePayment} className="bg-white rounded-2xl shadow-sm p-6 space-y-5 pb-12" data-testid="form-payment">
            <div className="bg-[hsl(40,20%,97%)] rounded-xl p-4 text-sm mb-2">
              <div className="flex justify-between font-semibold">
                <span>{selectedRoom.name} ({nights} night{nights>1?"s":""})</span>
                <span className="text-[hsl(42,75%,40%)]">&#8377;{total.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <h2 className="font-serif text-xl font-semibold text-gray-900">Payment Method</h2>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPayMethod("card")}
                className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all ${payMethod === "card" ? "border-[hsl(220,35%,14%)] bg-[hsl(220,35%,97%)]" : "border-gray-200"}`}
                data-testid="button-pay-card"
              >
                <CreditCard className="w-5 h-5" />
                Debit / Credit Card
              </button>
              <button
                type="button"
                onClick={() => setPayMethod("upi")}
                className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all ${payMethod === "upi" ? "border-[hsl(220,35%,14%)] bg-[hsl(220,35%,97%)]" : "border-gray-200"}`}
                data-testid="button-pay-upi"
              >
                <Smartphone className="w-5 h-5" />
                UPI
              </button>
            </div>

            {payMethod === "card" && (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-[hsl(220,35%,14%)] to-[hsl(220,35%,25%)] rounded-xl p-5 text-white">
                  <p className="text-xs text-gray-400 mb-3">Demo Card (use any values)</p>
                  <p className="font-mono text-lg tracking-widest mb-1">{form.cardNum || "4242 4242 4242 4242"}</p>
                  <div className="flex justify-between text-xs text-gray-300">
                    <span>{form.cardName || "CARDHOLDER NAME"}</span>
                    <span>{form.expiry || "MM/YY"}</span>
                  </div>
                </div>
                <Input name="cardNum" value={form.cardNum} onChange={handleChange} placeholder="Card Number (demo)" className="font-mono" data-testid="input-card-number" />
                <Input name="cardName" value={form.cardName} onChange={handleChange} placeholder="Cardholder Name" data-testid="input-card-name" />
                <div className="grid grid-cols-2 gap-3">
                  <Input name="expiry" value={form.expiry} onChange={handleChange} placeholder="MM/YY" data-testid="input-card-expiry" />
                  <Input name="cvv" value={form.cvv} onChange={handleChange} placeholder="CVV" data-testid="input-card-cvv" />
                </div>
              </div>
            )}

            {payMethod === "upi" && (
              <div className="space-y-4">
                <div className="text-center p-6 bg-gray-50 rounded-xl">
                  <div className="w-32 h-32 bg-white border-2 border-gray-200 rounded-xl mx-auto mb-3 flex items-center justify-center">
                    <div className="grid grid-cols-4 gap-1">
                      {Array.from({length:16}).map((_,i)=><div key={i} className="w-3 h-3 bg-[hsl(220,35%,14%)] rounded-sm opacity-70" style={{opacity: Math.random() > 0.5 ? 1 : 0.2}} />)}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">Scan QR Code or enter UPI ID</p>
                  <p className="font-mono text-sm font-bold mt-1">grandazure@sbi</p>
                </div>
                <Input name="upiId" value={form.upiId} onChange={handleChange} placeholder="Enter UPI ID (demo)" data-testid="input-upi-id" />
              </div>
            )}

            <div className="text-xs text-gray-400 flex items-center gap-1">
              <span>This is a demo application. No real payment is processed.</span>
            </div>

            <Button type="submit" className="w-full bg-[hsl(42,75%,45%)] hover:bg-[hsl(42,75%,38%)] text-white font-semibold py-3 text-base" data-testid="button-confirm-payment">
              Confirm & Pay &#8377;{total.toLocaleString("en-IN")}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
