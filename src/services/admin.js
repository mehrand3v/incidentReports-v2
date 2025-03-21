// src/services/admin.js
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "./firebase";

// Collection name for admin users
const ADMIN_COLLECTION = "admins";

// Admin roles
export const ADMIN_ROLES = {
  STANDARD: "standard",
  SUPER: "super",
};

// Check if a user is an admin
export const isAdmin = async (userId) => {
  try {
    if (!userId) return false;

    const docRef = doc(db, ADMIN_COLLECTION, userId);
    const docSnap = await getDoc(docRef);

    return docSnap.exists();
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};

// Get admin role for a user
export const getAdminRole = async (userId) => {
  try {
    if (!userId) return null;

    const docRef = doc(db, ADMIN_COLLECTION, userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.role || ADMIN_ROLES.STANDARD; // Default to standard if not specified
    }

    return null; // Not an admin
  } catch (error) {
    console.error("Error getting admin role:", error);
    return null;
  }
};

// Check if a user is a super admin
export const isSuperAdmin = async (userId) => {
  try {
    const role = await getAdminRole(userId);
    return role === ADMIN_ROLES.SUPER;
  } catch (error) {
    console.error("Error checking super admin status:", error);
    return false;
  }
};

// Get all admin users
export const getAllAdmins = async () => {
  try {
    const q = query(collection(db, ADMIN_COLLECTION));
    const querySnapshot = await getDocs(q);

    const admins = [];
    querySnapshot.forEach((doc) => {
      admins.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return admins;
  } catch (error) {
    console.error("Error getting all admins:", error);
    throw new Error(`Failed to get admin users: ${error.message}`);
  }
};

// Get admin statistics (counts of incidents by status)
export const getAdminStatistics = async () => {
  try {
    // Query for pending incidents
    const pendingQuery = query(
      collection(db, "incident-reports"),
      where("status", "==", "pending")
    );
    const pendingSnapshot = await getDocs(pendingQuery);

    // Query for completed incidents
    const completedQuery = query(
      collection(db, "incident-reports"),
      where("status", "==", "complete")
    );
    const completedSnapshot = await getDocs(completedQuery);

    // Query for incidents without police report numbers
    const missingPoliceReportQuery = query(
      collection(db, "incident-reports"),
      where("policeReport", "==", "")
    );
    const missingPoliceReportSnapshot = await getDocs(missingPoliceReportQuery);

    return {
      pendingCount: pendingSnapshot.size,
      completedCount: completedSnapshot.size,
      missingPoliceReportCount: missingPoliceReportSnapshot.size,
      totalCount: pendingSnapshot.size + completedSnapshot.size,
    };
  } catch (error) {
    console.error("Error getting admin statistics:", error);
    throw new Error(`Failed to get admin statistics: ${error.message}`);
  }
};

// Function to check if admin setup is required (no admins in system)
export const isAdminSetupRequired = async () => {
  try {
    const admins = await getAllAdmins();
    return admins.length === 0;
  } catch (error) {
    console.error("Error checking if admin setup is required:", error);
    return false;
  }
};
