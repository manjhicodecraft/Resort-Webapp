import PageHeader from "@/components/PageHeader";
import RoomCard from "@/components/RoomCard";
import { ROOMS } from "@/data/demo";

export default function Rooms() {
  return (
    <div className="min-h-screen pt-16 bg-[hsl(40,20%,97%)]">
      {/* Header */}
      <PageHeader
        eyebrow="Accommodations"
        title="Rooms & Suites"
        description="From thoughtfully designed standard rooms to breathtaking presidential suites, every space is a private haven."
        image="https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1920&auto=format&fit=crop"
        testId="section-rooms-header"
      />

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
