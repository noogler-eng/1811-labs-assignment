import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export const useUser = () => {
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);
  return user;
};
