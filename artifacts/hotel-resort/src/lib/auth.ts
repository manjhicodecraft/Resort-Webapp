export interface User {
  name: string;
  email: string;
  isAdmin: boolean;
}

const ADMIN_EMAIL = "admin@grandazure.com";
const ADMIN_PASSWORD = "admin123";
const STORAGE_KEY = "grand_azure_user";

export function login(email: string, password: string): { success: boolean; user?: User; error?: string } {
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const user: User = { name: "Admin", email, isAdmin: true };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return { success: true, user };
  }
  if (email && password.length >= 4) {
    const name = email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    const user: User = { name, email, isAdmin: false };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return { success: true, user };
  }
  return { success: false, error: "Invalid credentials. Password must be at least 4 characters." };
}

export function signup(name: string, email: string, password: string): { success: boolean; user?: User; error?: string } {
  if (!name || !email || password.length < 4) {
    return { success: false, error: "Please fill all fields. Password must be at least 4 characters." };
  }
  const user: User = { name, email, isAdmin: false };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  return { success: true, user };
}

export function logout() {
  localStorage.removeItem(STORAGE_KEY);
}

export function getCurrentUser(): User | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function getBookings() {
  try {
    const data = localStorage.getItem("grand_azure_bookings");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveBooking(booking: object) {
  const bookings = getBookings();
  bookings.unshift(booking);
  localStorage.setItem("grand_azure_bookings", JSON.stringify(bookings));
}

export function updateBookingStatus(id: string, status: string) {
  const bookings = getBookings();
  const idx = bookings.findIndex((b: { id: string }) => b.id === id);
  if (idx !== -1) {
    bookings[idx].status = status;
    localStorage.setItem("grand_azure_bookings", JSON.stringify(bookings));
  }
}
