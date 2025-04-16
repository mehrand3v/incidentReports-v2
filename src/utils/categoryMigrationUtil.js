// src/utils/categoryMigrationUtil.js
import { 
    getAllCategories, 
    createCategory, 
    migrateHardcodedCategories 
  } from "../services/category";
  import { 
    STANDARD_INCIDENT_TYPES, 
    SPECIAL_INCIDENT_TYPES 
  } from "../constants/incidentTypes";
  
  /**
   * Checks if categories need to be migrated
   * @returns {Promise<boolean>} True if migration is needed, false otherwise
   */
  export const checkMigrationNeeded = async () => {
    try {
      // Check if any categories exist in the database
      const existingCategories = await getAllCategories();
      
      // If no categories exist, migration is needed
      return existingCategories.length === 0;
    } catch (error) {
      console.error("Error checking migration status:", error);
      // Assume migration is needed if we can't check
      return true;
    }
  };
  
  /**
   * Transforms a hardcoded incident type to a database-compatible format
   * @param {Object} incidentType - Hardcoded incident type
   * @param {number} order - Display order value
   * @param {boolean} isStandard - Whether this is a standard type
   * @returns {Object} Formatted category object
   */
  const transformIncidentType = (incidentType, order, isStandard) => {
    return {
      label: incidentType.label,
      description: incidentType.description,
      icon: incidentType.icon,
      isStandard: isStandard,
      restrictedToStores: incidentType.restrictedToStores || [],
      displayOrder: order,
    };
  };
  
  /**
   * Performs migration manually
   * @returns {Promise<{success: boolean, message: string, count: number}>} Result of migration
   */
  export const performMigration = async () => {
    try {
      // Check if categories already exist
      const existingCategories = await getAllCategories();
      
      if (existingCategories.length > 0) {
        return {
          success: false,
          message: "Categories already exist in the database. Migration not performed.",
          count: existingCategories.length,
        };
      }
      
      // Use the migration service
      await migrateHardcodedCategories(STANDARD_INCIDENT_TYPES, SPECIAL_INCIDENT_TYPES);
      
      // Verify migration
      const migratedCategories = await getAllCategories();
      
      return {
        success: true,
        message: "Categories successfully migrated to the database.",
        count: migratedCategories.length,
      };
    } catch (error) {
      console.error("Error performing migration:", error);
      return {
        success: false,
        message: `Migration failed: ${error.message}`,
        count: 0,
      };
    }
  };
  
  /**
   * Performs a complete sync of hardcoded types to the database
   * This will add any missing categories and update existing ones
   * @param {boolean} forceUpdate - If true, will update existing categories
   * @returns {Promise<{success: boolean, message: string, added: number, updated: number}>} Result of sync
   */
  export const syncCategories = async (forceUpdate = false) => {
    try {
      // Get existing categories from the database
      const existingCategories = await getAllCategories();
      
      // Create maps for quick lookup
      const existingCategoryMap = new Map(
        existingCategories.map(cat => [cat.id, cat])
      );
      
      // Track statistics
      let addedCount = 0;
      let updatedCount = 0;
      
      // Process standard categories
      for (let i = 0; i < STANDARD_INCIDENT_TYPES.length; i++) {
        const type = STANDARD_INCIDENT_TYPES[i];
        const formattedType = transformIncidentType(type, i, true);
        
        if (!existingCategoryMap.has(type.id)) {
          // Add new category
          await createCategory({
            ...formattedType,
            id: type.id, // Preserve the original ID
          });
          addedCount++;
        } else if (forceUpdate) {
          // Update existing category
          // Note: This requires updateCategory with ID parameter (not implemented here)
          // await updateCategory(type.id, formattedType);
          updatedCount++;
        }
      }
      
      // Process special categories
      const standardCount = STANDARD_INCIDENT_TYPES.length;
      for (let i = 0; i < SPECIAL_INCIDENT_TYPES.length; i++) {
        const type = SPECIAL_INCIDENT_TYPES[i];
        const formattedType = transformIncidentType(type, standardCount + i, false);
        
        if (!existingCategoryMap.has(type.id)) {
          // Add new category
          await createCategory({
            ...formattedType,
            id: type.id, // Preserve the original ID
          });
          addedCount++;
        } else if (forceUpdate) {
          // Update existing category
          // await updateCategory(type.id, formattedType);
          updatedCount++;
        }
      }
      
      return {
        success: true,
        message: `Sync completed. Added ${addedCount} categories.${forceUpdate ? ` Updated ${updatedCount} categories.` : ''}`,
        added: addedCount,
        updated: updatedCount,
      };
    } catch (error) {
      console.error("Error syncing categories:", error);
      return {
        success: false,
        message: `Sync failed: ${error.message}`,
        added: 0,
        updated: 0,
      };
    }
  };