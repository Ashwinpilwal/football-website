import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Star,
  ShieldCheck,
  Lock,
  MessageSquare,
  Sparkles,
  Trash2,
  CheckCircle2,
  CalendarCheck,
  Send,
  Edit3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ratingService } from "@/services/turf.service";
import { getAvatarUrl } from "@/utils/avatar.utils";
import toast from "react-hot-toast";

const STAR_LABELS = {
  1: "Poor Pitch Quality",
  2: "Fair / Needs Maintenance",
  3: "Good Playing Experience",
  4: "Very Good / Great Turf",
  5: "World Class Arena ⚽",
};

export default function TurfRatingsSection({ turfId, turfName }) {
  const { userData, status } = useSelector((state) => state.auth);

  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [distribution, setDistribution] = useState({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
  const [canRate, setCanRate] = useState(false);
  const [userRating, setUserRating] = useState(null);
  const [loading, setLoading] = useState(true);

  // Composer Form
  const [selectedStars, setSelectedStars] = useState(5);
  const [hoveredStars, setHoveredStars] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const loadRatings = async () => {
    if (!turfId) return;
    try {
      const res = await ratingService.getTurfRatings(turfId);
      const data = res?.data;
      if (data) {
        setRatings(data.ratings || []);
        setAverageRating(data.averageRating || 0);
        setTotalCount(data.totalCount || 0);
        setDistribution(data.distribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
        setCanRate(data.canRate);
        setUserRating(data.userRating);

        if (data.userRating) {
          setSelectedStars(data.userRating.rating);
          setReviewText(data.userRating.review || "");
        }
      }
    } catch (err) {
      console.log("Fetch ratings error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRatings();
  }, [turfId, userData?._id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!status) {
      toast.error("Please log in to submit your rating.");
      return;
    }

    if (!canRate) {
      toast.error("Access Denied: Only verified bookers of this turf can rate.");
      return;
    }

    if (selectedStars < 1 || selectedStars > 5) {
      toast.error("Please select a star rating between 1 and 5.");
      return;
    }

    setIsSubmitting(true);
    try {
      await ratingService.addOrUpdateRating(turfId, {
        rating: selectedStars,
        review: reviewText.trim(),
      });
      toast.success(userRating ? "Your review has been updated!" : "Rating and review submitted!");
      setIsEditing(false);
      await loadRatings();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to submit rating.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async (ratingId) => {
    try {
      await ratingService.deleteRating(ratingId);
      toast.success("Review deleted.");
      setUserRating(null);
      setReviewText("");
      setSelectedStars(5);
      await loadRatings();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete review.");
    }
  };

  const activeStarHover = hoveredStars || selectedStars;

  return (
    <div className="space-y-6 pt-4">
      {/* Section Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-lg">
            <Star className="size-5 fill-amber-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2 font-display">
              Player Ratings & Reviews
            </h3>
            <p className="text-xs text-neutral-400">
              Honest ratings from players who booked matches at this arena
            </p>
          </div>
        </div>

        {totalCount > 0 && (
          <Badge variant="outline" className="text-xs px-3 py-1 font-bold border-amber-500/30 text-amber-300">
            ★ {averageRating.toFixed(1)} / 5.0 ({totalCount} {totalCount === 1 ? "review" : "reviews"})
          </Badge>
        )}
      </div>

      {/* Ratings Summary Card */}
      <Card className="p-6 sm:p-8 bg-[#0b1118] border-white/10 shadow-2xl rounded-3xl grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Big Score & Stars */}
        <div className="md:col-span-5 text-center md:text-left space-y-2 md:border-r md:border-white/10 md:pr-6">
          <div className="text-5xl font-black text-white font-display tracking-tight flex items-baseline justify-center md:justify-start gap-2">
            <span>{totalCount > 0 ? averageRating.toFixed(1) : "—"}</span>
            <span className="text-xl font-semibold text-neutral-500">/ 5.0</span>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-1 text-amber-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`size-5 ${star <= Math.round(averageRating)
                  ? "fill-amber-400 text-amber-400"
                  : "text-neutral-700"
                  }`}
              />
            ))}
          </div>

          <p className="text-xs text-neutral-400 font-medium">
            {totalCount > 0
              ? `Based on ${totalCount} verified player ${totalCount === 1 ? "review" : "reviews"}`
              : "No reviews yet. Be the first verified booker to rate!"}
          </p>
        </div>

        {/* Right: Star Breakdown Progress Bars */}
        <div className="md:col-span-7 space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = distribution[star] || 0;
            const pct = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
            return (
              <div key={star} className="flex items-center gap-3 text-xs">
                <span className="w-12 font-bold text-neutral-400 flex items-center gap-1 shrink-0 font-mono">
                  <span>{star}</span>
                  <Star className="size-3 fill-amber-400 text-amber-400" />
                </span>
                <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden border border-white/5">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-10 text-right font-mono text-[11px] text-neutral-400 shrink-0">
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Review Composer / Gatekeeper Banner */}
      {canRate ? (
        // User is Verified Booker: Show Review Composer
        <Card className="p-6 sm:p-7 bg-[#0a1017] border border-emerald-500/30 shadow-2xl rounded-3xl space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CalendarCheck className="size-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>{userRating && !isEditing ? "Your Verified Review" : "Rate This Arena"}</span>
                  <Badge variant="emerald" className="text-[10px] py-0 px-2 font-bold">
                    ✓ Verified Booker
                  </Badge>
                </h4>
                <p className="text-[11px] text-neutral-400">
                  You booked a match here. Share your experience with the community.
                </p>
              </div>
            </div>

            {userRating && !isEditing && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="h-8 px-3 text-xs rounded-xl gap-1.5 bg-white/10 hover:bg-white/15 text-white cursor-pointer"
              >
                <Edit3 className="size-3.5" /> Edit Review
              </Button>
            )}
          </div>

          {userRating && !isEditing ? (
            // Display already submitted review
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`size-4 ${s <= userRating.rating ? "fill-amber-400 text-amber-400" : "text-neutral-700"}`}
                    />
                  ))}
                  <span className="text-xs font-bold text-neutral-300 ml-2 font-sans">
                    {STAR_LABELS[userRating.rating]}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteReview(userRating._id)}
                  className="text-neutral-400 hover:text-red-400 transition-colors p-1 cursor-pointer"
                  title="Delete Review"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>

              {userRating.review && (
                <p className="text-xs text-neutral-200 leading-relaxed font-sans pt-1">
                  "{userRating.review}"
                </p>
              )}
            </div>
          ) : (
            // Interactive Review Composer Form
            <form onSubmit={handleSubmitReview} className="space-y-4">
              {/* Star Rating Interactive Picker */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoveredStars(star)}
                      onMouseLeave={() => setHoveredStars(0)}
                      onClick={() => setSelectedStars(star)}
                      className="p-1 rounded-lg hover:scale-115 transition-all cursor-pointer focus:outline-none"
                    >
                      <Star
                        className={`size-7 transition-colors ${star <= activeStarHover
                          ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                          : "text-neutral-700 hover:text-neutral-500"
                          }`}
                      />
                    </button>
                  ))}

                  <span className="text-xs font-bold text-amber-300 ml-2 font-sans">
                    {STAR_LABELS[activeStarHover]}
                  </span>
                </div>
              </div>

              {/* Review Text */}
              <div className="space-y-1.5">
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="How was the turf grass quality, lighting, goalposts, parking, or amenities? (Optional)"
                  rows={3}
                  maxLength={1000}
                  className="w-full p-3.5 rounded-2xl bg-black/60 border border-white/10 text-white placeholder:text-neutral-500 text-xs sm:text-sm font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500 custom-scrollbar resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end gap-2.5">
                {isEditing && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsEditing(false)}
                    className="h-9 px-4 text-xs rounded-xl bg-white/10 hover:bg-white/15 text-white cursor-pointer"
                  >
                    Cancel
                  </Button>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={isSubmitting}
                  className="h-9 px-5 text-xs font-bold rounded-xl gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="size-3.5 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Send className="size-3.5" />
                      <span>{userRating ? "Update Review" : "Submit Review"}</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </Card>
      ) : (
        // User Has NOT Booked: Verified Booker Gatekeeper Alert
        <div className="p-4 sm:p-5 rounded-3xl bg-[#090e15] border border-white/10 flex items-start gap-3.5 shadow-xl">
          <div className="size-9 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 shrink-0 mt-0.5">
            <Lock className="size-4" />
          </div>
          <div className="space-y-1 text-xs">
            <p className="font-bold text-white flex items-center gap-1.5">
              <span>Verified Bookers Only</span>
              <Badge variant="outline" className="text-[9px] py-0 px-1.5 border-white/15 text-neutral-400 font-mono">
                Fair Reviews Policy
              </Badge>
            </p>
            <p className="text-neutral-400 leading-relaxed">
              To keep pitch recommendations genuine and spam-free, only players who have booked this arena through FootballHub can leave ratings and written reviews.
            </p>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-3.5 pt-2">
        <h4 className="text-sm font-bold text-neutral-300 uppercase tracking-wider px-1">
          Recent Player Feedback ({ratings.length})
        </h4>

        {ratings.length > 0 ? (
          <div className="space-y-3">
            {ratings.map((r) => {
              const isAuthor = userData?._id && r.user?._id?.toString() === userData._id.toString();
              return (
                <div
                  key={r._id}
                  className="p-5 rounded-3xl bg-[#090e15] border border-white/10 shadow-lg space-y-3 transition-all hover:border-white/15"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={getAvatarUrl(r.user)}
                        alt={r.user?.fullName || "Player"}
                        className="size-9 rounded-2xl object-cover ring-1 ring-white/10"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">
                            {r.user?.fullName || r.user?.username || "Verified Player"}
                          </span>
                          <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold border border-emerald-500/20">
                            ✓ Verified Match
                          </span>
                        </div>
                        <span className="text-[11px] text-neutral-500 font-mono">
                          @{r.user?.username || "player"} • {new Date(r.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`size-3.5 ${s <= r.rating ? "fill-amber-400 text-amber-400" : "text-neutral-700"}`}
                          />
                        ))}
                      </div>

                      {isAuthor && (
                        <button
                          type="button"
                          onClick={() => handleDeleteReview(r._id)}
                          className="text-neutral-500 hover:text-red-400 transition-colors p-1 cursor-pointer ml-1"
                          title="Delete My Review"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {r.review && (
                    <p className="text-xs text-neutral-300 leading-relaxed font-sans pl-1">
                      {r.review}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 rounded-3xl bg-[#090e15] border border-white/10 text-center space-y-2">
            <MessageSquare className="size-7 text-neutral-600 mx-auto" />
            <p className="text-xs text-neutral-400 font-medium">
              No written reviews posted yet for {turfName || "this turf"}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
