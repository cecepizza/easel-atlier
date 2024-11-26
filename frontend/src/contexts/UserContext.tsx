"use client";

import { createContext, useContext, ReactNode } from "react";
import { useUser } from "@clerk/nextjs";

// setup a React Context system to manage user authentication state throughtout app
// Defines the shape of data that will be shared through the context
type UserContextType = {
  isLoaded: boolean; // Indicates if user data has finished loading
  userDetails: any; //user data from Clerk
};

// Creates a React Context with undefined as initial value
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component that wraps parts of the app that need access to user data
export function UserProvider({ children }: { children: ReactNode }) {
  // ^ says : 'expect an object with a property named children that must be of type ReactNode'
  // Uses Clerk's useUser hook to get authentication state and user data
  const { isLoaded, user } = useUser();

  return (
    <UserContext.Provider
      value={{
        isLoaded, // Indicates if user data has finished loading
        userDetails: user, // The actual user data from Clerk
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

// Custom hook to easily access user data from any component
export function useUserContext() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
}
