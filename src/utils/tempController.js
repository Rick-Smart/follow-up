import { updateDoc, doc } from "firebase/firestore";
import { fireStore } from "../firebase";
import { USER_ROLES } from "./controller";

// Temporary function to update user role to admin
export const makeAdmin = async (userId) => {
  try {
    const userRef = doc(fireStore, "users", userId);
    await updateDoc(userRef, { role: USER_ROLES.ADMIN });
    localStorage.setItem("userRole", USER_ROLES.ADMIN);
    return true;
  } catch (error) {
    console.error("Error making user admin:", error);
    throw error;
  }
};
