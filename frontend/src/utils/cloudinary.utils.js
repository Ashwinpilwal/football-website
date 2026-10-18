export const CLOUDINARY_POST_TRANSFORMATION = "w_1280,c_limit,f_auto,q_auto";
export const CLOUDINARY_AVATAR_TRANSFORMATION = "w_240,h_240,c_fill,g_face,q_auto:good,f_auto";

/**
 * Optimizes Cloudinary image URLs for posts up to 1280px width,
 * using f_auto,q_auto,c_limit to preserve the exact original aspect ratio (2:3, 1:1, 4:3, etc.)
 * without cropping or stretching.
 * Example output:
 * https://res.cloudinary.com/YOUR_CLOUD/image/upload/w_1280,c_limit,f_auto,q_auto/v12345/posts/match.jpg
 */
export function optimizeCloudinaryPostImage(url, transformations = CLOUDINARY_POST_TRANSFORMATION) {
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
 * Derives a video thumbnail image from a Cloudinary video URL at second 0 (so_0)
 * with optimized width and format, avoiding downloading the full video.
 * Example output:
 * https://res.cloudinary.com/YOUR_CLOUD/video/upload/so_0,w_1280,c_limit,f_auto,q_auto/v12345/posts/clip.jpg
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
  return `${prefix}so_0,w_1280,c_limit,f_auto,q_auto/${cleanSuffix}`;
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
