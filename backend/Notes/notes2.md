# Why we make a cluster and then connect it to MongoDB compass and then connect it to VsCode? 
>   We create a Cluster to store the data, connect it to Compass to view/manage data easily, and connect it to VS Code so our app can use that data.
         
    Cluster → Actual online database
    Compass → GUI to view/edit the database
    VS Code → App code that connects to the cluster and performs CRUD


# Note:
>   If backend has CORS enabled:

        app.use(cors({
        origin: "http://localhost:5173"
        }));

    response contains header:

        Access-Control-Allow-Origin: http://localhost:5173

    Backend is basically saying:

    “Yes, I allow 5173.”


    The attacker cannot change your backend code.
    app.use(cors()) is written on your server, not in the browser.


# What is Proxy?
>   A proxy in a React app is a middle layer that forwards requests from frontend to backend.

    Instead of: fetch("http://localhost:8000/api/users")
    you can write: fetch("/api/users")  --> cleaner code

    and React/Vite automatically forwards it to backend.


    
    axios.get('/api/jokes')


    export default defineConfig({
        server:{
            proxy:{
                '/api': 'http://localhost:3000'  //not replace, it appendbefore /api
            }
        }
    })

    fetch("/api/users")

    automatically becomes: http://localhost:8000/api/users


>   Without Proxy

    Frontend: localhost:5173, Backend: localhost:8000

    React does: fetch("http://localhost:8000/api")

    Now browser sees: 5173 → 8000
    Different ports = different origins.

    Browser says: “Wait… different website detected 👀 I need CORS permission.”

    So browser blocks unless backend allows it.

>   With Proxy

    fetch("/api")

    Request first goes to: localhost:5173
    because frontend itself is running there.

    Browser sees: 5173 → 5173

    Same origin ✅
    So browser is happy.

    Then secretly: Vite proxy forwards request to 8000

    Like this:  Browser (frontend)
                    ↓
                Vite/React Server (5173)
                    ↓
                Backend Server (8000)

>   So Vite server is basically: A Node.js server running your frontend during development    

>   Why no CORS when browser talks to Vite?

    Because browser ONLY cares about: Who is browser talking to?

    If React app opened from: localhost:5173
    and request also goes to: localhost:5173

    then browser says: Same origin ✅, no CORS check needed.

>   Then how does Vite contact backend without CORS?

    Vite server is NOT a browser.

    It is a backend/server program. Servers can usually send requests anywhere freely.

    CORS restricts: Browsers
    NOT: Node.js, Express, Vite, backend servers

    That’s why Vite can forward request to backend freely.