# Backend Capability Map

This document serves as a complete map of the backend services, database schemas, and API endpoints, establishing the backend as the single source of truth for frontend development.

---

## 1. Database Schema & Models

### User Model (`User`)
*   **Fields**:
    *   `username` (String, required, unique, lowercase, indexed)
    *   `email` (String, required, unique, lowercase)
    *   `fullName` (String, required, indexed)
    *   `avatar` (`{ url: String, public_id: String }`, required)
    *   `coverImage` (`{ url: String, public_id: String }`)
    *   `role` (String, enum: `["user", "admin"]`, default: `"user"`)
    *   `isOnline` (Boolean, default: `false`)
    *   `lastSeen` (Date, default: `null`)
    *   `watchHistory` (Array of `ObjectId` ref: `Video`)
    *   `password` (String, encrypted, required)
    *   `favouriteCountry` (`{ name: String, flag: String }`)
    *   `favouriteClub` (`{ name: String, logo: String }`)
    *   `favouritePlayer` (`{ name: String, image: String }`)
    *   `refreshToken` (String)
*   **Timestamps**: Yes

### Turf Model (`Turf`)
*   **Fields**:
    *   `name` (String, required)
    *   `type` (String, enum: `["turf", "playground"]`, required)
    *   `owner` (`ObjectId` ref: `User`, required)
    *   `address` (String, required)
    *   `location` (`{ type: "Point", coordinates: [Number] }`, indexed with `2dsphere`)
    *   `images` (Array of String URLs, default: `[]`)
    *   `pricePerHour` (Number, default: `null`)
    *   `phone` (String, default: `""`)
    *   `openingTime` (String, default: `""`)
    *   `closingTime` (String, default: `""`)
    *   `amenities` (Array of Strings, default: `[]`)
*   **Timestamps**: Yes

### Booking Model (`Booking`)
*   **Fields**:
    *   `user` (`ObjectId` ref: `User`, required)
    *   `turf` (`ObjectId` ref: `Turf`, required)
    *   `date` (Date, required)
    *   `slots` (Array of `{ startTime: String, endTime: String }`)
    *   `status` (String, enum: `["pending", "confirmed", "rejected", "cancelled"]`, default: `"pending"`)
*   **Timestamps**: Yes

### Post Model (`Post`)
*   **Fields**:
    *   `owner` (`ObjectId` ref: `User`, required)
    *   `section` (`ObjectId` ref: `Section`, default: `null`)
    *   `media` (Array of `{ url: String, public_id: String, type: ["image", "video"] }`)
    *   `thumbnail` (`{ url: String, public_id: String }`)
    *   `caption` (String, default: `""`)
*   **Timestamps**: Yes

### Section Model (`Section`)
*   **Fields**:
    *   `name` (String, required)
    *   `owner` (`ObjectId` ref: `User`, required)
    *   `coverImage` (`{ url: String, public_id: String }`)
*   **Timestamps**: Yes

### Video Model (`Video`)
*   **Fields**:
    *   `videoFile` (`{ url: String, public_id: String }`, required)
    *   `thumbnail` (`{ url: String, public_id: String }`, required)
    *   `title` (String, required)
    *   `description` (String, required)
    *   `duration` (Number, default: `0`)
    *   `views` (Number, default: `0`)
    *   `isPublished` (Boolean, default: `true`)
    *   `owner` (`ObjectId` ref: `User`, required)
    *   `section` (`ObjectId` ref: `Section`, default: `null`)
*   **Timestamps**: Yes

### Playlist Model (`Playlist`)
*   **Fields**:
    *   `name` (String, required)
    *   `coverImage` (`{ url: String, public_id: String }`, required)
    *   `description` (String, required)
    *   `visibility` (Boolean, default: `false`)
    *   `videos` (Array of `ObjectId` ref: `Video`)
    *   `owner` (`ObjectId` ref: `User`)
*   **Timestamps**: Yes

### Comment Model (`Comment`)
*   **Fields**:
    *   `content` (String, required, max: 1000 characters)
    *   `tweet` (`ObjectId` ref: `Tweet`)
    *   `post` (`ObjectId` ref: `Post`)
    *   `owner` (`ObjectId` ref: `User`, required)
*   **Timestamps**: Yes

### Like Model (`Like`)
*   **Fields**:
    *   `post` (`ObjectId` ref: `Post`)
    *   `comment` (`ObjectId` ref: `Comment`)
    *   `tweet` (`ObjectId` ref: `Tweet`)
    *   `likedBy` (`ObjectId` ref: `User`, required)
*   **Indexes**: Unique partial filters ensuring a user can like a post, comment, or tweet only once.
*   **Timestamps**: Yes

### Follow Model (`Follow`)
*   **Fields**:
    *   `follower` (`ObjectId` ref: `User`, required)
    *   `following` (`ObjectId` ref: `User`, required)
*   **Indexes**: Compound unique index `{ follower: 1, following: 1 }`
*   **Timestamps**: Yes

### Tweet Model (`Tweet`)
*   **Fields**:
    *   `content` (String, required)
    *   `owner` (`ObjectId` ref: `User`, required)
*   **Timestamps**: Yes

### Chat Model (`Chat`)
*   **Fields**:
    *   `participants` (Array of `ObjectId` ref: `User`, required)
    *   `isGroupChat` (Boolean, default: `false`)
    *   `groupName` (String, default: `""`)
    *   `groupIcon` (String, default: `""`)
    *   `admin` (`ObjectId` ref: `User`, default: `null`)
    *   `lastMessage` (`ObjectId` ref: `Message`)
*   **Timestamps**: Yes

### Message Model (`Message`)
*   **Fields**:
    *   `chat` (`ObjectId` ref: `Chat`)
    *   `sender` (`ObjectId` ref: `User`)
    *   `message` (String, required)
    *   `attachment` (String, enum: `["video", "image", "text", "file"]`, default: `"text"`)
    *   `isRead` (Boolean, default: `false`)
    *   `isEdited` (Boolean, default: `false`)
*   **Timestamps**: Yes

---

## 2. API Endpoints Map

### Users & Authentication (`/api/v1/users`)
*   `POST /register` (Public) - Create user account. Uploads files for `avatar` and `coverImage`.
*   `POST /login` (Public) - Authenticate and set cookies.
*   `POST /logout` (Auth Required) - Clear session and invalidates tokens.
*   `POST /refresh-token` (Public) - Verify and issue new access/refresh token.
*   `POST /change-password` (Auth Required) - Change password.
*   `GET /current-user` (Auth Required) - Get authenticated user metadata.
*   `PATCH /update-account-details` (Auth Required) - Update standard user parameters.
*   `PATCH /update-avatar` (Auth Required) - Upload new user avatar to Cloudinary.
*   `PATCH /update-coverimage` (Auth Required) - Upload new user cover image to Cloudinary.
*   `GET /channel/:username` (Auth Required) - Fetch channel profile metrics/details by username.
*   `GET /history` (Auth Required) - Retrieve watch history.
*   `GET /all-users` (Public) - Retrieve list of all users.
*   `GET /suggested-users` (Auth Required) - Fetch suggested users for matching/following.

### Followers (`/api/v1/follow`)
*   `POST /toggle-follow/:username` (Auth Required) - Toggle follow/unfollow.
*   `GET /followers/:username` (Public) - Get followers list.
*   `GET /following/:username` (Public) - Get following list.
*   `GET /my-followers` (Auth Required) - Get logged-in user's followers.
*   `GET /my-following` (Auth Required) - Get logged-in user's following list.

### Turfs & Grounds (`/api/v1/turfs`)
*   `POST /create-turf` (Admin Only) - Create a turf with coordinates + images (up to 10).
*   `GET /nearby` (Auth Required) - Get all turfs or geospatial lookup based on query params `lat`, `lng`, and `maxDistanceKm`.
*   `GET /:turfId` (Auth Required) - Get turf details by ID.
*   `PATCH /:turfId` (Admin Only) - Update turf details.
*   `DELETE /:turfId` (Admin Only) - Delete turf and its associated images from Cloudinary.

### Booking & Slots (`/api/v1/bookings`)
*   `POST /create-booking` (Auth Required) - Book a turf. Requires `turfId`, `date`, and array of `slots` (`startTime`, `endTime`).
*   `GET /my-bookings` (Auth Required) - Fetch logged-in user's bookings. Optional `?status=` filter.
*   `PATCH /:bookingId/cancel` (Auth Required) - Cancel booking (owner only).
*   `GET /turf/:turfId` (Admin Only) - Retrieve all bookings for a turf. Optional `?status=` filter.
*   `PATCH /:bookingId/status` (Admin Only) - Update booking status to `confirmed` or `rejected`.

### Geolocated Pitches & Playgrounds (`/api/v1/pitches`)
*   `GET /nearby` (Public) - Directly proxies the Geoapify API (`sport.pitch,leisure.playground`) using coordinates `lat` and `lng` up to a radius of 100km. Requires `GEOAPIFY_API_KEY`. No local DB storage.

### Social Posts (`/api/v1/posts`)
*   `POST /create-post` (Auth Required) - Create a post. Uploads file array for `media` (up to 10) and single file for `thumbnail`. Optional `section` mapping.
*   `GET /user/:userId` (Public) - Get posts authored by a user.
*   `GET /section/:sectionId` (Public) - Get posts grouped under a section.
*   `GET /all-posts` (Public) - Get randomized/shuffled posts across all users.
*   `GET /:postId` (Public) - Get a single post.
*   `PATCH /:postId` (Auth Required) - Update post caption or thumbnail (owner only).
*   `DELETE /:postId` (Auth Required) - Delete post, removing post media and thumbnail from Cloudinary (owner only).
*   `PATCH /:postId/section` (Auth Required) - Add, remove, or change post's section (owner only).

### Profile/Post Sections (`/api/v1/sections`)
*   `POST /create-section` (Auth Required) - Create a profile/post category section. Uploads `coverImage`.
*   `GET /user/:username` (Public) - Fetch all sections created by a user.
*   `GET /my-sections` (Auth Required) - Retrieve logged-in user's sections.
*   `GET /:sectionId` (Public) - Get section metadata.
*   `PATCH /:sectionId` (Auth Required) - Update section details/cover image.
*   `DELETE /:sectionId` (Auth Required) - Delete section.

### Likes (`/api/v1/likes`)
*   `POST /toggle-post-like/:postId` (Auth Required) - Toggle like on a Post.
*   `POST /toggle-comment-like/:commentId` (Auth Required) - Toggle like on a Comment.
*   `POST /toggle-tweet-like/:tweetId` (Auth Required) - Toggle like on a Tweet.
*   `GET /get-liked-posts` (Auth Required) - List posts liked by the user (paginated).

### Comments (`/api/v1/comments`)
*   `POST /add-comment/:postId` (Auth Required) - Add a comment to a Post.
*   `DELETE /delete-comment/:commentId` (Auth Required) - Delete a comment (owner only). Cleans up likes.
*   `GET /show-all-comments/:postId` (Auth Required) - Get comments for a post (paginated).
*   `POST /edit-comment/:commentId` (Auth Required) - Edit comment content (owner only).

### Tweets (`/api/v1/tweets`)
*   `POST /create-tweet` (Auth Required) - Create a text-only tweet.
*   `GET /all-tweets/:username` (Auth Required) - Get user's tweets (paginated).
*   `PATCH /update-tweet/:tweetId` (Auth Required) - Update tweet content (owner only).
*   `DELETE /delete-tweet/:tweetId` (Auth Required) - Delete tweet and clean up associated likes (owner only).

### Group & Private Chats (`/api/v1/chats`)
*   `POST /get-chatId` (Auth Required) - Get or create a 1-to-1 chat session with `receiverId`.
*   `GET /get-all-group-chats` (Auth Required) - Get group chats the logged-in user participates in.
*   `POST /create-group-chat` (Auth Required) - Create group chat (requires `groupName` and at least 2 participants).
*   `GET /get-group-chat-details/:chatId` (Auth Required) - Fetch group chat metadata and participant information.

### Chat Messages (`/api/v1/messages`)
*   `GET /all-messages/:chatId` (Auth Required) - Retrieve all messages in a chat (paginated/aggregated).

### Videos & Playlists (`/api/v1/videos`, `/api/v1/playlists`)
*   `POST /videos/postvideo` (Auth Required) - Upload a video (`video` + `thumbnail` files).
*   `GET /videos/allvideos` (Public) - Get all public videos.
*   `GET /videos/allvideos/:username` (Public) - Get all public videos by username.
*   `GET /videos/video/:videoId` (Public) - Get single video by ID.
*   `DELETE /videos/delete-video/:videoId` (Auth Required) - Delete video (owner only).
*   `PATCH /videos/change-publish-status/:videoId` (Auth Required) - Toggle publish state.
*   `PATCH /videos/updatevideo/:videoId` (Auth Required) - Update video details/thumbnail (owner only).
*   `POST /playlists/create-playlist` (Auth Required) - Create a playlist. Uploads `coverImage`.
*   `GET /playlists/show-playlists` (Auth Required) - List all playlists owned by user.
*   `PATCH /playlists/add-to-playlist/:videoId` (Auth Required) - Append video to a playlist.
*   `DELETE /playlists/delete-from-playlist/:videoId` (Auth Required) - Remove video from playlist.
*   `POST /playlists/update-playlist/:playlistId` (Auth Required) - Update playlist details/cover image.
*   `DELETE /playlists/delete-playlist` (Auth Required) - Delete playlist.

---

## 3. Real-Time Socket Connection

### Connection & Authentication
*   Uses Socket.io.
*   Authenticates on handshake by parsing the cookies header for `accessToken`.
*   Assigns a personal user room based on their `_id` (`socket.join(user._id)`).

### Socket Events
*   `send-message` (Client -> Server)
    *   **Payload**: `{ message: String, chatId: String }`
    *   **Behavior**: Creates a `Message` record in MongoDB, links it as `lastMessage` in `Chat`, and broadcasts to all chat participants via `receive-message`.
*   `receive-message` (Server -> Client)
    *   **Payload**: Populated `Message` object containing sender metadata (`username`, `fullName`, `avatar`).

---

## 4. Feature Support Summary

### Fully Supported Features
Features where both DB schemas, controller methods, and API routes are complete, integrated with error utilities and fully operational.
1.  **Authentication & Profile Management**: Complete session controls, JWT tokens, avatar/cover uploads, and profile history.
2.  **Social Posts & Profile Sections**: Post creation, multiple media/thumbnail upload, section grouping, and deletion including Cloudinary assets.
3.  **Tweets**: Fully operational text-only microblogging system with paging.
4.  **Likes & Follows**: Cross-model likes (Post, Comment, Tweet) with partial indexes for integrity. Follow/Unfollow dynamics.
5.  **Turf & Ground Registration**: Geo-indexed Point location queries, admin controls, and Cloudinary asset management.
6.  **Pitches Discovery**: Direct, real-time integration with Geoapify places.
7.  **Turf Booking System**: Multi-slot booking validations, status state-machine (pending, confirmed, rejected, cancelled), and admin operations.
8.  **Videos & Playlists**: Video uploading, publishing toggles, custom playlist structures, and video references.
9.  **Private & Group Chats**: Group creation and 1-to-1 chat initialization.
10. **Real-time Messaging**: Socket.io authenticated pipeline broadcasting messages to participant rooms.

### Partially Supported Features
Features represented in schemas or models but not fully exposed via controllers/routes.
1.  **Tweet Comments**: The `Comment` schema supports a `tweet` field, but the comments controller and routes are built exclusively around `postId`. There are no routes to query or post comments directly to a `Tweet` entity.
2.  **Message Attachments**: The `Message` schema supports an `attachment` field (enum: `["video", "image", "text", "file"]`), but the socket handler only processes string `message` text and does not support receiving/handling file uploads inside socket messages.

### Unsupported / Missing Features
Features mentioned in the request or common to social portals but completely absent in backend models/routes.
1.  **Notifications**: No notification tables, event logs, push notification systems, or real-time event alerts for comments, follows, bookings, or likes.
2.  **Matches & Teams**: No team management, matchmaking, matches posting, football scoring, game scheduling, or game results structures.
3.  **Media Upload direct API**: Media upload is not exposed as a general utility endpoint; it is tightly coupled inside specific controller routines (e.g. `register`, `createPost`, `postvideo`).
