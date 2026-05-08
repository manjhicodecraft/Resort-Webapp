import React, { useState } from "react";
import { Tabs, Tab } from "./ui/tabs";

// Placeholder user data (replace with real data fetching in production)
const mockUser = {
  photo: "https://randomuser.me/api/portraits/men/32.jpg",
  name: "Amit Sharma",
  contact: "+91 9876543210",
  email: "amit.sharma@email.com",
  address: {
    line1: "123, Palm Residency",
    line2: "Near Beach Road",
    city: "Ratnagiri",
    state: "Maharashtra",
    zip: "415612",
    country: "India",
  },
};

const ViewProfile = () => (
  <div className="flex flex-col md:flex-row gap-8 p-6">
    <div className="flex flex-col items-center md:items-start gap-4 min-w-[220px]">
      <img
        src={mockUser.photo}
        alt="User profile"
        className="w-32 h-32 rounded-full object-cover border-4 border-[hsl(42,75%,62%)] shadow-md"
      />
      <button className="px-4 py-1 rounded bg-[hsl(42,75%,62%)] text-[hsl(220,35%,10%)] font-semibold text-sm hover:bg-[hsl(42,75%,52%)] transition">Add/Change Photo</button>
    </div>
    <div className="flex-1 space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-2">User Name</h2>
        <div className="bg-white/5 rounded p-3 text-lg font-medium">{mockUser.name}</div>
      </div>
      <div>
        <h2 className="text-xl font-bold mb-2">Contact Number</h2>
        <div className="bg-white/5 rounded p-3 text-lg font-medium">{mockUser.contact}</div>
      </div>
      <div>
        <h2 className="text-xl font-bold mb-2">Mail ID</h2>
        <div className="bg-white/5 rounded p-3 text-lg font-medium">{mockUser.email}</div>
      </div>
      <div>
        <h2 className="text-xl font-bold mb-2">Address Information</h2>
        <div className="bg-white/5 rounded p-3 text-lg font-medium">
          {mockUser.address.line1},<br />
          {mockUser.address.line2},<br />
          {mockUser.address.city}, {mockUser.address.state} - {mockUser.address.zip},<br />
          {mockUser.address.country}
        </div>
      </div>
    </div>
  </div>
);
const MyBookings = () => <div>List of your bookings.</div>;
const ReviewsRatings = () => (
  <div className="p-6 space-y-8">
    <div>
      <h2 className="text-xl font-bold mb-4">Your Reviews</h2>
      <div className="bg-white/5 rounded p-4 mb-2">
        <div className="font-semibold">Grand Azure Resort</div>
        <div className="text-yellow-400">★★★★★</div>
        <div className="text-gray-200 mt-1">Amazing stay, great service and beautiful view!</div>
        <div className="text-xs text-gray-400 mt-1">April 2026</div>
      </div>
      <div className="bg-white/5 rounded p-4">
        <div className="font-semibold">Grand Azure Resort</div>
        <div className="text-yellow-400">★★★★☆</div>
        <div className="text-gray-200 mt-1">Very good, but food options can improve.</div>
        <div className="text-xs text-gray-400 mt-1">January 2026</div>
      </div>
    </div>
    <div>
      <h2 className="text-xl font-bold mb-4">Resort Ratings</h2>
      <div className="flex items-center gap-2 text-lg">
        <span className="text-yellow-400 text-2xl">★★★★☆</span>
        <span className="text-gray-200">4.5/5 (120 reviews)</span>
      </div>
    </div>
    <div>
      <h2 className="text-xl font-bold mb-4">Feedback</h2>
      <form className="space-y-3 max-w-md">
        <textarea className="w-full p-2 rounded bg-white/10 text-gray-100" rows={3} placeholder="Write your feedback..." />
        <button type="submit" className="px-4 py-2 rounded bg-[hsl(42,75%,62%)] text-[hsl(220,35%,10%)] font-semibold hover:bg-[hsl(42,75%,52%)] transition">Submit Feedback</button>
      </form>
    </div>
  </div>
);
const SecuritySettings = () => <div>Change password, 2FA, etc.</div>;
const TravelPreferences = () => <div>Set your travel preferences here.</div>;
const LoyaltyProgram = () => <div>Reward points, membership, coupons.</div>;
const SupportSection = () => <div>Chat with support, help tickets.</div>;

const UserProfile: React.FC = () => {
  const [tab, setTab] = useState("profile");

  return (
    <div className="user-profile-container">
      <Tabs value={tab} onValueChange={setTab}>
        <Tab value="profile" label="View Profile" />
        <Tab value="bookings" label="My Bookings" />
        <Tab value="reviews" label="Reviews & Ratings" />
        <Tab value="security" label="Security Settings" />
        <Tab value="preferences" label="Travel Preferences" />
        <Tab value="loyalty" label="Loyalty Program" />
        <Tab value="support" label="Support" />
      </Tabs>
      <div className="user-profile-content">
        {tab === "profile" && <ViewProfile />}
        {tab === "bookings" && <MyBookings />}
        {tab === "reviews" && <ReviewsRatings />}
        {tab === "security" && <SecuritySettings />}
        {tab === "preferences" && <TravelPreferences />}
        {tab === "loyalty" && <LoyaltyProgram />}
        {tab === "support" && <SupportSection />}
      </div>
    </div>
  );
};

export default UserProfile;
