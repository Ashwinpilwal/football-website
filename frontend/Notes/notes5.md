if i got mu access token session expires after 1 hour how will i call refreshaccesstoken in frontend and where i have to call

This is one of the most important parts of JWT authentication. The cleanest approach is to let Axios handle it automatically using an interceptor. That way, every API call benefits without you writing extra code.

Flow
Login
    │
    ▼
Access Token (1 hour)
Refresh Token (7 days / 30 days)
        │
        ▼
User makes API request
        │
        ▼
Access token expired?
        │
    ┌───┴────┐
    │        │
   No       Yes
    │        │
    ▼        ▼
 Success   POST /users/refresh-token
                │
                ▼
       New Access Token
                │
                ▼
      Retry original request

The user never notices this happening.

Where should you call /refresh-token?

Not inside your React components.

Don't do this:

useEffect(() => {
    api.post("/users/refresh-token");
}, []);

or

const handleClick = async () => {
    await api.post("/users/refresh-token");
}

Instead, call it from an Axios response interceptor.

axios.utils.js

Your instance might already look like this:

import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api/v1",
    withCredentials: true,
});

export default api;

Now add an interceptor.

api.interceptors.response.use(
    (response) => response,

    async (error) => {

        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {

            originalRequest._retry = true;

            await api.post("/users/refresh-token");

            return api(originalRequest);
        }

        return Promise.reject(error);
    }
);
What happens?

Suppose you write:

await api.get("/videos");

The access token has expired.

Backend returns:

401 Unauthorized

Axios interceptor catches it.

It automatically does:

POST /users/refresh-token

Backend verifies the refresh token cookie.

If valid:

Creates new access token

Then Axios retries:

GET /videos

This time it succeeds.

Your component never knows the token expired.

If the refresh token is also expired

Backend returns:

401 Unauthorized

The interceptor can't recover anymore.

At that point:

dispatch(sliceLogout());

navigate("/login");

This is the correct time to log the user out.