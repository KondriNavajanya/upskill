import { createContext, useContext, useEffect, useState } from "react";
import { login, register } from "../services/authService";
import { fetchProfile } from "../services/userService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const profile = await fetchProfile();
        setUser(profile);
      } catch (error) {
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const persistAuth = (payload) => {
    localStorage.setItem("token", payload.token);
    setUser(payload.user);
  };

  const loginUser = async (values) => {
    const data = await login(values);
    persistAuth(data);
    return data;
  };

  const registerUser = async (values) => {
    const data = await register(values);
    persistAuth(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, loginUser, registerUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
