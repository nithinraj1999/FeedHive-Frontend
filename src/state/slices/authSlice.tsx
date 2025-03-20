import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface Category{
  _id:string,
  categoryName:string
}
interface User {
  _id:string,
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string; 
  likedArticle:any;
  dislikedArticle:any;
  preferences:Category[];
  role: "user" | "admin";
}

const loadUserFromStorage = (): User | null => {
  try {
    const storedUser = localStorage.getItem("userData");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Error loading user from localStorage:", error);
    return null;
  }
};

interface AuthState {
  user: User | null;
}

const initialState: AuthState = {
  user: loadUserFromStorage(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      localStorage.setItem("userData", JSON.stringify(action.payload));
    },

    logout: (state) => {
      state.user = null;
      localStorage.removeItem("userData"); 
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
