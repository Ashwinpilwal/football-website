export const CLOUDINARY_POST_TRANSFORMATION = "w_1080,c_limit,f_auto,q_auto:good";
export const CLOUDINARY_AVATAR_TRANSFORMATION = "w_180,h_180,c_fill,g_face,q_auto:good,f_auto";
export const CLOUDINARY_TURF_HERO_TRANSFORMATION = "w_1200,c_limit,f_auto,q_auto:good";
export const CLOUDINARY_TURF_THUMB_TRANSFORMATION = "w_600,h_360,c_fill,f_auto,q_auto:good";
export const CLOUDINARY_MINI_THUMB_TRANSFORMATION = "w_240,h_160,c_fill,f_auto,q_auto";
export const CLOUDINARY_BANNER_TRANSFORMATION = "w_1280,c_limit,f_auto,q_auto:good";
export const CLOUDINARY_GROUP_ICON_TRANSFORMATION = "w_160,h_160,c_fill,f_auto,q_auto:good";

/**
 * Universal Cloudinary URL Optimizer.
 * Injects smart next-gen format conversion (f_auto), perceptual quality compression (q_auto:good),
 * and dimension caps to preserve visual fidelity while slashing image payload by 70-90%.
 */
export function optimizeCloudinaryUrl(url, transformations = "f_auto,q_auto:good,w_1080,c_limit") {
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
 * Optimizes Cloudinary image URLs for posts up to 1080px width,
 * using f_auto,q_auto:good,c_limit to preserve the exact original aspect ratio (2:3, 1:1, 4:3, etc.)
 * without cropping or stretching.
 */
export function optimizeCloudinaryPostImage(url, transformations = CLOUDINARY_POST_TRANSFORMATION) {
  return optimizeCloudinaryUrl(url, transformations);
}

/**
 * Turf Main Picture / Hero in TurfDetailPage:
 * Preserves the pristine, high-resolution original master image quality for the centerpiece showcase photo,
 * ensuring razor-sharp turf textures, fence netting, floodlights, and smooth sky gradients without compression artifacts.
 */
export function optimizeTurfHeroImage(url) {
  if (!url || typeof url !== "string") return url;
  return getOriginalCloudinaryUrl(url);
}

/**
 * Turf Cards / Thumbnails in Nearby Turfs, Find Turfs, and Gallery Strips:
 * Crops and scales to 600x360 with fast delivery quality (~30-40KB).
 */
export function optimizeTurfThumbnail(url) {
  return optimizeCloudinaryUrl(url, CLOUDINARY_TURF_THUMB_TRANSFORMATION);
}

/**
 * Small Gallery Thumbnails (e.g. angle selector in TurfDetailPage):
 * 240x160 fast preview (~10-15KB).
 */
export function optimizeMiniThumbnail(url) {
  return optimizeCloudinaryUrl(url, CLOUDINARY_MINI_THUMB_TRANSFORMATION);
}

/**
 * Cover Banner (Profile headers and settings cover banners):
 * Scales width up to 1280px without upscaling (c_limit) with auto WebP/AVIF format and high-efficiency compression,
 * saving multiple megabytes while staying crisp on large displays.
 */
export function optimizeCloudinaryBanner(url) {
  return optimizeCloudinaryUrl(url, CLOUDINARY_BANNER_TRANSFORMATION);
}

/**
 * Group Chat Icon / Squad Profile Picture:
 * 160x160 square fill crop with auto WebP/AVIF format and perceptual compression.
 * Delivers lightweight ~8-15KB icons with retina sharpness.
 */
export function optimizeGroupIcon(url) {
  return optimizeCloudinaryUrl(url, CLOUDINARY_GROUP_ICON_TRANSFORMATION);
}

/**
 * Derives a video thumbnail image from a Cloudinary video URL at second 0 (so_0)
 * with optimized width and format, avoiding downloading the full video.
 */
export function getCloudinaryVideoThumbnail(url) {
  if (!url || typeof url !== "string") return url;

  const videoMarker = "/video/upload/";
  const videoIndex = url.indexOf(videoMarker);
  if (videoIndex === -1) {
    return url;
  }

  let normalizedUrl = url;
  if (normalizedUrl.startsWith("http://res.cloudinary.com/")) {
    normalizedUrl = "https://" + normalizedUrl.slice("http://".length);
  }

  const markerIndex = normalizedUrl.indexOf(videoMarker);
  const prefix = normalizedUrl.slice(0, markerIndex + videoMarker.length);
  let suffix = normalizedUrl.slice(markerIndex + videoMarker.length);

  // Replace video extension with .jpg
  suffix = suffix.replace(/\.(mp4|webm|mov|ogg|m4v)(\?.*)?$/i, ".jpg");

  // Filter any existing transforms
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
  return `${prefix}so_0,w_1080,c_limit,f_auto,q_auto:good/${cleanSuffix}`;
}

/**
 * Returns the original uncompressed Cloudinary URL for full-screen / lightbox viewing.
 * Strips out dimensions and compression filters to provide pristine resolution.
 */
export function getOriginalCloudinaryUrl(url) {
  if (!url || typeof url !== "string") return url;

  const uploadMarker = url.includes("/image/upload/")
    ? "/image/upload/"
    : url.includes("/video/upload/")
    ? "/video/upload/"
    : null;

  if (!uploadMarker) {
    return url;
  }

  let normalizedUrl = url;
  if (normalizedUrl.startsWith("http://res.cloudinary.com/")) {
    normalizedUrl = "https://" + normalizedUrl.slice("http://".length);
  }

  const markerIndex = normalizedUrl.indexOf(uploadMarker);
  const prefix = normalizedUrl.slice(0, markerIndex + uploadMarker.length);
  const suffix = normalizedUrl.slice(markerIndex + uploadMarker.length);

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
  return `${prefix}${cleanSuffix}`;
}
