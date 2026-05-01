import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  LayoutDashboard, BedDouble, CalendarCheck, Users, TrendingUp,
  Plus, Edit, Trash2, Check, X, AlertCircle, LogOut, ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { getCurrentUser, logout, getBookings, updateBookingStatus } from "@/lib/auth";
import { ROOMS, DEMO_BOOKINGS, DEMO_USERS } from "@/data/demo";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import type { Room } from "@/data/demo";

type Tab = "dashboard" | "rooms" | "bookings" | "users";

interface RoomModal {
  open: boolean;
  mode: "add" | "edit";
  room: Partial<Room>;
}

const REVENUE_DATA = [
  { month: "Nov", revenue: 285000 },
  { month: "Dec", revenue: 320000 },
  { month: "Jan", revenue: 295000 },
  { month: "Feb", revenue: 340000 },
  { month: "Mar", revenue: 410000 },
  { month: "Apr", revenue: 485000 },
];

export default function Admin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const user = getCurrentUser();

  const [tab, setTab] = useState<Tab>("dashboard");
  const [rooms, setRooms] = useState<Room[]>(ROOMS);
  const [bookings, setBookings] = useState(DEMO_BOOKINGS);
  const [demoUsers, setDemoUsers] = useState(DEMO_USERS);
  const [modal, setModal] = useState<RoomModal>({ open: false, mode: "add", room: {} });

  useEffect(() => {
    if (!user?.isAdmin) {
      setLocation("/auth");
    }
    // Merge stored bookings with demo bookings
    const stored = getBookings();
    if (stored.length > 0) {
      setBookings(prev => [...stored, ...prev]);
    }
  }, []);

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  const openAddRoom = () => {
    setModal({ open: true, mode: "add", room: { type: "standard", available: true, price: 3500, capacity: 2, amenities: [] } });
  };

  const openEditRoom = (room: Room) => {
    setModal({ open: true, mode: "edit", room: { ...room } });
  };

  const saveRoom = () => {
    if (!modal.room.name || !modal.room.price) {
      toast({ title: "Name and price are required", variant: "destructive" });
      return;
    }
    if (modal.mode === "add") {
      const newRoom: Room = {
        id: rooms.length + 1,
        name: modal.room.name!,
        type: modal.room.type || "standard",
        price: modal.room.price!,
        image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&auto=format&fit=crop",
        amenities: modal.room.amenities || [],
        description: modal.room.description || "",
        capacity: modal.room.capacity || 2,
        available: modal.room.available ?? true,
      };
      setRooms(prev => [...prev, newRoom]);
      toast({ title: "Room added successfully" });
    } else {
      setRooms(prev => prev.map(r => r.id === modal.room.id ? { ...r, ...modal.room } as Room : r));
      toast({ title: "Room updated successfully" });
    }
    setModal({ open: false, mode: "add", room: {} });
  };

  const deleteRoom = (id: number) => {
    setRooms(prev => prev.filter(r => r.id !== id));
    toast({ title: "Room deleted" });
  };

  const handleBookingStatus = (id: string, status: "approved" | "cancelled") => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    updateBookingStatus(id, status);
    toast({ title: `Booking ${status === "approved" ? "approved" : "cancelled"}` });
  };

  const blockUser = (id: number) => {
    setDemoUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === "blocked" ? "active" : "blocked" } : u));
  };

  const removeUser = (id: number) => {
    setDemoUsers(prev => prev.filter(u => u.id !== id));
    toast({ title: "User removed" });
  };

  const totalRevenue = bookings.filter(b => b.status !== "cancelled").reduce((s, b) => s + b.totalPrice, 0);
  const availableRooms = rooms.filter(r => r.available).length;
  const approvedBookings = bookings.filter(b => b.status === "approved").length;

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "rooms", label: "Rooms", icon: <BedDouble className="w-4 h-4" /> },
    { id: "bookings", label: "Bookings", icon: <CalendarCheck className="w-4 h-4" /> },
    { id: "users", label: "Users", icon: <Users className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen pt-16 flex bg-[hsl(40,20%,97%)]" data-testid="page-admin">
      {/* Sidebar */}
      <aside className="w-56 bg-[hsl(220,35%,10%)] text-white min-h-screen fixed top-16 left-0 z-30 hidden lg:flex flex-col" data-testid="admin-sidebar">
        <div className="p-4 border-b border-white/10">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Admin Panel</p>
          <p className="font-serif font-semibold text-sm text-[hsl(42,75%,62%)] mt-0.5">Grand Azure Resort</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === t.id ? "bg-[hsl(42,75%,52%)] text-[hsl(220,35%,8%)]" : "text-gray-400 hover:text-white hover:bg-white/10"}`}
              data-testid={`admin-tab-${t.id}`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10">
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-red-950/30 transition-all" data-testid="button-admin-logout">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile tab bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[hsl(220,35%,10%)] flex border-t border-white/10">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`flex-1 flex flex-col items-center py-2 text-xs transition-all ${tab === t.id ? "text-[hsl(42,75%,62%)]" : "text-gray-500"}`} data-testid={`admin-mobile-tab-${t.id}`}>
            {t.icon}
            <span className="mt-0.5 text-[10px]">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Main content */}
      <main className="flex-1 lg:ml-56 p-4 sm:p-6 pb-20 lg:pb-6">
        {tab === "dashboard" && (
          <div data-testid="admin-section-dashboard">
            <h1 className="font-serif text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Total Bookings", value: bookings.length, icon: <CalendarCheck className="w-6 h-6" />, color: "bg-blue-50 text-blue-600" },
                { label: "Available Rooms", value: availableRooms, icon: <BedDouble className="w-6 h-6" />, color: "bg-green-50 text-green-600" },
                { label: "Active Users", value: demoUsers.filter(u => u.status === "active").length, icon: <Users className="w-6 h-6" />, color: "bg-purple-50 text-purple-600" },
                { label: "Revenue (Month)", value: `&#8377;${(485000).toLocaleString("en-IN")}`, icon: <TrendingUp className="w-6 h-6" />, color: "bg-amber-50 text-amber-600" },
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-xl p-5 shadow-sm" data-testid={`admin-stat-${i}`}>
                  <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
                    {stat.icon}
                  </div>
                  <p className="font-serif text-2xl font-bold text-gray-900"
                    dangerouslySetInnerHTML={{ __html: String(stat.value) }}
                  />
                  <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
              <h2 className="font-serif text-lg font-semibold text-gray-900 mb-4">Monthly Revenue (&#8377;)</h2>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={REVENUE_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `${v/1000}k`} />
                  <Tooltip formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, "Revenue"]} />
                  <Bar dataKey="revenue" fill="hsl(42,75%,52%)" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm">Booking Status</h3>
                <div className="space-y-2">
                  {[
                    { label: "Approved", count: bookings.filter(b => b.status === "approved").length, color: "bg-green-500" },
                    { label: "Pending", count: bookings.filter(b => b.status === "pending").length, color: "bg-amber-500" },
                    { label: "Cancelled", count: bookings.filter(b => b.status === "cancelled").length, color: "bg-red-500" },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${item.color}`} />
                        <span className="text-sm text-gray-700">{item.label}</span>
                      </div>
                      <span className="font-semibold text-sm">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm">Room Availability</h3>
                <div className="space-y-2">
                  {[
                    { label: "Available", count: rooms.filter(r => r.available).length, color: "bg-green-500" },
                    { label: "Not Available", count: rooms.filter(r => !r.available).length, color: "bg-red-500" },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${item.color}`} />
                        <span className="text-sm text-gray-700">{item.label}</span>
                      </div>
                      <span className="font-semibold text-sm">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "rooms" && (
          <div data-testid="admin-section-rooms">
            <div className="flex items-center justify-between mb-6">
              <h1 className="font-serif text-2xl font-bold text-gray-900">Room Management</h1>
              <Button onClick={openAddRoom} className="bg-[hsl(220,35%,14%)] text-white" data-testid="button-add-room">
                <Plus className="w-4 h-4 mr-2" />
                Add Room
              </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm" data-testid="table-rooms">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Room</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Type</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Price/Night</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Capacity</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {rooms.map(room => (
                      <tr key={room.id} className="hover:bg-gray-50 transition-colors" data-testid={`row-room-${room.id}`}>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img src={room.image} alt={room.name} className="w-10 h-10 rounded-lg object-cover" />
                            <span className="font-medium text-gray-900">{room.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 capitalize text-gray-600">{room.type}</td>
                        <td className="py-3 px-4 font-medium text-gray-900">&#8377;{room.price.toLocaleString("en-IN")}</td>
                        <td className="py-3 px-4 text-gray-600">{room.capacity} guests</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${room.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {room.available ? "Available" : "Unavailable"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => openEditRoom(room)} className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors" data-testid={`button-edit-room-${room.id}`}>
                              <Edit className="w-4 h-4" />
                            </button>
                            <button onClick={() => deleteRoom(room.id)} className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors" data-testid={`button-delete-room-${room.id}`}>
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {tab === "bookings" && (
          <div data-testid="admin-section-bookings">
            <h1 className="font-serif text-2xl font-bold text-gray-900 mb-6">Booking Management</h1>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm" data-testid="table-bookings">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Ref</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Guest</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Room</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Dates</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {bookings.map(booking => (
                      <tr key={booking.id} className="hover:bg-gray-50 transition-colors" data-testid={`row-booking-${booking.id}`}>
                        <td className="py-3 px-4 font-mono text-xs text-[hsl(42,75%,40%)] font-bold">{booking.id}</td>
                        <td className="py-3 px-4">
                          <p className="font-medium text-gray-900">{booking.guestName}</p>
                          <p className="text-xs text-gray-500">{booking.email}</p>
                        </td>
                        <td className="py-3 px-4 hidden md:table-cell text-gray-600">{booking.roomName}</td>
                        <td className="py-3 px-4 hidden lg:table-cell text-gray-600 text-xs">
                          {booking.checkIn} → {booking.checkOut}
                        </td>
                        <td className="py-3 px-4 font-medium">&#8377;{booking.totalPrice.toLocaleString("en-IN")}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            booking.status === "approved" ? "bg-green-100 text-green-700" :
                            booking.status === "pending" ? "bg-amber-100 text-amber-700" :
                            "bg-red-100 text-red-700"
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-1">
                            {booking.status === "pending" && (
                              <>
                                <button onClick={() => handleBookingStatus(booking.id, "approved")} className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors" data-testid={`button-approve-booking-${booking.id}`}>
                                  <Check className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleBookingStatus(booking.id, "cancelled")} className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors" data-testid={`button-cancel-booking-${booking.id}`}>
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            {booking.status !== "pending" && (
                              <span className="text-xs text-gray-400 italic">{booking.status}</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {tab === "users" && (
          <div data-testid="admin-section-users">
            <h1 className="font-serif text-2xl font-bold text-gray-900 mb-6">User Management</h1>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm" data-testid="table-users">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">User</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Phone</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Bookings</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Joined</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {demoUsers.map(u => (
                      <tr key={u.id} className="hover:bg-gray-50 transition-colors" data-testid={`row-user-${u.id}`}>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[hsl(220,35%,14%)] text-white flex items-center justify-center font-semibold text-sm">
                              {u.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{u.name}</p>
                              <p className="text-xs text-gray-500">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 hidden md:table-cell text-gray-600 text-xs">{u.phone}</td>
                        <td className="py-3 px-4 text-center font-medium">{u.bookings}</td>
                        <td className="py-3 px-4 hidden lg:table-cell text-gray-600 text-xs">{u.joined}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => blockUser(u.id)} className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors text-xs px-2" data-testid={`button-block-user-${u.id}`}>
                              {u.status === "active" ? "Block" : "Unblock"}
                            </button>
                            <button onClick={() => removeUser(u.id)} className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors" data-testid={`button-remove-user-${u.id}`}>
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Room Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" data-testid="modal-room">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-serif text-xl font-semibold">{modal.mode === "add" ? "Add New Room" : "Edit Room"}</h2>
              <button onClick={() => setModal(m => ({ ...m, open: false }))} className="text-gray-400 hover:text-gray-600" data-testid="button-close-room-modal">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <Label>Room Name</Label>
                <Input value={modal.room.name || ""} onChange={e => setModal(m => ({ ...m, room: { ...m.room, name: e.target.value } }))} placeholder="e.g. Ocean View Suite" className="mt-1" data-testid="input-room-name" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Type</Label>
                  <select value={modal.room.type || "standard"} onChange={e => setModal(m => ({ ...m, room: { ...m.room, type: e.target.value as Room["type"] } }))} className="mt-1 w-full border rounded-md px-3 py-2 text-sm" data-testid="select-room-type">
                    <option value="standard">Standard</option>
                    <option value="deluxe">Deluxe</option>
                    <option value="suite">Suite</option>
                  </select>
                </div>
                <div>
                  <Label>Price / Night (&#8377;)</Label>
                  <Input type="number" value={modal.room.price || ""} onChange={e => setModal(m => ({ ...m, room: { ...m.room, price: Number(e.target.value) } }))} placeholder="5000" className="mt-1" data-testid="input-room-price" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Capacity</Label>
                  <Input type="number" value={modal.room.capacity || ""} onChange={e => setModal(m => ({ ...m, room: { ...m.room, capacity: Number(e.target.value) } }))} placeholder="2" className="mt-1" data-testid="input-room-capacity" />
                </div>
                <div>
                  <Label>Available</Label>
                  <select value={modal.room.available ? "true" : "false"} onChange={e => setModal(m => ({ ...m, room: { ...m.room, available: e.target.value === "true" } }))} className="mt-1 w-full border rounded-md px-3 py-2 text-sm" data-testid="select-room-available">
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Input value={modal.room.description || ""} onChange={e => setModal(m => ({ ...m, room: { ...m.room, description: e.target.value } }))} placeholder="Brief description..." className="mt-1" data-testid="input-room-description" />
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => setModal(m => ({ ...m, open: false }))} className="flex-1" data-testid="button-cancel-room-modal">Cancel</Button>
                <Button onClick={saveRoom} className="flex-1 bg-[hsl(220,35%,14%)] text-white" data-testid="button-save-room">{modal.mode === "add" ? "Add Room" : "Save Changes"}</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
