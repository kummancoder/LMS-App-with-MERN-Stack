import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useSelector((store) => store.auth);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export const AuthenticatedUser = ({ children }) => {
    const { isAuthenticated } = useSelector((store) => store.auth);

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export const AdminRoute = ({ children }) => {
    const { user, isAuthenticated } = useSelector((store) => store.auth);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (user?.data?.role !== "instructor") {
        return <Navigate to="/" replace />;
    }

    return children;
};