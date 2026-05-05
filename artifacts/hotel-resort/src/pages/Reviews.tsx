import { useState } from "react";
import { ThumbsUp, MessageSquare } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import StarRating from "@/components/StarRating";
import { REVIEWS } from "@/data/demo";
import { useToast } from "@/hooks/use-toast";
import type { Review } from "@/data/demo";

export default function Reviews() {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>(REVIEWS);
  const [form, setForm] = useState({ name: "", comment: "", rating: 5 });

  const avg = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.comment) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }
    const newReview: Review = {
      id: reviews.length + 1,
      name: form.name,
      rating: form.rating,
      comment: form.comment,
      date: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      avatar: form.name.slice(0,2).toUpperCase(),
      country: "India",
    };
    setReviews(prev => [newReview, ...prev]);
    setForm({ name: "", comment: "", rating: 5 });
    toast({ title: "Review submitted! Thank you for your feedback." });
  };

  const ratingDist = [5,4,3,2,1].map(r => ({
    r,
    count: reviews.filter(rv => rv.rating === r).length,
    pct: Math.round((reviews.filter(rv => rv.rating === r).length / reviews.length) * 100),
  }));

  return (
    <div className="min-h-screen pt-16 bg-[hsl(40,20%,97%)]">
      <PageHeader
        eyebrow="Guest Experiences"
        title="Reviews & Ratings"
        description="Real stories from guests who came for the view and stayed for the care."
        image="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1920&auto=format&fit=crop"
        testId="section-reviews-header"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Summary */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-10 flex flex-col sm:flex-row items-center gap-8" data-testid="section-rating-summary">
          <div className="text-center">
            <p className="font-serif text-6xl font-bold text-[hsl(42,75%,40%)]">{avg}</p>
            <StarRating rating={Math.round(Number(avg))} size="lg" />
            <p className="text-gray-500 text-sm mt-1">{reviews.length} reviews</p>
          </div>
          <div className="flex-1 w-full">
            {ratingDist.map(({ r, count, pct }) => (
              <div key={r} className="flex items-center gap-3 mb-2" data-testid={`rating-bar-${r}`}>
                <span className="text-sm text-gray-600 w-4">{r}</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-2 bg-[hsl(42,75%,52%)] rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 w-8">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Review Form */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-10" data-testid="section-review-form">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-[hsl(42,75%,45%)]" />
            <h2 className="font-serif text-xl font-semibold">Write a Review</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="review-name">Your Name</Label>
              <Input
                id="review-name"
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="Enter your name"
                className="mt-1"
                data-testid="input-review-name"
              />
            </div>
            <div>
              <Label>Your Rating</Label>
              <div className="flex gap-2 mt-2">
                {[1,2,3,4,5].map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setForm(p => ({ ...p, rating: r }))}
                    className={`w-9 h-9 rounded-lg border text-sm font-bold transition-all ${form.rating >= r ? "bg-[hsl(42,75%,52%)] text-white border-[hsl(42,75%,52%)]" : "border-gray-200 text-gray-400 hover:border-[hsl(42,75%,52%)]"}`}
                    data-testid={`button-rating-${r}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="review-comment">Your Review</Label>
              <Textarea
                id="review-comment"
                value={form.comment}
                onChange={e => setForm(p => ({ ...p, comment: e.target.value }))}
                placeholder="Share your experience at Grand Azure Resort..."
                rows={4}
                className="mt-1"
                data-testid="textarea-review-comment"
              />
            </div>
            <Button type="submit" className="bg-[hsl(220,35%,14%)] hover:bg-[hsl(42,75%,45%)] text-white" data-testid="button-submit-review">
              Submit Review
            </Button>
          </form>
        </div>

        {/* Reviews List */}
        <div className="space-y-5" data-testid="section-reviews-list">
          {reviews.map(review => (
            <div key={review.id} className="bg-white rounded-2xl shadow-sm p-6" data-testid={`card-review-${review.id}`}>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[hsl(220,35%,14%)] text-white flex items-center justify-center font-semibold text-sm">
                    {review.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm" data-testid={`text-reviewer-${review.id}`}>{review.name}</p>
                    <p className="text-xs text-gray-500">{review.date} &middot; {review.country}</p>
                  </div>
                </div>
                <StarRating rating={review.rating} size="sm" />
              </div>
              <p className="text-gray-700 text-sm leading-relaxed" data-testid={`text-review-comment-${review.id}`}>
                "{review.comment}"
              </p>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                <button className="text-xs text-gray-500 hover:text-[hsl(42,75%,45%)] flex items-center gap-1 transition-colors" data-testid={`button-helpful-${review.id}`}>
                  <ThumbsUp className="w-3.5 h-3.5" />
                  Helpful
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
