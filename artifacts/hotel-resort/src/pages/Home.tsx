import { Link } from "wouter";
import { ChevronRight, Star, MapPin, Calendar, Shield, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import StarRating from "@/components/StarRating";
import { GALLERY_IMAGES, REVIEWS, SPECIAL_OFFERS, ATTRACTIONS } from "@/data/demo";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section
        className="relative min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1920&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        data-testid="section-hero"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <p className="text-[hsl(42,75%,72%)] text-sm font-medium tracking-[0.3em] uppercase mb-4">
            Welcome to Luxury
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            Grand Azure
            <br />
            <span className="text-[hsl(42,75%,72%)]">Resort</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 mb-10 leading-relaxed max-w-2xl mx-auto">
            A sanctuary of unparalleled luxury on the Konkan Coast, where world-class hospitality meets the timeless beauty of the sea.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/booking">
              <Button
                size="lg"
                className="bg-[hsl(42,75%,52%)] hover:bg-[hsl(42,75%,45%)] text-[hsl(220,35%,8%)] font-semibold text-base px-8 py-3 rounded-full"
                data-testid="button-book-now-hero"
              >
                Book Your Stay
                <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            </Link>
            <Link href="/virtual-tour">
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-[hsl(220,35%,8%)] rounded-full font-semibold text-base px-8 py-3"
                data-testid="button-virtual-tour-hero"
              >
                Virtual Tour
              </Button>
            </Link>
          </div>

          <div className="mt-16 flex flex-wrap justify-center gap-8 text-center">
            {[
              { label: "Years of Excellence", value: "25+" },
              { label: "Luxury Rooms", value: "120" },
              { label: "Guest Satisfaction", value: "98%" },
              { label: "Awards Won", value: "47" },
            ].map((stat) => (
              <div key={stat.label} data-testid={`stat-${stat.label.replace(/\s+/g, "-").toLowerCase()}`}>
                <p className="font-serif text-3xl font-bold text-[hsl(42,75%,72%)]">{stat.value}</p>
                <p className="text-xs text-gray-300 mt-1 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Book Bar */}
      <section className="bg-white shadow-lg py-6" data-testid="section-quick-book">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Check-in</label>
              <div className="flex items-center gap-2 mt-1 border border-gray-200 rounded-lg px-3 py-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <input type="date" className="flex-1 text-sm outline-none bg-transparent" data-testid="input-checkin-quick" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Check-out</label>
              <div className="flex items-center gap-2 mt-1 border border-gray-200 rounded-lg px-3 py-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <input type="date" className="flex-1 text-sm outline-none bg-transparent" data-testid="input-checkout-quick" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Guests</label>
              <select className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none" data-testid="select-guests-quick">
                {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Guest{n>1?"s":""}</option>)}
              </select>
            </div>
            <Link href="/booking">
              <Button className="w-full bg-[hsl(220,35%,14%)] hover:bg-[hsl(42,75%,45%)] text-white font-semibold py-2.5" data-testid="button-check-availability">
                Check Availability
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Special Offers */}
      <section className="py-16 bg-[hsl(40,20%,97%)]" data-testid="section-offers">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[hsl(42,75%,45%)] text-sm font-medium tracking-widest uppercase mb-2">Limited Time</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900">Special Offers</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SPECIAL_OFFERS.map((offer, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all group"
                data-testid={`card-offer-${i}`}
              >
                <div className="inline-block bg-[hsl(42,75%,95%)] text-[hsl(42,75%,35%)] font-bold text-lg px-3 py-1 rounded-lg mb-4">
                  {offer.discount}
                </div>
                <h3 className="font-serif font-semibold text-lg text-gray-900 mb-2">{offer.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{offer.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Valid until {offer.validUntil}</span>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono text-gray-700">{offer.code}</code>
                </div>
                <Link href="/booking">
                  <Button variant="outline" size="sm" className="w-full mt-4 border-[hsl(220,35%,14%)] text-[hsl(220,35%,14%)] hover:bg-[hsl(220,35%,14%)] hover:text-white transition-all" data-testid={`button-claim-offer-${i}`}>
                    Claim Offer
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 bg-white" data-testid="section-gallery">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[hsl(42,75%,45%)] text-sm font-medium tracking-widest uppercase mb-2">Visual Journey</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900">Resort Gallery</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {GALLERY_IMAGES.map((img, i) => (
              <div
                key={i}
                className={`relative overflow-hidden rounded-xl group cursor-pointer ${i === 0 ? "sm:col-span-2 sm:row-span-2" : ""}`}
                style={{ aspectRatio: i === 0 ? "1/1" : "4/3" }}
                data-testid={`img-gallery-${i}`}
              >
                <img
                  src={img.url}
                  alt={img.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-end p-3">
                  <p className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">{img.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section className="py-16 bg-[hsl(220,35%,10%)] text-white" data-testid="section-amenities">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[hsl(42,75%,62%)] text-sm font-medium tracking-widest uppercase mb-2">World Class</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold">Resort Amenities</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
            {[
              { icon: "🏊", label: "Infinity Pool" },
              { icon: "💆", label: "Luxury Spa" },
              { icon: "🍽️", label: "Fine Dining" },
              { icon: "🏋️", label: "Fitness Center" },
              { icon: "🎾", label: "Tennis Courts" },
              { icon: "🏖️", label: "Private Beach" },
            ].map((a, i) => (
              <div key={i} className="group" data-testid={`amenity-${i}`}>
                <div className="text-4xl mb-3">{a.icon}</div>
                <p className="text-sm font-medium text-gray-300 group-hover:text-[hsl(42,75%,62%)] transition-colors">{a.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16 bg-[hsl(40,20%,97%)]" data-testid="section-reviews">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[hsl(42,75%,45%)] text-sm font-medium tracking-widest uppercase mb-2">Guest Voices</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900">What Our Guests Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REVIEWS.slice(0, 3).map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                data-testid={`card-review-${review.id}`}
              >
                <StarRating rating={review.rating} />
                <p className="text-gray-700 text-sm mt-3 leading-relaxed line-clamp-4">
                  "{review.comment}"
                </p>
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                  <div className="w-9 h-9 rounded-full bg-[hsl(220,35%,14%)] text-white flex items-center justify-center font-semibold text-sm">
                    {review.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{review.name}</p>
                    <p className="text-xs text-gray-500">{review.date} &middot; {review.country}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/reviews">
              <Button variant="outline" className="border-[hsl(220,35%,14%)] text-[hsl(220,35%,14%)] hover:bg-[hsl(220,35%,14%)] hover:text-white" data-testid="button-view-all-reviews">
                View All Reviews
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Nearby Attractions */}
      <section className="py-16 bg-white" data-testid="section-attractions">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[hsl(42,75%,45%)] text-sm font-medium tracking-widest uppercase mb-2">Explore</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900">Nearby Attractions</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ATTRACTIONS.map((a, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-[hsl(42,75%,52%)] hover:shadow-sm transition-all"
                data-testid={`card-attraction-${i}`}
              >
                <div className="w-10 h-10 rounded-full bg-[hsl(42,75%,95%)] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[hsl(42,75%,45%)]" />
                </div>
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-gray-900 text-sm">{a.name}</h3>
                    <span className="text-xs text-[hsl(42,75%,45%)] font-medium whitespace-nowrap">{a.distance}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{a.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-20 relative"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        data-testid="section-cta"
      >
        <div className="absolute inset-0 bg-[hsl(220,35%,10%/0.85)]" />
        <div className="relative z-10 text-center text-white px-4 max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4">Ready for an Unforgettable Stay?</h2>
          <p className="text-gray-300 mb-8 leading-relaxed">
            Book directly for the best rates and exclusive benefits. Our team is available around the clock to ensure your stay is perfect.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/booking">
              <Button size="lg" className="bg-[hsl(42,75%,52%)] hover:bg-[hsl(42,75%,45%)] text-[hsl(220,35%,8%)] font-semibold px-8 rounded-full" data-testid="button-book-now-cta">
                Book Your Room
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-[hsl(220,35%,8%)] px-8 rounded-full" data-testid="button-contact-cta">
                <Phone className="w-4 h-4 mr-2" />
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
