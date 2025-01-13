import { updateDoc, doc, getDoc } from "firebase/firestore";
import { fireStore } from "../firebase";
import { USER_ROLES } from "../utils/userController";

// Make a user an admin
export const makeAdmin = async (userId, updateUser) => {
  try {
    const userDoc = doc(fireStore, "users", userId);
    await updateDoc(userDoc, { role: USER_ROLES.ADMIN });

    // Update context with new role
    updateUser((prevUser) => ({
      ...prevUser,
      role: USER_ROLES.ADMIN,
    }));

    return true;
  } catch (error) {
    console.error("Error making user admin:", error);
    throw error;
  }
};
