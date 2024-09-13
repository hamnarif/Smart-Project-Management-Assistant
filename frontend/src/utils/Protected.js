import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../middleware/AuthContext";

const Protected = () => {
    const { session, role, loading } = useAuth();

    const location = useLocation()

    console.log("check loading: " + loading)

    if (loading) {
        return <div>Loading...</div>;
    }

    if (session === null) {
        return <Navigate to={"/Sign-in"} />;
    }

    console.log("CHECK ROLE: " + role)


    if (role === "Research Officer" && (location.pathname === "/PC1" || location.pathname === "/Authorization%20of%20Funds" || location.pathname === "Minutes%20of%20Meeting")) {
        return <Navigate replace to={"/"} />
    }

    if (role === "Executive dept official" && (location.pathname === "/Authorization%20of%20Funds" || location.pathname === "/Meeting%20Scheduling")) {
        return <Navigate replace to={"/"} />
    }
    // // Minutes%20of%20Meeting

    if (role === "Cheif P & D" && (location.pathname == "/PC1" || location.pathname === "/Minutes%20of%20Meeting" || location.pathname === "/Meeting%20Scheduling")) {
        return <Navigate replace to={"/"} />
    }


    if (role === "Normal" && (location.pathname !== "/")) {
        return <Navigate replace to={"/"} />
    }
    return <Outlet />;

};

export default Protected;
