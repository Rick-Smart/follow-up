// userManagementController.js
import BaseFirebaseController from "./baseController";
import { query, where } from "firebase/firestore";
import { USER_ROLES } from "./userController";

class UserManagementController extends BaseFirebaseController {
  constructor() {
    super("users");
    this.adminRoles = ["admin", "supervisor"];
  }

  async getAllUsers() {
    try {
      const user = await this.validateUser(this.adminRoles);
      return await this.getAllDocs();
    } catch (error) {
      console.error("Error getting users:", error);
      throw error;
    }
  }

  async getUserById(userId) {
    try {
      const currentUser = await this.validateUser();
      const { data: userData } = await this.getDoc(userId);

      // Only allow admins, supervisors, or the user themselves to view details
      if (
        !this.adminRoles.includes(currentUser.role) &&
        currentUser.uid !== userId
      ) {
        throw new Error("Not authorized to view this user");
      }

      return {
        id: userId,
        ...userData,
      };
    } catch (error) {
      console.error("Error getting user:", error);
      throw error;
    }
  }

  async updateUserAttributes(userId, attributes) {
    try {
      const user = await this.validateUser(this.adminRoles);
      return await this.updateDoc(userId, attributes);
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  async setSupervisor(userId, supervisorId) {
    try {
      const user = await this.validateUser(["admin"]);
      return await this.updateDoc(userId, {
        supervisorId,
      });
    } catch (error) {
      console.error("Error setting supervisor:", error);
      throw error;
    }
  }

  async getUsersByRole(roles) {
    try {
      const user = await this.validateUser(this.adminRoles);

      if (!roles || !Array.isArray(roles) || roles.length === 0) {
        console.error("Invalid roles parameter:", roles);
        return [];
      }

      const queryConstraints = [
        where("role", "in", roles),
        where("active", "==", true),
      ];

      return await this.getAllDocs(queryConstraints);
    } catch (error) {
      console.error("Error getting users by role:", error);
      throw error;
    }
  }

  async getSupervisorHierarchy(userId) {
    try {
      const currentUser = await this.validateUser();

      // Only allow viewing hierarchy if admin, supervisor, or the user themselves
      if (
        !this.adminRoles.includes(currentUser.role) &&
        currentUser.uid !== userId
      ) {
        throw new Error("Not authorized to view hierarchy");
      }

      const hierarchy = [];
      let currentUserId = userId;
      const maxDepth = 10; // Prevent infinite loops
      let depth = 0;

      while (currentUserId && depth < maxDepth) {
        const userData = await this.getUserById(currentUserId);
        if (!userData) break;

        hierarchy.push(userData);
        currentUserId = userData.supervisorId;
        depth++;
      }

      return hierarchy;
    } catch (error) {
      console.error("Error getting supervisor hierarchy:", error);
      throw error;
    }
  }

  async deleteUser(userId) {
    try {
      await this.validateUser(["admin"]);
      return await this.deleteDoc(userId, true); // true for soft delete
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }
}

// Create singleton instance
const userManagementController = new UserManagementController();

// Export individual methods with proper binding
export const getAllUsers = (...args) =>
  userManagementController.getAllUsers.apply(userManagementController, args);
export const getUserById = (...args) =>
  userManagementController.getUserById.apply(userManagementController, args);
export const updateUserAttributes = (...args) =>
  userManagementController.updateUserAttributes.apply(
    userManagementController,
    args
  );
export const setSupervisor = (...args) =>
  userManagementController.setSupervisor.apply(userManagementController, args);
export const getUsersByRole = (...args) =>
  userManagementController.getUsersByRole.apply(userManagementController, args);
export const getSupervisorHierarchy = (...args) =>
  userManagementController.getSupervisorHierarchy.apply(
    userManagementController,
    args
  );
export const deleteUser = (...args) =>
  userManagementController.deleteUser.apply(userManagementController, args);

export default userManagementController;
