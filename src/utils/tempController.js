import { updateDoc, doc, getDoc } from "firebase/firestore";
import { fireStore } from "../firebase";
import { USER_ROLES } from "../utils/userController";

// Temporary function to update user role to admin
export const makeAdmin = async (userId) => {
  try {
    if (typeof userId !== "string" || userId.trim() === "") {
      throw new Error("Invalid user ID format");
    }

    const userRef = doc(fireStore, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      throw new Error("User document not found");
    }

    await updateDoc(userRef, { role: USER_ROLES.ADMIN });
    localStorage.setItem("userRole", USER_ROLES.ADMIN);
    return true;
  } catch (error) {
    console.error("Error making user admin:", error);
    throw error;
  }
};
