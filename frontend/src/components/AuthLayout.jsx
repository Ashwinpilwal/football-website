import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function AuthLayout({
    children,
    authentication = true,
}) {

    const navigate = useNavigate();

    const authStatus = useSelector((state) => state.auth.status);
    const authLoading = useSelector((state) => state.auth.loading);

    useEffect(() => {

        // Wait until authentication check finishes
        if (authLoading) return;

        if (!authStatus && authentication) {
            navigate("/login");
        } else if (authStatus && !authentication) {
            navigate("/");
        }

    }, [authStatus, authLoading, authentication, navigate]);

    if (authLoading) {
        return <div className="text-white bg-black">Loading...</div>;
    }

    return children;
}