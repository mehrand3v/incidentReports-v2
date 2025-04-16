// src/components/admin/CategoryManager.jsx
import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Layout,
  Tag,
  Plus,
  Trash2,
  Pencil,
  Save,
  X,
  AlertTriangle,
  MoveVertical,
  Info,
  CheckCircle,
  ShoppingBag,
  AlertCircle,
  Beer,
  Hammer,
  Stethoscope,
  User,
  Shield,
  MoreVertical,
  GripVertical,
  Eye,
  Settings,
  Store,
} from "lucide-react";
import ErrorAlert from "../shared/ErrorAlert";
import LoadingSpinner from "../shared/LoadingSpinner";
import { useNotification } from "../../contexts/NotificationContext";
import { 
  getAllCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory, 
  getNextDisplayOrder,
  reorderCategories,
  migrateHardcodedCategories,
} from "../../services/category";
import { 
  STANDARD_INCIDENT_TYPES, 
  SPECIAL_INCIDENT_TYPES
} from "../../constants/incidentTypes";

// Icon components map
const ICON_COMPONENTS = {
  ShoppingBag: ShoppingBag,
  AlertTriangle: AlertTriangle,
  AlertCircle: AlertCircle,
  Beer: Beer,
  Hammer: Hammer,
  Stethoscope: Stethoscope,
  User: User,
  Shield: Shield,
  Info: Info,
};

// Available icons for selection
const AVAILABLE_ICONS = [
  { id: "ShoppingBag", name: "Shopping Bag" },
  { id: "AlertTriangle", name: "Alert Triangle" },
  { id: "AlertCircle", name: "Alert Circle" },
  { id: "Beer", name: "Beer" },
  { id: "Hammer", name: "Hammer" },
  { id: "Stethoscope", name: "Medical" },
  { id: "User", name: "User" },
  { id: "Shield", name: "Shield" },
  { id: "Info", name: "Info" },
];

/**
 * CategoryManager Component
 * 
 * This component provides a complete interface for super admins to manage incident categories:
 * - View all categories in a sortable list
 * - Create new categories
 * - Edit existing categories
 * - Delete categories
 * - Reorder categories
 * - Manage store restrictions for special categories
 */
const CategoryManager = () => {
  // State
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categoryForm, setCategoryForm] = useState({
    id: "",
    label: "",
    description: "",
    icon: "AlertTriangle",
    isStandard: true,
    restrictedToStores: [],
  });
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("create"); // 'create' or 'edit'
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [storeInput, setStoreInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  const [migrateDialogOpen, setMigrateDialogOpen] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'grid'
  
  // Get notification context
  const notification = useNotification();

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch all categories from the database
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllCategories();
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Reset form state
  const resetForm = () => {
    setCategoryForm({
      id: "",
      label: "",
      description: "",
      icon: "AlertTriangle",
      isStandard: true,
      restrictedToStores: [],
    });
    setStoreInput("");
  };

  // Handle form open for creating a new category
  const handleCreateNew = async () => {
    resetForm();
    
    // Get the next display order value
    try {
      const nextOrder = await getNextDisplayOrder();
      setCategoryForm(prev => ({
        ...prev,
        displayOrder: nextOrder
      }));
    } catch (err) {
      console.error("Error getting next display order:", err);
      // Continue with form open even if we can't get the next order
    }
    
    setFormMode("create");
    setShowForm(true);
  };

  // Handle form open for editing an existing category
  const handleEdit = (category) => {
    setCategoryForm({
      ...category,
      restrictedToStores: category.restrictedToStores || [],
    });
    setFormMode("edit");
    setShowForm(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle switch toggle for standard/restricted
  const handleStandardToggle = (value) => {
    setCategoryForm(prev => ({
      ...prev,
      isStandard: value
    }));
  };

  // Handle icon selection
  const handleIconSelect = (icon) => {
    setCategoryForm(prev => ({
      ...prev,
      icon
    }));
  };

  // Handle adding a store to restricted stores
  const handleAddStore = () => {
    if (!storeInput.trim()) return;
    
    // Check if store is already in the list
    if (categoryForm.restrictedToStores.includes(storeInput.trim())) {
      notification.warning("Store already added to restrictions");
      return;
    }
    
    setCategoryForm(prev => ({
      ...prev,
      restrictedToStores: [...prev.restrictedToStores, storeInput.trim()]
    }));
    setStoreInput("");
  };

  // Handle removing a store from restricted stores
  const handleRemoveStore = (store) => {
    setCategoryForm(prev => ({
      ...prev,
      restrictedToStores: prev.restrictedToStores.filter(s => s !== store)
    }));
  };

  // Handle form submission (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!categoryForm.label.trim()) {
      notification.error("Category name is required");
      return;
    }
    
    if (!categoryForm.description.trim()) {
      notification.error("Description is required");
      return;
    }
    
    if (!categoryForm.isStandard && categoryForm.restrictedToStores.length === 0) {
      notification.error("At least one store must be added for restricted categories");
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    
    try {
      // Prepare data - omit id field for create operation
      const data = {
        label: categoryForm.label.trim(),
        description: categoryForm.description.trim(),
        icon: categoryForm.icon,
        isStandard: categoryForm.isStandard,
        displayOrder: categoryForm.displayOrder || 0,
      };
      
      // Only include restrictedToStores if not a standard category
      if (!categoryForm.isStandard) {
        data.restrictedToStores = categoryForm.restrictedToStores;
      }
      
      if (formMode === "create") {
        // Create new category
        await createCategory(data);
        notification.success("Category created successfully");
      } else {
        // Update existing category
        await updateCategory(categoryForm.id, data);
        notification.success("Category updated successfully");
      }
      
      // Refresh categories list
      await fetchCategories();
      
      // Close form
      setShowForm(false);
      resetForm();
    } catch (err) {
      console.error(`Error ${formMode === "create" ? "creating" : "updating"} category:`, err);
      setError(`Failed to ${formMode === "create" ? "create" : "update"} category. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete confirmation dialog
  const openDeleteDialog = (category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  // Handle delete action
  const handleDelete = async () => {
    if (!categoryToDelete) return;
    
    setIsSubmitting(true);
    
    try {
      await deleteCategory(categoryToDelete.id);
      notification.success("Category deleted successfully");
      
      // Refresh categories list
      await fetchCategories();
    } catch (err) {
      console.error("Error deleting category:", err);
      notification.error("Failed to delete category");
    } finally {
      setIsSubmitting(false);
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  // Handle drag and drop reordering
  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    
    if (sourceIndex === destinationIndex) return;
    
    // Update local state for immediate UI feedback
    const items = Array.from(categories);
    const [removed] = items.splice(sourceIndex, 1);
    items.splice(destinationIndex, 0, removed);
    
    // Update display order in memory
    const reorderedItems = items.map((item, index) => ({
      ...item,
      displayOrder: index
    }));
    
    setCategories(reorderedItems);
    
    // Persist the new order to the database
    try {
      setIsReordering(true);
      await reorderCategories(reorderedItems.map(item => item.id));
      notification.success("Categories reordered successfully");
    } catch (err) {
      console.error("Error reordering categories:", err);
      notification.error("Failed to save category order");
      // Revert to original order
      await fetchCategories();
    } finally {
      setIsReordering(false);
    }
  };

  // Handle migrating hardcoded categories to the database
  const handleMigrate = async () => {
    setIsMigrating(true);
    
    try {
      await migrateHardcodedCategories(STANDARD_INCIDENT_TYPES, SPECIAL_INCIDENT_TYPES);
      notification.success("Categories migrated successfully");
      
      // Refresh categories list
      await fetchCategories();
    } catch (err) {
      console.error("Error migrating categories:", err);
      notification.error("Failed to migrate categories");
    } finally {
      setIsMigrating(false);
      setMigrateDialogOpen(false);
    }
  };

  // Render category icon
  const renderIcon = (iconName) => {
    const IconComponent = ICON_COMPONENTS[iconName] || AlertTriangle;
    return <IconComponent className="h-5 w-5" />;
  };

  // If loading
  if (loading && categories.length === 0) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="large" text="Loading categories..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-lg p-6 shadow-lg border border-slate-700/40">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center">
              <div className="bg-purple-600/20 p-2 rounded-lg mr-3 shadow-inner">
                <Tag className="h-6 w-6 text-purple-400" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
                Incident Categories
              </h1>
            </div>
            <p className="text-gray-400 text-sm sm:text-base max-w-2xl">
              Manage incident categories and their availability to different stores
            </p>
          </div>

          <div className="flex flex-wrap gap-2 w-full lg:w-auto">
            <Button 
              className="bg-slate-800 hover:bg-slate-700 text-white transition-all duration-300 shadow-sm hover:shadow border border-slate-700 hover:border-slate-600"
              variant="outline"
              onClick={() => setViewMode(viewMode === "table" ? "grid" : "table")}
              size="sm"
            >
              <Layout className="h-4 w-4 mr-2 text-blue-400" />
              {viewMode === "table" ? "Grid View" : "Table View"}
            </Button>
            
            <Button
              className="bg-purple-600 hover:bg-purple-500 text-white transition-all duration-300 shadow-sm hover:shadow"
              onClick={handleCreateNew}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <ErrorAlert
          message={error}
          onDismiss={() => setError("")}
          className="mb-4"
        />
      )}

      {/* Categories section */}
      <div>
        {categories.length === 0 ? (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6 pb-6 text-center">
              <div className="mx-auto w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center mb-4">
                <Info className="h-6 w-6 text-slate-400" />
              </div>
              <p className="text-white mb-2">No incident categories found</p>
              <p className="text-gray-400 mb-6">
                Get started by adding a new category or migrating existing ones
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button 
                  className="bg-purple-600 hover:bg-purple-500 text-white"
                  onClick={handleCreateNew}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
                
                <Button 
                  variant="outline"
                  className="border-slate-600 text-gray-300 hover:bg-slate-700 hover:text-white"
                  onClick={() => setMigrateDialogOpen(true)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Migrate Existing
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          viewMode === "table" ? (
            <CategoryTableView 
              categories={categories}
              onEdit={handleEdit}
              onDelete={openDeleteDialog}
              isReordering={isReordering}
              onDragEnd={handleDragEnd}
              renderIcon={renderIcon}
            />
          ) : (
            <CategoryGridView 
              categories={categories}
              onEdit={handleEdit}
              onDelete={openDeleteDialog}
              isReordering={isReordering}
              onDragEnd={handleDragEnd}
              renderIcon={renderIcon}
            />
          )
        )}
      </div>

      {/* Add/Edit Category Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-purple-400">
              {formMode === "create" ? "Add New Category" : "Edit Category"}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {formMode === "create" 
                ? "Create a new incident category" 
                : "Update this incident category"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="label" className="text-gray-300">
                Category Name
              </Label>
              <Input
                id="label"
                name="label"
                value={categoryForm.label}
                onChange={handleInputChange}
                placeholder="e.g., Shoplifting"
                className="bg-slate-700 border-slate-600 text-white focus:border-purple-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-300">
                Description
              </Label>
              <Input
                id="description"
                name="description"
                value={categoryForm.description}
                onChange={handleInputChange}
                placeholder="e.g., Items theft"
                className="bg-slate-700 border-slate-600 text-white focus:border-purple-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon" className="text-gray-300">
                Icon
              </Label>
              <Select 
                value={categoryForm.icon} 
                onValueChange={handleIconSelect}
              >
                <SelectTrigger 
                  id="icon" 
                  className="bg-slate-700 border-slate-600 text-white"
                >
                  <SelectValue placeholder="Select an icon" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600 text-white">
                  {AVAILABLE_ICONS.map(icon => (
                    <SelectItem 
                      key={icon.id} 
                      value={icon.id}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center">
                        {renderIcon(icon.id)}
                        <span className="ml-2">{icon.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <Label htmlFor="isStandard" className="text-gray-300">
                  Standard Category
                </Label>
                <p className="text-gray-500 text-xs">
                  Available to all stores
                </p>
              </div>
              <Switch
                id="isStandard"
                checked={categoryForm.isStandard}
                onCheckedChange={handleStandardToggle}
              />
            </div>

            {/* Restricted stores section - only show if not a standard category */}
            {!categoryForm.isStandard && (
              <div className="space-y-3 pt-2">
                <Label className="text-gray-300">
                  Restricted to Stores
                </Label>
                <p className="text-gray-500 text-xs">
                  Only these stores will see this category
                </p>
                
                <div className="flex gap-2">
                  <Input
                    value={storeInput}
                    onChange={(e) => setStoreInput(e.target.value)}
                    placeholder="Enter store number"
                    className="bg-slate-700 border-slate-600 text-white focus:border-purple-500"
                  />
                  <Button 
                    type="button"
                    variant="outline"
                    className="border-slate-600 text-gray-300 hover:bg-slate-700 hover:text-white"
                    onClick={handleAddStore}
                  >
                    Add
                  </Button>
                </div>

                {/* Display list of restricted stores */}
                {categoryForm.restrictedToStores.length > 0 ? (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {categoryForm.restrictedToStores.map(store => (
                      <div 
                        key={store}
                        className="bg-slate-700 text-white px-2 py-1 rounded-md flex items-center gap-1"
                      >
                        <Store className="h-3 w-3 text-purple-400" />
                        <span>{store}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveStore(store)}
                          className="text-gray-400 hover:text-white ml-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-amber-400 text-xs flex items-center pt-2">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    At least one store must be added
                  </p>
                )}
              </div>
            )}
          </form>

          <DialogFooter>
            <Button
              variant="outline"
              className="border-slate-600 text-gray-300 hover:bg-slate-700 hover:text-white"
              onClick={() => setShowForm(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              className="bg-purple-700 hover:bg-purple-600 text-white"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <LoadingSpinner size="small" text="Saving..." />
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {formMode === "create" ? "Create Category" : "Save Changes"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-slate-800 border-slate-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-400">
              Delete Category
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete the category "{categoryToDelete?.label}"? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
              disabled={isSubmitting}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <LoadingSpinner size="small" text="Deleting..." />
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Migrate Categories Dialog */}
      <AlertDialog open={migrateDialogOpen} onOpenChange={setMigrateDialogOpen}>
        <AlertDialogContent className="bg-slate-800 border-slate-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-purple-400">
              Migrate Existing Categories
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This will migrate all hardcoded categories to the database. 
              This should only be done once when setting up the system.
              {categories.length > 0 && (
                <div className="mt-2 text-amber-400 bg-amber-950/30 p-2 rounded-md border border-amber-800/30 flex items-start">
                  <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    Categories already exist in the database. This operation may create duplicates.
                  </span>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
              disabled={isMigrating}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-purple-600 hover:bg-purple-700 text-white"
              onClick={handleMigrate}
              disabled={isMigrating}
            >
              {isMigrating ? (
                <LoadingSpinner size="small" text="Migrating..." />
              ) : (
                "Migrate Categories"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

/**
 * Table view component for categories
 */
const CategoryTableView = ({ categories, onEdit, onDelete, isReordering, onDragEnd, renderIcon }) => {
  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardContent className="p-0 overflow-hidden">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="categories-table" direction="vertical">
            {(provided) => (
              <div 
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <Table>
                  <TableHeader className="bg-slate-900 sticky top-0 z-10">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-10"></TableHead>
                      <TableHead className="w-48">Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-32">Type</TableHead>
                      <TableHead className="w-32">Icon</TableHead>
                      <TableHead className="text-right w-24">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((category, index) => (
                      <Draggable 
                        key={category.id} 
                        draggableId={category.id} 
                        index={index}
                      >
                        {(provided) => (
                          <TableRow
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="border-slate-700 hover:bg-slate-700/40 transition-colors"
                          >
                            <TableCell className="py-2">
                              <div 
                                {...provided.dragHandleProps}
                                className="flex justify-center cursor-move text-gray-500 hover:text-gray-300"
                              >
                                <GripVertical className="h-5 w-5" />
                              </div>
                            </TableCell>
                            <TableCell className="py-2 font-medium text-white">
                              {category.label}
                            </TableCell>
                            <TableCell className="py-2 text-gray-300">
                              {category.description}
                            </TableCell>
                            <TableCell className="py-2">
                              {category.isStandard ? (
                                <span className="px-2 py-1 bg-blue-600/30 text-blue-300 text-xs rounded-full">
                                  Standard
                                </span>
                              ) : (
                                <span className="px-2 py-1 bg-purple-600/30 text-purple-300 text-xs rounded-full">
                                  Restricted
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="py-2">
                              <div className="flex items-center">
                                <div className="p-1 bg-slate-700 rounded">
                                  {renderIcon(category.icon)}
                                </div>
                                <span className="ml-2 text-gray-400 text-xs">
                                  {category.icon}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="py-2 text-right">
                              <div className="flex justify-end space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onEdit(category)}
                                  className="h-8 w-8 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onDelete(category)}
                                  className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/30"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </TableBody>
                </Table>
              </div>
            )}
          </Droppable>
        </DragDropContext>
        
        {isReordering && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center">
            <LoadingSpinner size="large" text="Saving order..." />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

/**
 * Grid view component for categories
 */
const CategoryGridView = ({ categories, onEdit, onDelete, isReordering, onDragEnd, renderIcon }) => {
  return (
    <div className="relative">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="categories-grid" direction="horizontal" type="grid">
          {(provided) => (
            <div 
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {categories.map((category, index) => (
                <Draggable key={category.id} draggableId={category.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <Card className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-all group">
                        <CardHeader className="pb-2 relative">
                          <div 
                            {...provided.dragHandleProps}
                            className="absolute right-2 top-2 p-1 rounded-full hover:bg-slate-700 cursor-move text-gray-500 hover:text-gray-300 transition-colors"
                          >
                            <MoveVertical className="h-4 w-4" />
                          </div>
                          
                          <CardTitle className="text-white flex items-center text-lg">
                            <div className="p-2 bg-slate-700 rounded mr-2 group-hover:bg-slate-600 transition-colors">
                              {renderIcon(category.icon)}
                            </div>
                            {category.label}
                          </CardTitle>
                          <CardDescription className="text-gray-400">
                            {category.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="flex justify-between items-center">
                            <div>
                              {category.isStandard ? (
                                <div className="flex items-center">
                                  <CheckCircle className="h-4 w-4 text-blue-400 mr-1" />
                                  <span className="text-blue-300 text-sm">Standard</span>
                                </div>
                              ) : (
                                <div className="flex items-center">
                                  <Store className="h-4 w-4 text-purple-400 mr-1" />
                                  <span className="text-purple-300 text-sm">
                                    {category.restrictedToStores?.length || 0} stores
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="text-gray-500 text-xs">
                              Order: {category.displayOrder ?? index}
                            </div>
                          </div>
                          
                          {!category.isStandard && category.restrictedToStores?.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {category.restrictedToStores.slice(0, 3).map(store => (
                                <div 
                                  key={store}
                                  className="bg-slate-700 text-xs text-white px-1.5 py-0.5 rounded"
                                >
                                  {store}
                                </div>
                              ))}
                              {category.restrictedToStores.length > 3 && (
                                <div className="bg-slate-700 text-xs text-white px-1.5 py-0.5 rounded">
                                  +{category.restrictedToStores.length - 3} more
                                </div>
                              )}
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="pt-0">
                          <div className="flex justify-end space-x-1 w-full">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onEdit(category)}
                              className="h-8 px-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
                            >
                              <Pencil className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onDelete(category)}
                              className="h-8 px-2 text-red-400 hover:text-red-300 hover:bg-red-900/30"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      
      {isReordering && (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
          <LoadingSpinner size="large" text="Saving order..." />
        </div>
      )}
    </div>
  );
};

export default CategoryManager;