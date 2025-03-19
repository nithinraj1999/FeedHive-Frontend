import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const user = useSelector((state: any) => state.auth.user); // Adjust 'any' based on your Redux state type

  return user ? children : <Navigate to="/" />;
};

export default PrivateRoute;
