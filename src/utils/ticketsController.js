// ticketsController.js
import BaseFirebaseController from "./baseController";
import { USER_ROLES } from "./userController";
import { serverTimestamp, doc, getDoc } from "firebase/firestore";
import { fireStore } from "../firebase";

class TicketsController extends BaseFirebaseController {
  constructor() {
    super("tickets");
    this.editRoles = [
      USER_ROLES.ADMIN,
      USER_ROLES.DIRECTOR,
      USER_ROLES.SR_OPERATIONS_MANAGER,
      USER_ROLES.OPERATIONS_MANAGER,
      USER_ROLES.POD,
    ];
  }

  async getAllTickets(filters = {}) {
    try {
      await this.validateUser();
      const queryConstraints = this.buildQueryConstraints(filters, {
        field: "createdAt",
      });
      return await this.getAllDocs(queryConstraints);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      throw error;
    }
  }

  async getTicketById(ticketId) {
    try {
      await this.validateUser();
      const { doc: ticketDoc } = await this.getDoc(ticketId);
      return { id: ticketDoc.id, ...ticketDoc.data() };
    } catch (error) {
      console.error("Error fetching ticket:", error);
      throw error;
    }
  }

  async createTicket(ticketData) {
    try {
      const user = await this.validateUser();
      return await this.createDoc(ticketData, {
        userId: user.uid,
        status: "open",
        priority: ticketData.priority || "low",
        escalationLevel: 1,
        history: [
          this.createHistoryEntry("created", user, { escalationLevel: 1 }),
        ],
        comments: [],
        assignedTo: null,
      });
    } catch (error) {
      console.error("Error creating ticket:", error);
      throw error;
    }
  }

  async editTicket(ticketId, updatedTicketData) {
    try {
      const user = await this.validateUser(this.editRoles);
      const { data: currentData } = await this.getDoc(ticketId);

      return await this.updateDoc(ticketId, updatedTicketData, {
        history: [
          ...currentData.history,
          this.createHistoryEntry("edited", user, {
            changes: Object.keys(updatedTicketData).join(", "),
          }),
        ],
      });
    } catch (error) {
      console.error("Error editing ticket:", error);
      throw error;
    }
  }

  async closeTicket(ticketId) {
    try {
      const user = await this.validateUser();
      const { data: currentData } = await this.getDoc(ticketId);

      return await this.updateDoc(ticketId, {
        status: "closed",
        closedAt: serverTimestamp(),
        closedBy: this.createUserMetadata(user),
        history: [
          ...currentData.history,
          this.createHistoryEntry("closed", user),
        ],
      });
    } catch (error) {
      console.error("Error closing ticket:", error);
      throw error;
    }
  }

  async escalateTicket(ticketId) {
    try {
      const user = await this.validateUser();
      const { data: currentData } = await this.getDoc(ticketId);

      const currentLevel = currentData.escalationLevel || 1;
      if (currentLevel >= 5) {
        throw new Error("Ticket is already at maximum escalation level");
      }

      return await this.updateDoc(ticketId, {
        escalationLevel: currentLevel + 1,
        priority: currentLevel + 1 >= 4 ? "high" : currentData.priority,
        escalatedAt: serverTimestamp(),
        escalatedBy: this.createUserMetadata(user),
        history: [
          ...currentData.history,
          this.createHistoryEntry("escalated", user, {
            fromLevel: currentLevel,
            toLevel: currentLevel + 1,
          }),
        ],
      });
    } catch (error) {
      console.error("Error escalating ticket:", error);
      throw error;
    }
  }

  async assignTicket(ticketId, assignedUserId) {
    try {
      const user = await this.validateUser(this.editRoles);
      const { data: currentData } = await this.getDoc(ticketId);

      const assignedUserDoc = await getDoc(
        doc(fireStore, "users", assignedUserId)
      );
      if (!assignedUserDoc.exists()) {
        throw new Error("Assigned user not found");
      }
      const assignedUserData = assignedUserDoc.data();

      return await this.updateDoc(ticketId, {
        assignedTo: {
          uid: assignedUserId,
          email: assignedUserData.email,
          name: assignedUserData.name,
          assignedAt: serverTimestamp(),
          assignedBy: this.createUserMetadata(user),
        },
        history: [
          ...currentData.history,
          this.createHistoryEntry("assigned", user, {
            assignedToUser: assignedUserId,
          }),
        ],
      });
    } catch (error) {
      console.error("Error assigning ticket:", error);
      throw error;
    }
  }

  async addTicketComment(ticketId, commentText) {
    try {
      const user = await this.validateUser();
      const { data: currentData } = await this.getDoc(ticketId);

      return await this.updateDoc(ticketId, {
        comments: [
          ...(currentData.comments || []),
          {
            id: `comment_${Date.now()}`,
            text: commentText,
            createdAt: new Date().toISOString(),
            createdBy: this.createUserMetadata(user),
          },
        ],
      });
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
    }
  }
}

// Create singleton instance
const ticketsController = new TicketsController();

// Export individual methods with proper binding
export const getAllTickets = (...args) =>
  ticketsController.getAllTickets.apply(ticketsController, args);
export const getTicketById = (...args) =>
  ticketsController.getTicketById.apply(ticketsController, args);
export const createTicket = (...args) =>
  ticketsController.createTicket.apply(ticketsController, args);
export const editTicket = (...args) =>
  ticketsController.editTicket.apply(ticketsController, args);
export const closeTicket = (...args) =>
  ticketsController.closeTicket.apply(ticketsController, args);
export const escalateTicket = (...args) =>
  ticketsController.escalateTicket.apply(ticketsController, args);
export const deleteTicket = (...args) =>
  ticketsController.deleteDoc.apply(ticketsController, args);
export const assignTicket = (...args) =>
  ticketsController.assignTicket.apply(ticketsController, args);
export const addTicketComment = (...args) =>
  ticketsController.addTicketComment.apply(ticketsController, args);

export default ticketsController;
