import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../state/slices/authSlice";
const NavBar = () => {
  const navigate = useNavigate();
    const dispatch = useDispatch()
  const handleLogout = () => {
    dispatch(logout())
    navigate("/"); // Redirect to login page after logout
  };

  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
      <h1 className="text-xl font-bold">FeedHive</h1>

      <div className="space-x-4">
        <button onClick={() => navigate("/my-articles")} className="px-4 py-2 bg-black rounded-lg ">
          My Articles
        </button>

        <button onClick={() => navigate("/feed")} className="px-4 py-2 bg-black rounded-lg ">
home
        </button>
        <button onClick={() => navigate("/create-article")} className="px-4 py-2 bg-black rounded-lg ">
          create post
        </button>
        <button onClick={() => navigate("/my-profile")} className="px-4 py-2 bg-black rounded-lg ">
          My Profile
        </button>
        <button onClick={handleLogout} className="px-4 py-2 bg-black rounded-lg ">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
