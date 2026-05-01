export interface Room {
  id: number;
  name: string;
  type: "standard" | "deluxe" | "suite";
  price: number;
  image: string;
  amenities: string[];
  description: string;
  capacity: number;
  available: boolean;
}

export interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
  avatar: string;
  country: string;
}

export interface Booking {
  id: string;
  guestName: string;
  email: string;
  phone: string;
  roomId: number;
  roomName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: "pending" | "approved" | "cancelled";
  paymentMethod: string;
  createdAt: string;
}

export const ROOMS: Room[] = [
  {
    id: 1,
    name: "Standard Room",
    type: "standard",
    price: 3500,
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&auto=format&fit=crop",
    amenities: ["Single Bed", "Air Conditioning", "Free WiFi", "Smart TV", "En-suite Bathroom"],
    description: "A comfortable and well-appointed room perfect for solo travelers or couples seeking an affordable luxury experience.",
    capacity: 2,
    available: true,
  },
  {
    id: 2,
    name: "Standard Twin",
    type: "standard",
    price: 4200,
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&auto=format&fit=crop",
    amenities: ["Twin Beds", "Air Conditioning", "Free WiFi", "Smart TV", "Work Desk"],
    description: "Ideal for friends or colleagues traveling together, featuring twin beds and all essential amenities.",
    capacity: 2,
    available: true,
  },
  {
    id: 3,
    name: "Deluxe Room",
    type: "deluxe",
    price: 6500,
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&auto=format&fit=crop",
    amenities: ["King Bed", "Air Conditioning", "Free WiFi", "Smart TV", "Mini-bar", "Sea View", "Bathrobe & Slippers"],
    description: "An elevated experience with stunning sea views, premium furnishings, and a thoughtfully stocked mini-bar.",
    capacity: 2,
    available: true,
  },
  {
    id: 4,
    name: "Deluxe Suite",
    type: "suite",
    price: 8500,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop",
    amenities: ["King Bed", "Separate Living Area", "Jacuzzi", "Mini-bar", "Smart TV", "Espresso Machine", "Butler Service"],
    description: "A sprawling suite with a dedicated living area, indulgent jacuzzi, and personalized butler service.",
    capacity: 3,
    available: true,
  },
  {
    id: 5,
    name: "Premium Suite",
    type: "suite",
    price: 12000,
    image: "https://images.unsplash.com/photo-1560185008-b033106af5c3?w=800&auto=format&fit=crop",
    amenities: ["2 Bedrooms", "Private Pool", "Living Room", "Butler Service", "Dining Area", "Premium Minibar", "Sunset Terrace"],
    description: "Two-bedroom luxury with a private plunge pool, al fresco dining terrace, and round-the-clock butler.",
    capacity: 4,
    available: true,
  },
  {
    id: 6,
    name: "Family Room",
    type: "deluxe",
    price: 7500,
    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&auto=format&fit=crop",
    amenities: ["2 Bedrooms", "Kids Play Corner", "Air Conditioning", "Free WiFi", "Smart TV", "Baby Cot Available"],
    description: "Designed for families, with spacious interconnected bedrooms and a dedicated kids play corner.",
    capacity: 6,
    available: true,
  },
  {
    id: 7,
    name: "Honeymoon Suite",
    type: "suite",
    price: 15000,
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop",
    amenities: ["King Bed", "Private Balcony", "Jacuzzi", "Rose Petal Decor", "Champagne on Arrival", "Couples Massage"],
    description: "A romantic sanctuary adorned with rose petals, a private balcony, and sunset jacuzzi for two.",
    capacity: 2,
    available: true,
  },
  {
    id: 8,
    name: "Presidential Suite",
    type: "suite",
    price: 25000,
    image: "https://images.unsplash.com/photo-1631049552057-403cdb8f0658?w=800&auto=format&fit=crop",
    amenities: ["3 Bedrooms", "Private Pool", "Butler Service", "Panoramic City View", "Fine Dining In-Room", "Limousine Transfer", "Personal Chef"],
    description: "The pinnacle of luxury — a three-bedroom private estate with panoramic views, a personal chef, and exclusive amenities.",
    capacity: 8,
    available: false,
  },
  {
    id: 9,
    name: "Beachfront Villa",
    type: "suite",
    price: 18000,
    image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&auto=format&fit=crop",
    amenities: ["2 Bedrooms", "Private Beach Access", "Infinity Pool", "Fully Equipped Kitchen", "Sun Deck", "Kayak & Snorkel Gear"],
    description: "Step directly onto pristine sands from your private villa — an infinity pool, full kitchen, and exclusive beach access await.",
    capacity: 5,
    available: true,
  },
];

export const REVIEWS: Review[] = [
  {
    id: 1,
    name: "Arjun Sharma",
    rating: 5,
    comment: "Absolutely breathtaking resort. The Honeymoon Suite exceeded every expectation — the rose petal turndown, the jacuzzi at sunset, and the impeccable butler service made our anniversary truly unforgettable.",
    date: "April 2025",
    avatar: "AS",
    country: "India",
  },
  {
    id: 2,
    name: "Priya Mehta",
    rating: 5,
    comment: "We stayed in the Family Room with our two kids and it was perfect. The children's play corner kept them entertained while we relaxed. The staff went out of their way to make the kids feel welcome.",
    date: "March 2025",
    avatar: "PM",
    country: "India",
  },
  {
    id: 3,
    name: "Rahul Verma",
    rating: 4,
    comment: "The Deluxe Room with the sea view was stunning. Waking up to that view every morning was worth every rupee. The breakfast spread was exceptional — highly recommend the coastal cuisine.",
    date: "February 2025",
    avatar: "RV",
    country: "India",
  },
  {
    id: 4,
    name: "Neha Kapoor",
    rating: 5,
    comment: "Grand Azure Resort is in a class of its own. The Presidential Suite was sheer opulence — the personal chef prepared a custom meal for our group, and the limousine transfer from the airport set the tone for a perfect stay.",
    date: "January 2025",
    avatar: "NK",
    country: "India",
  },
  {
    id: 5,
    name: "Vikram Singh",
    rating: 4,
    comment: "Stayed in the Beachfront Villa for five nights. Private beach access, incredible infinity pool, and the most spectacular sunsets. The kitchen was fully stocked — we even cooked a few meals ourselves.",
    date: "December 2024",
    avatar: "VS",
    country: "India",
  },
  {
    id: 6,
    name: "Anjali Patel",
    rating: 5,
    comment: "From check-in to check-out, every detail was flawless. The spa treatments were divine, the food was exceptional, and the entire team was warm and attentive. We are already planning our next visit.",
    date: "November 2024",
    avatar: "AP",
    country: "India",
  },
];

export const GALLERY_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&auto=format&fit=crop",
    caption: "Infinity Pool at Sunset",
  },
  {
    url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&auto=format&fit=crop",
    caption: "Grand Lobby",
  },
  {
    url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&auto=format&fit=crop",
    caption: "Fine Dining Restaurant",
  },
  {
    url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&auto=format&fit=crop",
    caption: "Luxury Spa",
  },
  {
    url: "https://images.unsplash.com/photo-1455587734955-081b22074882?w=1200&auto=format&fit=crop",
    caption: "Private Beach",
  },
  {
    url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&auto=format&fit=crop",
    caption: "Premium Suite",
  },
  {
    url: "https://images.unsplash.com/photo-1561501878-aabd62634533?w=1200&auto=format&fit=crop",
    caption: "Beachfront View",
  },
  {
    url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&auto=format&fit=crop",
    caption: "Garden Terrace",
  },
];

export const ATTRACTIONS = [
  { name: "Marine Drive", distance: "2.5 km", icon: "waves", description: "Iconic seaside promenade with stunning ocean views" },
  { name: "City Heritage Museum", distance: "4 km", icon: "landmark", description: "Explore centuries of rich cultural history" },
  { name: "Sunrise Beach", distance: "1.2 km", icon: "sun", description: "Pristine beach perfect for morning walks and water sports" },
  { name: "Spice Market", distance: "3 km", icon: "shopping-bag", description: "Vibrant local market with authentic spices and crafts" },
  { name: "Botanical Gardens", distance: "6 km", icon: "trees", description: "250 acres of lush tropical flora and fauna" },
  { name: "Golf Course", distance: "5 km", icon: "circle", description: "Championship 18-hole course with ocean views" },
];

export const DEMO_BOOKINGS: Booking[] = [
  {
    id: "GAR-2025-001",
    guestName: "Arjun Sharma",
    email: "arjun@demo.com",
    phone: "+91 98765 43210",
    roomId: 7,
    roomName: "Honeymoon Suite",
    checkIn: "2025-05-10",
    checkOut: "2025-05-13",
    guests: 2,
    totalPrice: 45000,
    status: "approved",
    paymentMethod: "Card",
    createdAt: "2025-04-28",
  },
  {
    id: "GAR-2025-002",
    guestName: "Priya Mehta",
    email: "priya@demo.com",
    phone: "+91 87654 32109",
    roomId: 6,
    roomName: "Family Room",
    checkIn: "2025-05-15",
    checkOut: "2025-05-20",
    guests: 4,
    totalPrice: 37500,
    status: "pending",
    paymentMethod: "UPI",
    createdAt: "2025-04-30",
  },
  {
    id: "GAR-2025-003",
    guestName: "Rahul Verma",
    email: "rahul@demo.com",
    phone: "+91 76543 21098",
    roomId: 3,
    roomName: "Deluxe Room",
    checkIn: "2025-06-01",
    checkOut: "2025-06-04",
    guests: 2,
    totalPrice: 19500,
    status: "approved",
    paymentMethod: "Card",
    createdAt: "2025-05-01",
  },
  {
    id: "GAR-2025-004",
    guestName: "Neha Kapoor",
    email: "neha@demo.com",
    phone: "+91 65432 10987",
    roomId: 8,
    roomName: "Presidential Suite",
    checkIn: "2025-05-25",
    checkOut: "2025-05-28",
    guests: 6,
    totalPrice: 75000,
    status: "cancelled",
    paymentMethod: "Card",
    createdAt: "2025-04-25",
  },
  {
    id: "GAR-2025-005",
    guestName: "Vikram Singh",
    email: "vikram@demo.com",
    phone: "+91 54321 09876",
    roomId: 9,
    roomName: "Beachfront Villa",
    checkIn: "2025-06-10",
    checkOut: "2025-06-15",
    guests: 4,
    totalPrice: 90000,
    status: "pending",
    paymentMethod: "UPI",
    createdAt: "2025-05-01",
  },
];

export const DEMO_USERS = [
  { id: 1, name: "Arjun Sharma", email: "arjun@demo.com", phone: "+91 98765 43210", bookings: 3, status: "active", joined: "Jan 2025" },
  { id: 2, name: "Priya Mehta", email: "priya@demo.com", phone: "+91 87654 32109", bookings: 1, status: "active", joined: "Feb 2025" },
  { id: 3, name: "Rahul Verma", email: "rahul@demo.com", phone: "+91 76543 21098", bookings: 2, status: "active", joined: "Nov 2024" },
  { id: 4, name: "Neha Kapoor", email: "neha@demo.com", phone: "+91 65432 10987", bookings: 1, status: "blocked", joined: "Oct 2024" },
  { id: 5, name: "Vikram Singh", email: "vikram@demo.com", phone: "+91 54321 09876", bookings: 4, status: "active", joined: "Mar 2025" },
  { id: 6, name: "Anjali Patel", email: "anjali@demo.com", phone: "+91 43210 98765", bookings: 2, status: "active", joined: "Dec 2024" },
];

export const SPECIAL_OFFERS = [
  {
    title: "Early Bird Discount",
    description: "Book 30 days in advance and save 20% on all room types",
    discount: "20% OFF",
    validUntil: "June 30, 2025",
    code: "EARLYBIRD20",
  },
  {
    title: "Honeymoon Package",
    description: "Complimentary champagne, spa voucher, and sunset dinner for two",
    discount: "Special Package",
    validUntil: "December 31, 2025",
    code: "HONEYMOON25",
  },
  {
    title: "Weekend Getaway",
    description: "Fri-Sun stay with complimentary breakfast and late checkout",
    discount: "15% OFF",
    validUntil: "September 30, 2025",
    code: "WEEKEND15",
  },
];

export const FAQ_RESPONSES: Record<string, string> = {
  "check-in": "Check-in time is 2:00 PM. Early check-in can be arranged subject to availability.",
  "check-out": "Check-out time is 11:00 AM. Late checkout until 2 PM is available at an additional charge.",
  "wifi": "Yes, complimentary high-speed WiFi is available throughout the resort.",
  "pool": "The swimming pool is open from 6:00 AM to 10:00 PM daily.",
  "breakfast": "Breakfast is served from 7:00 AM to 10:30 AM in our Grand Dining Hall.",
  "parking": "Yes, complimentary valet parking is available for all guests.",
  "pets": "We regret that pets are not permitted on the property.",
  "spa": "Our spa is open from 9:00 AM to 8:00 PM. Prior appointment is recommended.",
  "airport": "We offer airport transfers. Please contact us 24 hours in advance to arrange.",
  "cancel": "Cancellations made 48 hours before check-in receive a full refund. Late cancellations incur one night's charge.",
};
