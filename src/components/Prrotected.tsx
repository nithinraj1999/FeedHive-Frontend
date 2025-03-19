import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../state/store";
interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const user = useSelector((state: RootState) => state.auth.user);
  return user ? children : <Navigate to="/" />;
};

export default PrivateRoute;
