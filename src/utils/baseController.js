// baseController.js
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { fireStore } from "../firebase";
import { getCurrentUser } from "./authController";

class BaseFirebaseController {
  constructor(collectionName) {
    this.collectionName = collectionName;
    this.baseQuery = [];
  }

  // Authentication and Authorization
  async validateUser(requiredRoles = []) {
    const user = await getCurrentUser();
    if (!user) throw new Error("User not authenticated");
    if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
      throw new Error("Insufficient permissions");
    }
    return user;
  }

  // Document Operations
  async getDoc(docId) {
    const docRef = doc(fireStore, this.collectionName, docId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) throw new Error("Document not found");
    return { doc: docSnap, ref: docRef, data: docSnap.data() };
  }

  async getAllDocs(queryConstraints = []) {
    const collectionRef = collection(fireStore, this.collectionName);
    const q = query(collectionRef, ...this.baseQuery, ...queryConstraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  async createDoc(data, additionalMetadata = {}) {
    const user = await this.validateUser();
    const timestamp = serverTimestamp();

    const docData = {
      ...data,
      ...additionalMetadata,
      createdAt: timestamp,
      updatedAt: timestamp,
      createdBy: this.createUserMetadata(user),
    };

    const docRef = await addDoc(
      collection(fireStore, this.collectionName),
      docData
    );
    return docRef.id;
  }

  async updateDoc(docId, data, additionalMetadata = {}) {
    const user = await this.validateUser();
    const { ref: docRef } = await this.getDoc(docId);

    const updateData = {
      ...data,
      ...additionalMetadata,
      updatedAt: serverTimestamp(),
      updatedBy: this.createUserMetadata(user),
    };

    await updateDoc(docRef, updateData);
    return true;
  }

  async deleteDoc(docId, softDelete = true) {
    const user = await this.validateUser();
    const { ref: docRef } = await this.getDoc(docId);

    if (softDelete) {
      await updateDoc(docRef, {
        status: "deleted",
        deletedAt: serverTimestamp(),
        deletedBy: this.createUserMetadata(user),
      });
    } else {
      await deleteDoc(docRef);
    }
    return true;
  }

  // Utility Methods
  createUserMetadata(user) {
    return {
      uid: user.uid,
      email: user.email,
      name: user.name || user.email.split("@")[0],
      role: user.role,
    };
  }

  createHistoryEntry(action, user, additionalData = {}) {
    return {
      action,
      timestamp: new Date().toISOString(),
      user: user.email,
      ...additionalData,
    };
  }

  buildQueryConstraints(filters, defaultSort = null) {
    const constraints = [];
    Object.entries(filters).forEach(([field, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        constraints.push(where(field, "==", value));
      }
    });
    if (defaultSort) {
      constraints.push(
        orderBy(defaultSort.field, defaultSort.direction || "desc")
      );
    }
    return constraints;
  }
}

export default BaseFirebaseController;
