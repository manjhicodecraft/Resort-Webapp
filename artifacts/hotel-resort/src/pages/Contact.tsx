import { useState } from "react";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    setSubmitted(true);
    toast({ title: "Message sent! We'll respond within 24 hours." });
  };

  return (
    <div className="min-h-screen pt-16 bg-[hsl(40,20%,97%)]">
      <div className="bg-[hsl(220,35%,12%)] py-16 text-center text-white" data-testid="section-contact-header">
        <p className="text-[hsl(42,75%,62%)] text-sm font-medium tracking-widest uppercase mb-2">Get In Touch</p>
        <h1 className="font-serif text-4xl font-bold">Contact Us</h1>
        <p className="text-gray-300 mt-3 max-w-xl mx-auto text-sm">
          Our concierge team is available around the clock to assist with inquiries, reservations, and special arrangements.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info */}
          <div className="space-y-5" data-testid="section-contact-info">
            {[
              {
                icon: <Phone className="w-5 h-5" />,
                label: "Phone",
                lines: ["+91 22 6600 7700", "+91 22 6600 7701 (Reservations)"],
              },
              {
                icon: <Mail className="w-5 h-5" />,
                label: "Email",
                lines: ["reservations@grandazure.com", "concierge@grandazure.com"],
              },
              {
                icon: <MapPin className="w-5 h-5" />,
                label: "Address",
                lines: ["1, Azure Bay Road", "Alibaug, Maharashtra 402201", "India"],
              },
              {
                icon: <Clock className="w-5 h-5" />,
                label: "Concierge Hours",
                lines: ["Open 24 hours, 7 days a week", "Front Desk: Always available"],
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 bg-white rounded-xl p-5 shadow-sm" data-testid={`contact-info-${i}`}>
                <div className="w-10 h-10 rounded-full bg-[hsl(220,35%,14%)] text-[hsl(42,75%,52%)] flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm mb-1">{item.label}</p>
                  {item.lines.map((line, j) => (
                    <p key={j} className="text-gray-600 text-sm">{line}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-8" data-testid="section-inquiry-form">
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-gray-900 mb-2">Message Received!</h3>
                  <p className="text-gray-600 text-sm">
                    Thank you, {form.name}. Our team will get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="font-serif text-2xl font-semibold text-gray-900 mb-6">Send an Inquiry</h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="contact-name">Full Name *</Label>
                        <Input id="contact-name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Your name" className="mt-1" data-testid="input-contact-name" />
                      </div>
                      <div>
                        <Label htmlFor="contact-email">Email *</Label>
                        <Input id="contact-email" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="you@email.com" className="mt-1" data-testid="input-contact-email" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="contact-subject">Subject</Label>
                      <select
                        id="contact-subject"
                        value={form.subject}
                        onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                        className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
                        data-testid="select-contact-subject"
                      >
                        <option value="">Select a topic</option>
                        <option>Reservation Inquiry</option>
                        <option>Special Occasion Planning</option>
                        <option>Corporate Events</option>
                        <option>Feedback / Complaint</option>
                        <option>General Inquiry</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="contact-message">Message *</Label>
                      <Textarea id="contact-message" value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} placeholder="How can we help you?" rows={5} className="mt-1" data-testid="textarea-contact-message" />
                    </div>
                    <Button type="submit" className="w-full bg-[hsl(220,35%,14%)] hover:bg-[hsl(42,75%,45%)] text-white font-semibold py-3" data-testid="button-send-inquiry">
                      Send Inquiry
                    </Button>
                  </form>
                </>
              )}
            </div>

            {/* Map */}
            <div className="mt-6 rounded-2xl overflow-hidden shadow-sm" data-testid="section-map">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30265.51559219591!2d72.86735!3d18.6530!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be86d5c9a4e70a7%3A0x9a4e6b44a86dce6d!2sAlibaug%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1651234567890"
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Grand Azure Resort Location"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
