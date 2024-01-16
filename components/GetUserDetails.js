import { useState, useEffect } from "react";
import { FIREBASE_AUTH } from "../config/FirebaseConfig";

export default function GetUserDetails() {
  const [userEmail, setUserEmail] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      setTimeout(() => {
        const user = FIREBASE_AUTH.currentUser;
        if (user) {
          setUserEmail(user.email);
          setUserRole(user.displayName);
        }
      }, 500);
    };
    fetchUserDetails();
  }, []);
  return { userEmail, userRole };
}
