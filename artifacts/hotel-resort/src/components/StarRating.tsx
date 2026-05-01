import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: "sm" | "md" | "lg";
}

export default function StarRating({ rating, max = 5, size = "md" }: StarRatingProps) {
  const sizeClass = size === "sm" ? "w-3.5 h-3.5" : size === "lg" ? "w-6 h-6" : "w-4.5 h-4.5";

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={`${sizeClass} ${
            i < rating
              ? "fill-[hsl(42,75%,52%)] text-[hsl(42,75%,52%)]"
              : "fill-transparent text-gray-300"
          }`}
        />
      ))}
    </div>
  );
}
