/**
 * Returns user's uploaded avatar, or a modern football-themed initial avatar as a fallback.
 */
export function getAvatarUrl(user, fallbackName = "Player") {
  if (typeof user === "string" && (user.startsWith("http") || user.startsWith("/") || user.startsWith("data:") || user.startsWith("blob:"))) {
    return user;
  }
  if (user?.avatar?.url && typeof user.avatar.url === "string") return user.avatar.url;
  if (typeof user?.avatar === "string" && (user.avatar.startsWith("http") || user.avatar.startsWith("/") || user.avatar.startsWith("data:") || user.avatar.startsWith("blob:"))) return user.avatar;
  if (typeof user?.url === "string" && (user.url.startsWith("http") || user.url.startsWith("/"))) return user.url;
  if (typeof user?.profilePicture === "string" && (user.profilePicture.startsWith("http") || user.profilePicture.startsWith("/"))) return user.profilePicture;
  if (typeof user?.photo === "string" && (user.photo.startsWith("http") || user.photo.startsWith("/"))) return user.photo;
  
  let name = user?.fullName || user?.username;
  if (!name && typeof user === "string" && !user.match(/^[0-9a-fA-F]{24}$/) && !user.startsWith("http")) {
    name = user;
  }
  if (!name) {
    name = fallbackName;
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=059669&color=ffffff&bold=true&size=256`;
}

export function getCoverUrl(user) {
  if (typeof user === "string" && (user.startsWith("http") || user.startsWith("/"))) {
    return user;
  }
  if (user?.coverImage?.url && typeof user.coverImage.url === "string") return user.coverImage.url;
  if (typeof user?.coverImage === "string" && user.coverImage.startsWith("http")) return user.coverImage;
  if (typeof user?.cover === "string" && user.cover.startsWith("http")) return user.cover;
  return "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200";
}

/**
 * Cleans duplicated words or consecutive repeated address phrases
 * (e.g., "Lovely Professional University Lovely Professional University, Uni mall" -> "Lovely Professional University, Uni mall")
 */
export function cleanAddress(address) {
  if (!address || typeof address !== "string") return "";
  let clean = address.trim();

  // 1. Clean comma-separated segments from duplicates
  const segments = clean.split(/,\s*/);
  const seen = new Set();
  const dedupedSegments = [];

  for (const seg of segments) {
    const s = seg.trim();
    if (!s) continue;
    const lower = s.toLowerCase();
    if (!seen.has(lower)) {
      seen.add(lower);
      dedupedSegments.push(s);
    }
  }

  let text = dedupedSegments.join(", ");

  // 2. Remove consecutive repeated phrases/words within the string
  const words = text.split(/\s+/);
  for (let len = Math.floor(words.length / 2); len >= 1; len--) {
    for (let i = 0; i <= words.length - 2 * len; i++) {
      const p1 = words.slice(i, i + len).join(" ").replace(/[,.\s]+$/, "").toLowerCase();
      const p2 = words.slice(i + len, i + 2 * len).join(" ").replace(/[,.\s]+$/, "").toLowerCase();
      if (p1 && p1 === p2) {
        words.splice(i + len, len);
        i--;
      }
    }
  }

  return words.join(" ").replace(/,\s*,/g, ",").trim();
}

