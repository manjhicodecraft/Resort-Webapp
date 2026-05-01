import RoomCard from "@/components/RoomCard";
import { ROOMS } from "@/data/demo";

export default function Rooms() {
  return (
    <div className="min-h-screen pt-16 bg-[hsl(40,20%,97%)]">
      {/* Header */}
      <div
        className="relative py-20 bg-[hsl(220,35%,12%)]"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1920&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",
        }}
        data-testid="section-rooms-header"
      >
        <div className="absolute inset-0 bg-[hsl(220,35%,10%/0.80)]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center text-white">
          <p className="text-[hsl(42,75%,62%)] text-sm font-medium tracking-widest uppercase mb-2">Accommodations</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-4">Rooms &amp; Suites</h1>
          <p className="text-gray-300 max-w-xl mx-auto">
            From thoughtfully designed standard rooms to breathtaking presidential suites, every space is a private haven.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" data-testid="section-rooms-list">
        {/* Standard */}
        <div className="mb-12">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
            Standard Rooms
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ROOMS.filter(r => r.type === "standard").map(room => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        </div>

        {/* Deluxe */}
        <div className="mb-12">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
            Deluxe Rooms
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ROOMS.filter(r => r.type === "deluxe").map(room => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        </div>

        {/* Suites */}
        <div className="mb-12">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
            Suites &amp; Villas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ROOMS.filter(r => r.type === "suite").map(room => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
