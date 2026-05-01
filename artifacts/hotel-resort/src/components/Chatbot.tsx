import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { FAQ_RESPONSES } from "@/data/demo";

interface Message {
  from: "user" | "bot";
  text: string;
}

const SUGGESTIONS = [
  "Check-in time?",
  "Check-out time?",
  "Is WiFi free?",
  "Pool hours?",
  "Do you allow pets?",
  "Airport transfer?",
  "Cancellation policy?",
  "Spa hours?",
  "Parking available?",
  "Breakfast timing?",
];

function findAnswer(query: string): string {
  const q = query.toLowerCase();
  if (q.includes("check-in") || q.includes("checkin") || q.includes("check in")) return FAQ_RESPONSES["check-in"];
  if (q.includes("check-out") || q.includes("checkout") || q.includes("check out")) return FAQ_RESPONSES["check-out"];
  if (q.includes("wifi") || q.includes("internet") || q.includes("wi-fi")) return FAQ_RESPONSES["wifi"];
  if (q.includes("pool") || q.includes("swimming")) return FAQ_RESPONSES["pool"];
  if (q.includes("breakfast") || q.includes("meal") || q.includes("food")) return FAQ_RESPONSES["breakfast"];
  if (q.includes("parking") || q.includes("car") || q.includes("valet")) return FAQ_RESPONSES["parking"];
  if (q.includes("pet") || q.includes("dog") || q.includes("cat") || q.includes("animal")) return FAQ_RESPONSES["pets"];
  if (q.includes("spa") || q.includes("massage") || q.includes("wellness")) return FAQ_RESPONSES["spa"];
  if (q.includes("airport") || q.includes("transfer") || q.includes("pickup") || q.includes("taxi")) return FAQ_RESPONSES["airport"];
  if (q.includes("cancel") || q.includes("refund") || q.includes("policy")) return FAQ_RESPONSES["cancel"];
  return "I'm sorry, I didn't quite understand that. You can ask me about check-in/out times, WiFi, pool hours, breakfast, parking, pets, spa, airport transfers, or cancellation policy. Or call us at +91 22 6600 7700 for assistance.";
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { from: "bot", text: "Welcome to Grand Azure Resort! I'm your virtual concierge. How may I assist you today?" },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { from: "user", text };
    const botMsg: Message = { from: "bot", text: findAnswer(text) };
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[hsl(220,35%,14%)] text-white shadow-lg hover:bg-[hsl(42,75%,45%)] transition-all duration-300 flex items-center justify-center"
        data-testid="button-chatbot-toggle"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
          style={{ maxHeight: "450px" }}
          data-testid="chatbot-panel"
        >
          <div className="bg-[hsl(220,35%,14%)] text-white px-4 py-3">
            <p className="font-serif font-semibold text-sm">Grand Azure Concierge</p>
            <p className="text-xs text-gray-400">Ask me anything about the resort</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: "260px" }}>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                data-testid={`chat-message-${i}`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                    msg.from === "user"
                      ? "bg-[hsl(220,35%,14%)] text-white rounded-br-none"
                      : "bg-gray-100 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="p-2 border-t border-gray-100">
            <div className="flex flex-wrap gap-1 mb-2">
              {SUGGESTIONS.slice(0, 4).map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-xs bg-gray-100 hover:bg-[hsl(42,75%,90%)] text-gray-700 px-2 py-0.5 rounded-full transition-colors"
                  data-testid={`button-chat-suggestion-${s.replace(/\s+/g, "-").toLowerCase()}`}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                placeholder="Type your question..."
                className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[hsl(42,75%,52%)]"
                data-testid="input-chat-message"
              />
              <button
                onClick={() => sendMessage(input)}
                className="w-9 h-9 rounded-lg bg-[hsl(220,35%,14%)] text-white flex items-center justify-center hover:bg-[hsl(42,75%,45%)] transition-colors"
                data-testid="button-chat-send"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
