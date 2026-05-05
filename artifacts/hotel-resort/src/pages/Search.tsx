import { useState } from "react";
import { Search as SearchIcon, SlidersHorizontal } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import RoomCard from "@/components/RoomCard";
import { ROOMS } from "@/data/demo";

export default function Search() {
  const [query, setQuery] = useState("");
  const [roomType, setRoomType] = useState<"all" | "standard" | "deluxe" | "suite">("all");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(30000);
  const [guests, setGuests] = useState(1);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [searched, setSearched] = useState(false);

  const filtered = ROOMS.filter(room => {
    if (onlyAvailable && !room.available) return false;
    if (roomType !== "all" && room.type !== roomType) return false;
    if (room.price < minPrice || room.price > maxPrice) return false;
    if (room.capacity < guests) return false;
    if (query && !room.name.toLowerCase().includes(query.toLowerCase()) && !room.description.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen pt-16 bg-[hsl(40,20%,97%)]">
      <PageHeader
        eyebrow="Find Your Perfect Room"
        title="Search & Filter"
        image="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1920&auto=format&fit=crop"
        testId="section-search-header"
      >
        <div className="px-4">
          <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2">
            <SearchIcon className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search rooms, amenities..."
              className="flex-1 outline-none text-gray-800 text-sm bg-transparent"
              data-testid="input-search-query"
            />
          </div>
        </div>
      </PageHeader>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters */}
          <aside className="lg:w-64 bg-white rounded-xl shadow-sm p-6 h-fit" data-testid="section-filters">
            <div className="flex items-center gap-2 mb-6">
              <SlidersHorizontal className="w-5 h-5 text-gray-600" />
              <h2 className="font-semibold text-gray-900">Filters</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Room Type</label>
                <div className="space-y-2">
                  {(["all", "standard", "deluxe", "suite"] as const).map(type => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer" data-testid={`filter-type-${type}`}>
                      <input
                        type="radio"
                        name="roomType"
                        value={type}
                        checked={roomType === type}
                        onChange={() => setRoomType(type)}
                        className="accent-[hsl(42,75%,45%)]"
                      />
                      <span className="text-sm text-gray-700 capitalize">{type === "all" ? "All Types" : type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Price Range: &#8377;{minPrice.toLocaleString("en-IN")} – &#8377;{maxPrice.toLocaleString("en-IN")}
                </label>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Min Price</p>
                    <input
                      type="range"
                      min={0}
                      max={25000}
                      step={500}
                      value={minPrice}
                      onChange={e => setMinPrice(Number(e.target.value))}
                      className="w-full accent-[hsl(42,75%,45%)]"
                      data-testid="input-price-min"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Max Price</p>
                    <input
                      type="range"
                      min={3000}
                      max={30000}
                      step={500}
                      value={maxPrice}
                      onChange={e => setMaxPrice(Number(e.target.value))}
                      className="w-full accent-[hsl(42,75%,45%)]"
                      data-testid="input-price-max"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Guests</label>
                <select
                  value={guests}
                  onChange={e => setGuests(Number(e.target.value))}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  data-testid="select-filter-guests"
                >
                  {[1,2,3,4,5,6,8].map(n => <option key={n} value={n}>{n}+ Guest{n>1?"s":""}</option>)}
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer" data-testid="filter-available">
                  <input
                    type="checkbox"
                    checked={onlyAvailable}
                    onChange={e => setOnlyAvailable(e.target.checked)}
                    className="accent-[hsl(42,75%,45%)]"
                  />
                  <span className="text-sm text-gray-700">Available only</span>
                </label>
              </div>

              <Button
                onClick={() => setSearched(true)}
                className="w-full bg-[hsl(220,35%,14%)] text-white hover:bg-[hsl(42,75%,45%)] transition-all"
                data-testid="button-apply-filters"
              >
                Search Rooms
              </Button>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1" data-testid="section-search-results">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                {filtered.length} room{filtered.length !== 1 ? "s" : ""} found
              </p>
            </div>

            {filtered.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                <SearchIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="font-serif text-xl font-semibold text-gray-700 mb-2">No Rooms Found</h3>
                <p className="text-gray-500 text-sm">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map(room => (
                  <RoomCard key={room.id} room={room} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
