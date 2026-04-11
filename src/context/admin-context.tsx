"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { UserResponse } from "@/types/type";

interface AppContext {
   user: UserResponse | null;
   setUser: (value: UserResponse) => void;
}

const AppContext = createContext<AppContext | null>(null);

export const AdminContextProvider = ({ children }: { children: ReactNode }) => {
   const [user, setUser] = useState<UserResponse>(null);

   useEffect(() => {
      const userJson = localStorage.getItem("userData");
      if (!userJson) return;
      setUser(JSON.parse(userJson) as UserResponse);
   }, []);

   return <AppContext.Provider value={{ user, setUser }}>{children}</AppContext.Provider>;
};

const useAdminContext = () => {
   const context = useContext(AppContext);

   if (!context) {
      throw new Error("Wrap app with AppContextProvider first");
   }

   return context;
};

export default useAdminContext;
