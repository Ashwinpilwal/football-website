# Turf Booking Availability Logic

If a turf is open from 8:00 AM to 10:00 PM on 16 September:

1. If there are no bookings for the given turfId and date, the entire time period is available.
2. If there is a booking from 1:00 PM to 2:00 PM, that slot becomes unavailable.
3. The turf can still be booked from 8:00 AM–1:00 PM and 2:00 PM–10:00 PM.
4. Availability is calculated from the turf's operating hours and the existing bookings for that specific turfId and date.
5. pending and confirmed bookings should both be treated as unavailable.

> ## EXAMPLE

For example, on 16 September:

Turf: Turf A
Opening: 08:00
Closing: 22:00


DB:
1 booking
13:00 → 14:00

Availability becomes:

08:00 → 09:00   AVAILABLE
09:00 → 10:00   AVAILABLE
10:00 → 11:00   AVAILABLE
11:00 → 12:00   AVAILABLE
12:00 → 13:00   AVAILABLE


13:00 → 14:00   BOOKED


14:00 → 15:00   AVAILABLE
15:00 → 16:00   AVAILABLE
16:00 → 17:00   AVAILABLE
17:00 → 18:00   AVAILABLE
18:00 → 19:00   AVAILABLE
19:00 → 20:00   AVAILABLE
20:00 → 21:00   AVAILABLE
21:00 → 22:00   AVAILABLE

So yes:

No booking for turfId + date → the entire operating period is available.

Existing bookings → those periods become unavailable, and everything around them remains available.