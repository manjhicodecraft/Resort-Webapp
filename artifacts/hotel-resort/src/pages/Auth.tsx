import { useState } from "react";
import { useLocation } from "wouter";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { login, signup } from "@/lib/auth";

export default function Auth() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [showPwd, setShowPwd] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({ name: "", email: "", password: "" });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const result = login(loginForm.email, loginForm.password);
    if (result.success) {
      toast({ title: `Welcome back, ${result.user?.name}!` });
      setTimeout(() => {
        if (result.user?.isAdmin) {
          setLocation("/admin");
        } else {
          setLocation("/");
        }
      }, 800);
    } else {
      toast({ title: result.error || "Login failed", variant: "destructive" });
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    const result = signup(signupForm.name, signupForm.email, signupForm.password);
    if (result.success) {
      toast({ title: `Account created! Welcome, ${result.user?.name}!` });
      setTimeout(() => setLocation("/"), 800);
    } else {
      toast({ title: result.error || "Signup failed", variant: "destructive" });
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 pt-16"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&auto=format&fit=crop')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      data-testid="page-auth"
    >
      <div className="absolute inset-0 bg-[hsl(220,35%,10%/0.80)]" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-[hsl(42,75%,52%)] flex items-center justify-center mx-auto mb-3">
            <span className="text-[hsl(220,35%,10%)] font-bold text-2xl font-serif">G</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-white">Grand Azure Resort</h1>
          <p className="text-gray-400 text-sm mt-1">Sign in to access your account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Tabs */}
          <div className="flex">
            <button
              onClick={() => setTab("login")}
              className={`flex-1 py-4 text-sm font-semibold transition-all ${tab === "login" ? "bg-[hsl(220,35%,14%)] text-white" : "text-gray-500 hover:text-gray-700"}`}
              data-testid="tab-login"
            >
              Login
            </button>
            <button
              onClick={() => setTab("signup")}
              className={`flex-1 py-4 text-sm font-semibold transition-all ${tab === "signup" ? "bg-[hsl(220,35%,14%)] text-white" : "text-gray-500 hover:text-gray-700"}`}
              data-testid="tab-signup"
            >
              Sign Up
            </button>
          </div>

          <div className="p-8">
            {tab === "login" ? (
              <form onSubmit={handleLogin} className="space-y-5" data-testid="form-login">
                <div>
                  <Label htmlFor="login-email">Email</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="login-email"
                      type="email"
                      value={loginForm.email}
                      onChange={e => setLoginForm(p => ({ ...p, email: e.target.value }))}
                      placeholder="you@email.com"
                      className="pl-10"
                      data-testid="input-login-email"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="login-password"
                      type={showPwd ? "text" : "password"}
                      value={loginForm.password}
                      onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))}
                      placeholder="Your password"
                      className="pl-10 pr-10"
                      data-testid="input-login-password"
                    />
                    <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" data-testid="button-toggle-password">
                      {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full bg-[hsl(220,35%,14%)] hover:bg-[hsl(42,75%,45%)] text-white font-semibold py-3" data-testid="button-login-submit">
                  Sign In
                </Button>

                <div className="bg-[hsl(42,75%,95%)] rounded-lg p-3 text-xs text-gray-700">
                  <p className="font-semibold mb-1 text-[hsl(42,75%,40%)]">Admin Demo Account:</p>
                  <p>Email: admin@grandazure.com</p>
                  <p>Password: admin123</p>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSignup} className="space-y-5" data-testid="form-signup">
                <div>
                  <Label htmlFor="signup-name">Full Name</Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="signup-name"
                      value={signupForm.name}
                      onChange={e => setSignupForm(p => ({ ...p, name: e.target.value }))}
                      placeholder="Your full name"
                      className="pl-10"
                      data-testid="input-signup-name"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="signup-email"
                      type="email"
                      value={signupForm.email}
                      onChange={e => setSignupForm(p => ({ ...p, email: e.target.value }))}
                      placeholder="you@email.com"
                      className="pl-10"
                      data-testid="input-signup-email"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="signup-password"
                      type={showPwd ? "text" : "password"}
                      value={signupForm.password}
                      onChange={e => setSignupForm(p => ({ ...p, password: e.target.value }))}
                      placeholder="Create a password (min 4 chars)"
                      className="pl-10 pr-10"
                      data-testid="input-signup-password"
                    />
                    <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full bg-[hsl(220,35%,14%)] hover:bg-[hsl(42,75%,45%)] text-white font-semibold py-3" data-testid="button-signup-submit">
                  Create Account
                </Button>
              </form>
            )}
          </div>
        </div>

        <p className="text-center text-gray-400 text-xs mt-6">
          This is a demo application. No real data is stored.
        </p>
      </div>
    </div>
  );
}
