"use client";

import { createContext, useContext, ReactNode } from "react";
import { useUser } from "@clerk/nextjs";

// Why UserContext.tsx ?
// create a centralized system for managing user auth state
// avoid prop-drilling (passing user data through prop at every level)
// wrap Clerk auth in our own interface

// setup a React Context system to manage user authentication state throughtout app
// Defines the blueprint shape of data that will be shared through the context
type UserContextType = {
  isLoaded: boolean; // Indicates if user data has finished loading
  userDetails: any; //user data from Clerk
};

// Creates a React Context with undefined as initial value -- UserContext is the context object -- empty container that can hold and pass down data to components
const UserContext = createContext<UserContextType | undefined>(undefined); // set to undefined initally since values will be provided by the UserProvider

// Provider is the React component that wraps parts of the app that need access to user data
// responsible for getting the user data (useUser() from Clerk)
// putting the data in a context container -- & making it available to all child components
export function UserProvider({ children }: { children: ReactNode }) {
  // ^ says : 'expect an object with a property named children that must be of type ReactNode'
  // Uses Clerk's useUser hook to get authentication state and user data
  const { isLoaded, user } = useUser();

  return (
    <UserContext.Provider // put the data in the context container
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
// reciever of the data
export function useUserContext() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
}

/* 
UserContextType 
    - shipping label template - defines the module blueprint
    - architecture blueprint 
UserContext
    - mechanism/system for the blueprint to be implemented and share the data
    - can actually hold and ship the data
UserProvider
    - shipping the physical data - turning on the water - gets the package and applies correct labels - makes sure packages get to the right place
useUserContext
    - reciever of the data - opens the package and uses the data

*/
