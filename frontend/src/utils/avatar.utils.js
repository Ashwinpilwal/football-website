export const CLOUDINARY_AVATAR_TRANSFORMATION = "w_240,h_240,c_fill,g_face,q_auto:good,f_auto";

/**
 * Optimizes Cloudinary URLs specifically for pfp (avatar) images by requesting
 * sharp 240x240 face-centered crop with balanced auto-quality (q_auto:good) and auto-format (f_auto).
 * Fast loading while maintaining crisp detail on standard and Retina displays.
 * Example output:
 * https://res.cloudinary.com/YOUR_CLOUD/image/upload/w_240,h_240,c_fill,g_face,q_auto:good,f_auto/v1234567890/players/messi.jpg
 */
export function optimizeCloudinaryAvatar(url, transformations = CLOUDINARY_AVATAR_TRANSFORMATION) {
  if (!url || typeof url !== "string") return url;

  const uploadMarker = "/image/upload/";
  const uploadIndex = url.indexOf(uploadMarker);
  if (uploadIndex === -1) {
    return url;
  }

  // Ensure https for secure loading
  let normalizedUrl = url;
  if (normalizedUrl.startsWith("http://res.cloudinary.com/")) {
    normalizedUrl = "https://" + normalizedUrl.slice("http://".length);
  }

  const markerIndex = normalizedUrl.indexOf(uploadMarker);
  const prefix = normalizedUrl.slice(0, markerIndex + uploadMarker.length);
  const suffix = normalizedUrl.slice(markerIndex + uploadMarker.length);

  // If already contains the exact transformation, return directly
  if (suffix.startsWith(`${transformations}/`)) {
    return normalizedUrl;
  }

  // Strip any existing transformation segments right after /image/upload/
  // Existing transformation segments contain parameters like w_, h_, c_, etc., and are not version tags (v123...)
  const segments = suffix.split("/");
  let restIndex = 0;
  while (
    restIndex < segments.length &&
    !/^v\d+$/.test(segments[restIndex]) &&
    /([a-z]{1,3}_)/.test(segments[restIndex])
  ) {
    restIndex++;
  }

  const cleanSuffix = segments.slice(restIndex).join("/");
  return `${prefix}${transformations}/${cleanSuffix}`;
}

/**
 * Returns user's uploaded avatar (optimized for pfps via Cloudinary if applicable),
 * or a modern football-themed initial avatar as a fallback.
 */
export function getAvatarUrl(user, fallbackName = "Player") {
  let rawUrl = null;

  if (typeof user === "string" && (user.startsWith("http") || user.startsWith("/") || user.startsWith("data:") || user.startsWith("blob:"))) {
    rawUrl = user;
  } else if (user?.avatar?.url && typeof user.avatar.url === "string") {
    rawUrl = user.avatar.url;
  } else if (typeof user?.avatar === "string" && (user.avatar.startsWith("http") || user.avatar.startsWith("/") || user.avatar.startsWith("data:") || user.avatar.startsWith("blob:"))) {
    rawUrl = user.avatar;
  } else if (typeof user?.url === "string" && (user.url.startsWith("http") || user.url.startsWith("/"))) {
    rawUrl = user.url;
  } else if (typeof user?.profilePicture === "string" && (user.profilePicture.startsWith("http") || user.profilePicture.startsWith("/"))) {
    rawUrl = user.profilePicture;
  } else if (typeof user?.photo === "string" && (user.photo.startsWith("http") || user.photo.startsWith("/"))) {
    rawUrl = user.photo;
  } else if (user?.user) {
    return getAvatarUrl(user.user, fallbackName);
  }

  if (rawUrl) {
    return optimizeCloudinaryAvatar(rawUrl);
  }

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
  let raw = null;
  if (typeof user === "string" && (user.startsWith("http") || user.startsWith("/"))) {
    raw = user;
  } else if (user?.coverImage?.url && typeof user.coverImage.url === "string") {
    raw = user.coverImage.url;
  } else if (typeof user?.coverImage === "string" && user.coverImage.startsWith("http")) {
    raw = user.coverImage;
  } else if (typeof user?.cover === "string" && user.cover.startsWith("http")) {
    raw = user.cover;
  }

  if (raw) {
    return optimizeCloudinaryBanner(raw);
  }
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

export {
  optimizeCloudinaryPostImage,
  optimizeTurfHeroImage,
  optimizeTurfThumbnail,
  optimizeMiniThumbnail,
  optimizeCloudinaryBanner,
  optimizeGroupIcon,
  getCloudinaryVideoThumbnail,
  getOriginalCloudinaryUrl,
  CLOUDINARY_POST_TRANSFORMATION,
  CLOUDINARY_TURF_HERO_TRANSFORMATION,
  CLOUDINARY_TURF_THUMB_TRANSFORMATION,
  CLOUDINARY_MINI_THUMB_TRANSFORMATION,
  CLOUDINARY_BANNER_TRANSFORMATION,
  CLOUDINARY_GROUP_ICON_TRANSFORMATION,
} from "./cloudinary.utils";

