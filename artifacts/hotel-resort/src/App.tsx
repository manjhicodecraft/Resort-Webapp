import { useState, useEffect } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import Home from "@/pages/Home";
import Rooms from "@/pages/Rooms";
import Booking from "@/pages/Booking";
import Search from "@/pages/Search";
import Reviews from "@/pages/Reviews";
import Contact from "@/pages/Contact";
import Auth from "@/pages/Auth";
import Admin from "@/pages/Admin";
import VirtualTour from "@/pages/VirtualTour";
import Invoice from "@/pages/Invoice";
import MyBookings from "@/pages/MyBookings";
import NotFound from "@/pages/not-found";
import UserProfile from "@/components/UserProfile";

const queryClient = new QueryClient();

function AppLayout() {
  const [lang, setLang] = useState<"en" | "hi">("en");
  const [location] = useLocation();

  const isAdmin = location.startsWith("/admin");
  const isAuth = location === "/auth";

  return (
    <>
      <Navbar lang={lang} onLangToggle={() => setLang(l => l === "en" ? "hi" : "en")} />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/rooms" component={Rooms} />
        <Route path="/booking" component={Booking} />
        <Route path="/search" component={Search} />
        <Route path="/reviews" component={Reviews} />
        <Route path="/contact" component={Contact} />
        <Route path="/auth" component={Auth} />
        <Route path="/admin" component={Admin} />
        <Route path="/virtual-tour" component={VirtualTour} />
        <Route path="/invoice" component={Invoice} />
        <Route path="/my-bookings" component={MyBookings} />
        <Route path="/user-profile" component={UserProfile} />
        <Route component={NotFound} />
      </Switch>
      {!isAdmin && !isAuth && <Footer />}
      <Chatbot />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AppLayout />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
