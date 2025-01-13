// userController.js
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { fireStore } from "../firebase";
import BaseFirebaseController from "./baseController";
import { getCurrentUser } from "./authController";

// User roles
export const USER_ROLES = {
  ADMIN: "admin",
  DIRECTOR: "director",
  SR_OPERATIONS_MANAGER: "sr_operations_manager",
  OPERATIONS_MANAGER: "operations_manager",
  HUMAN_RESOURCES: "human_resources",
  COACH: "coach",
  POD: "pod",
  AGENT: "agent",
};

class UserController extends BaseFirebaseController {
  constructor() {
    super("users");
  }

  // Check if an admin exists
  async checkAdminExists() {
    try {
      const q = query(
        collection(fireStore, "users"),
        where("role", "==", USER_ROLES.ADMIN)
      );
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error("Error checking admin existence:", error);
      throw error;
    }
  }

  // Get all users
  async getAllUsers() {
    try {
      await this.validateUser();
      return await this.getAllDocs();
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }

  // Get user by ID
  async getUserById(userId) {
    try {
      await this.validateUser();
      const { data: userData } = await this.getDoc(userId);
      return { id: userId, ...userData };
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }

  // Set current user
  async setCurrentUser(user, role, updateUser) {
    try {
      const userRef = doc(fireStore, "users", user.uid);
      const userData = {
        uid: user.uid,
        name: user.displayName || user.email.split("@")[0],
        email: user.email,
        role: role,
        isAuthenticated: true,
      };

      await setDoc(userRef, userData);

      // Update context with user data
      updateUser(userData);

      return true;
    } catch (error) {
      console.error("Error setting user:", error);
      throw error;
    }
  }

  // Update user attributes
  async updateUserAttributes(userId, updatedData, updateUser) {
    try {
      const userRef = doc(fireStore, "users", userId);
      await updateDoc(userRef, updatedData);

      // Update context with updated data
      updateUser((prevUser) => ({
        ...prevUser,
        ...updatedData,
      }));

      return true;
    } catch (error) {
      console.error("Error updating user attributes:", error);
      throw error;
    }
  }

  // Delete user
  async deleteUser(userId, updateUser) {
    try {
      await this.updateDoc(userId, { active: false });

      // Update context to reflect user deletion
      updateUser(null);

      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }

  // Get users by role
  async getUsersByRole(role) {
    try {
      const queryConstraints = [where("role", "==", role)];
      return await this.getAllDocs(queryConstraints);
    } catch (error) {
      console.error("Error fetching users by role:", error);
      throw error;
    }
  }
}

// Create singleton instance
const userController = new UserController();

// Export individual methods with proper binding
export const checkAdminExists = (...args) =>
  userController.checkAdminExists.apply(userController, args);
export const getAllUsers = (...args) =>
  userController.getAllUsers.apply(userController, args);
export const getUserById = (...args) =>
  userController.getUserById.apply(userController, args);
export const setCurrentUser = (...args) =>
  userController.setCurrentUser.apply(userController, args);
export const updateUserAttributes = (...args) =>
  userController.updateUserAttributes.apply(userController, args);
export const deleteUser = (...args) =>
  userController.deleteUser.apply(userController, args);
export const getUsersByRole = (...args) =>
  userController.getUsersByRole.apply(userController, args);

export default userController;
