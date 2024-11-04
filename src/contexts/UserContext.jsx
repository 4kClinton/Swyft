// src/contexts/UserContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../Utils/supabaseClient";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError) {
        console.error("Error fetching user data:", userError.message);
        return;
      }

      if (userData?.user) {
        const { data: profile, error: profileError } = await supabase
          .from("Profiles") // Corrected table name to "Profiles"
          .select("name")
          .eq("id", userData.user.id)
          .single();

        if (profileError) {
          console.error("Error fetching user profile:", profileError.message);
          return;
        }

        setUser({ ...userData.user, name: profile?.name });
      }
    };

    fetchUserProfile();

    // Set up a listener to update user data when authentication state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const { data: profile, error: profileError } = await supabase
            .from("Profiles") // Corrected table name to "Profiles"
            .select("name")
            .eq("id", session.user.id)
            .single();

          if (profileError) {
            console.error(
              "Error fetching updated user profile:",
              profileError.message
            );
            setUser(null);
            return;
          }

          setUser({ ...session.user, name: profile?.name });
        } else {
          setUser(null);
        }
      }
    );

    // Ensure authListener has an unsubscribe method before calling it
    return () => {
      if (authListener?.unsubscribe) {
        authListener.unsubscribe();
      }
    };
  }, []);

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
};
