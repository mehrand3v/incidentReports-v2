// src/services/category.js
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
  import { db } from "./firebase";
  import { logCustomEvent } from "./analytics";
  
  // Collection name for incident categories
  const CATEGORIES_COLLECTION = "incident-categories";
  
  /**
   * Get all incident categories from Firestore
   * @returns {Promise<Array>} Array of category objects
   */
  export const getAllCategories = async () => {
    try {
      // Create a query ordered by displayOrder to ensure consistent ordering
      const q = query(
        collection(db, CATEGORIES_COLLECTION),
        orderBy("displayOrder", "asc")
      );
      
      const querySnapshot = await getDocs(q);
      
      // Format the results
      const categories = [];
      querySnapshot.forEach((doc) => {
        categories.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      
      return categories;
    } catch (error) {
      console.error("Error getting categories:", error);
      throw new Error(`Failed to get incident categories: ${error.message}`);
    }
  };
  
  /**
   * Get a single category by ID
   * @param {string} id - Category ID
   * @returns {Promise<Object|null>} Category object or null if not found
   */
  export const getCategoryById = async (id) => {
    try {
      const docRef = doc(db, CATEGORIES_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        };
      } else {
        return null; // Document not found
      }
    } catch (error) {
      console.error(`Error getting category with ID ${id}:`, error);
      throw new Error(`Failed to get category: ${error.message}`);
    }
  };
  
  /**
   * Create a new incident category
   * @param {Object} categoryData - Category data
   * @returns {Promise<Object>} Object with new category ID
   */
  export const createCategory = async (categoryData) => {
    try {
      // Prepare the data
      const preparedData = {
        ...categoryData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      
      // Add the document to the collection
      const docRef = await addDoc(collection(db, CATEGORIES_COLLECTION), preparedData);
      
      // Log creation event
      logCustomEvent("category_created", { categoryId: docRef.id });
      
      // Return the new document ID
      return {
        id: docRef.id,
      };
    } catch (error) {
      console.error("Error creating category:", error);
      throw new Error(`Failed to create category: ${error.message}`);
    }
  };
  
  /**
   * Update an existing category
   * @param {string} id - Category ID
   * @param {Object} updateData - Category data to update
   * @returns {Promise<boolean>} Success status
   */
  export const updateCategory = async (id, updateData) => {
    try {
      const docRef = doc(db, CATEGORIES_COLLECTION, id);
      
      // Prepare the update data
      const preparedData = {
        ...updateData,
        updatedAt: serverTimestamp(),
      };
      
      // Update the document
      await updateDoc(docRef, preparedData);
      
      // Log update event
      logCustomEvent("category_updated", { categoryId: id });
      
      return true;
    } catch (error) {
      console.error(`Error updating category with ID ${id}:`, error);
      throw new Error(`Failed to update category: ${error.message}`);
    }
  };
  
  /**
   * Delete a category
   * @param {string} id - Category ID
   * @returns {Promise<boolean>} Success status
   */
  export const deleteCategory = async (id) => {
    try {
      const docRef = doc(db, CATEGORIES_COLLECTION, id);
      
      // Delete the document
      await deleteDoc(docRef);
      
      // Log deletion event
      logCustomEvent("category_deleted", { categoryId: id });
      
      return true;
    } catch (error) {
      console.error(`Error deleting category with ID ${id}:`, error);
      throw new Error(`Failed to delete category: ${error.message}`);
    }
  };
  
  /**
   * Get all standard categories (available to all stores)
   * @returns {Promise<Array>} Array of standard category objects
   */
  export const getStandardCategories = async () => {
    try {
      const q = query(
        collection(db, CATEGORIES_COLLECTION),
        where("isStandard", "==", true),
        orderBy("displayOrder", "asc")
      );
      
      const querySnapshot = await getDocs(q);
      
      const categories = [];
      querySnapshot.forEach((doc) => {
        categories.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      
      return categories;
    } catch (error) {
      console.error("Error getting standard categories:", error);
      throw new Error(`Failed to get standard categories: ${error.message}`);
    }
  };
  
  /**
   * Get available categories for a specific store
   * @param {string|number} storeNumber - Store number
   * @returns {Promise<Array>} Array of available category objects
   */
  export const getAvailableCategoriesForStore = async (storeNumber) => {
    try {
      // Convert store number to string for consistent comparison
      const storeNumberStr = String(storeNumber);
      
      // Get all categories
      const categories = await getAllCategories();
      
      // Filter categories: include all standard categories and restricted categories for this store
      return categories.filter(category => 
        category.isStandard || 
        (category.restrictedToStores && category.restrictedToStores.includes(storeNumberStr))
      );
    } catch (error) {
      console.error(`Error getting available categories for store ${storeNumber}:`, error);
      throw new Error(`Failed to get available categories: ${error.message}`);
    }
  };
  
  /**
   * Get the highest displayOrder value to help with ordering new categories
   * @returns {Promise<number>} The highest current displayOrder value + 1
   */
  export const getNextDisplayOrder = async () => {
    try {
      const categories = await getAllCategories();
      
      if (categories.length === 0) {
        return 0; // Start with 0 if no categories exist
      }
      
      // Find the highest displayOrder value
      const maxOrder = Math.max(...categories.map(c => c.displayOrder || 0));
      return maxOrder + 1;
    } catch (error) {
      console.error("Error getting next display order:", error);
      throw new Error(`Failed to get next display order: ${error.message}`);
    }
  };
  
  /**
   * Reorder categories by updating their displayOrder values
   * @param {Array} orderedIds - Array of category IDs in the desired order
   * @returns {Promise<boolean>} Success status
   */
  export const reorderCategories = async (orderedIds) => {
    try {
      // Update each category with its new display order
      const updates = orderedIds.map((id, index) => {
        const docRef = doc(db, CATEGORIES_COLLECTION, id);
        return updateDoc(docRef, { 
          displayOrder: index,
          updatedAt: serverTimestamp()
        });
      });
      
      // Wait for all updates to complete
      await Promise.all(updates);
      
      // Log reorder event
      logCustomEvent("categories_reordered");
      
      return true;
    } catch (error) {
      console.error("Error reordering categories:", error);
      throw new Error(`Failed to reorder categories: ${error.message}`);
    }
  };
  
  /**
   * Migrate hardcoded categories to Firestore
   * This can be used once to initialize the database with existing categories
   * @param {Array} standardCategories - Array of standard categories
   * @param {Array} specialCategories - Array of special (restricted) categories
   * @returns {Promise<boolean>} Success status
   */
  export const migrateHardcodedCategories = async (standardCategories, specialCategories) => {
    try {
      // Check if categories already exist
      const existing = await getAllCategories();
      if (existing.length > 0) {
        console.warn("Categories already exist in the database. Migration skipped.");
        return false;
      }
      
      // Prepare all categories for batch creation
      const allCategories = [
        ...standardCategories.map((cat, index) => ({
          ...cat,
          isStandard: true,
          displayOrder: index,
        })),
        ...specialCategories.map((cat, index) => ({
          ...cat,
          isStandard: false,
          displayOrder: standardCategories.length + index,
        })),
      ];
      
      // Add all categories to Firestore
      const promises = allCategories.map(category => 
        createCategory(category)
      );
      
      await Promise.all(promises);
      
      // Log migration event
      logCustomEvent("categories_migrated", { count: allCategories.length });
      
      return true;
    } catch (error) {
      console.error("Error migrating hardcoded categories:", error);
      throw new Error(`Failed to migrate categories: ${error.message}`);
    }
  };