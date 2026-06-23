import { create } from "zustand";

interface UserProfile {
  fullName: string;
  gender: string;
  state: string;
  district: string;
  category: string;
  intermediateStream: string;
  marks?: number;
  rank?: number;
  interests: string[];
  careerGoals: string[];
}

interface UserSession {
  id: string;
  email: string | null;
  mobileNumber: string | null;
  role: string;
  profile: UserProfile;
}

interface AppStore {
  user: UserSession | null;
  token: string | null;
  theme: "light" | "dark";
  compareColleges: string[];
  
  // Actions
  setSession: (user: UserSession, token: string) => void;
  updateProfile: (profile: UserProfile) => void;
  logout: () => void;
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;
  addCompare: (collegeId: string) => void;
  removeCompare: (collegeId: string) => void;
  clearCompare: () => void;
}

export const useAppStore = create<AppStore>((set) => {
  // Safe extraction helper for client runtime
  const safeGet = (key: string, fallback: any) => {
    if (typeof window !== "undefined") {
      const val = localStorage.getItem(key);
      if (val) {
        try { return JSON.parse(val); } catch { return val; }
      }
    }
    return fallback;
  };

  const initialTheme = safeGet("theme", "light");
  const initialUser = safeGet("user", null);
  const initialToken = safeGet("token", null);

  // Apply initial theme classes on body (runs only in browser)
  if (typeof window !== "undefined") {
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }

  return {
    user: initialUser,
    token: initialToken,
    theme: initialTheme,
    compareColleges: [],

    setSession: (user, token) => {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      set({ user, token });
    },

    updateProfile: (profile) => {
      set((state) => {
        if (!state.user) return {};
        const updatedUser = { ...state.user, profile };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        return { user: updatedUser };
      });
    },

    logout: () => {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      set({ user: null, token: null });
    },

    toggleTheme: () => {
      set((state) => {
        const nextTheme = state.theme === "light" ? "dark" : "light";
        localStorage.setItem("theme", nextTheme);
        if (nextTheme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
        return { theme: nextTheme };
      });
    },

    setTheme: (theme) => {
      localStorage.setItem("theme", theme);
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      set({ theme });
    },

    addCompare: (id) => set((state) => {
      if (state.compareColleges.includes(id)) return {};
      if (state.compareColleges.length >= 3) {
        alert("You can compare a maximum of 3 colleges at once.");
        return {};
      }
      return { compareColleges: [...state.compareColleges, id] };
    }),

    removeCompare: (id) => set((state) => ({
      compareColleges: state.compareColleges.filter((cId) => cId !== id),
    })),

    clearCompare: () => set({ compareColleges: [] }),
  };
});
