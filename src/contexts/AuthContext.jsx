import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState(() => {
    
    // Load registered users from localStorage
    const storedUsers = localStorage.getItem("users");
    return storedUsers ? JSON.parse(storedUsers) : [];
  });

  // Load logged-in user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Save user + users to localStorage whenever they change
  useEffect(() => {
    if (user) {
      localStorage.setItem("authUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("authUser");
    }
    localStorage.setItem("users", JSON.stringify(users));
  }, [user, users]);

  const signup = (fullName, email, password) => {
    const existing = users.find((u) => u.email === email);
    if (existing) {
      alert("Email already registered!");
      return false;
    }
    const newUser = { fullName, email, password };
    setUsers([...users, newUser]);
    setUser(newUser);
    return true;
  };

  const login = (email, password) => {
    const found = users.find(
      (u) => u.email === email && u.password === password
    );
    if (!found) {
      alert("Invalid credentials. Please sign up first.");
      return false;
    }
    setUser(found);
    return true;
  };

  const loginAsGuest = () => {
    const guestUser = { fullName: "Guest", email: "guest@demo.com" };
    setUser(guestUser);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("authUser");
  };

  return (
    <AuthContext.Provider
      value={{ user, signup, login, loginAsGuest, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
