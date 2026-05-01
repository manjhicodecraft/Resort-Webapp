import { Link } from "wouter";
import { Users, Wifi, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Room } from "@/data/demo";

interface RoomCardProps {
  room: Room;
}

export default function RoomCard({ room }: RoomCardProps) {
  const typeColors: Record<Room["type"], string> = {
    standard: "bg-blue-100 text-blue-800",
    deluxe: "bg-purple-100 text-purple-800",
    suite: "bg-amber-100 text-amber-800",
  };

  return (
    <div
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 group"
      data-testid={`card-room-${room.id}`}
    >
      <div className="relative overflow-hidden h-52">
        <img
          src={room.image}
          alt={room.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          data-testid={`img-room-${room.id}`}
        />
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${typeColors[room.type]}`}>
            {room.type.charAt(0).toUpperCase() + room.type.slice(1)}
          </span>
        </div>
        {!room.available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold text-sm bg-black/60 px-3 py-1.5 rounded-full">
              Not Available
            </span>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-serif font-semibold text-lg text-gray-900" data-testid={`text-room-name-${room.id}`}>
            {room.name}
          </h3>
          <div className="text-right">
            <span className="text-[hsl(42,75%,40%)] font-bold text-lg" data-testid={`text-room-price-${room.id}`}>
              &#8377;{room.price.toLocaleString("en-IN")}
            </span>
            <p className="text-xs text-gray-500">per night</p>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2" data-testid={`text-room-desc-${room.id}`}>
          {room.description}
        </p>

        <div className="flex items-center gap-1.5 mb-3 text-gray-500">
          <Users className="w-4 h-4" />
          <span className="text-xs">Up to {room.capacity} guests</span>
          <Wifi className="w-4 h-4 ml-2" />
          <span className="text-xs">Free WiFi</span>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {room.amenities.slice(0, 3).map((a) => (
            <span key={a} className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 px-2 py-0.5 rounded-full">
              <Check className="w-3 h-3 text-green-600" />
              {a}
            </span>
          ))}
          {room.amenities.length > 3 && (
            <span className="text-xs text-gray-400 px-2 py-0.5">
              +{room.amenities.length - 3} more
            </span>
          )}
        </div>

        <Link href={room.available ? `/booking?room=${room.id}` : "#"}>
          <Button
            className="w-full bg-[hsl(220,35%,14%)] hover:bg-[hsl(42,75%,45%)] hover:text-white text-white transition-all duration-300"
            disabled={!room.available}
            data-testid={`button-book-room-${room.id}`}
          >
            {room.available ? "Book Now" : "Not Available"}
          </Button>
        </Link>
      </div>
    </div>
  );
}
