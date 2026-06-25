import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  createAdminCategory,
  updateAdminCategory,
} from "@/features/admin/products/api";
import type { Category } from "@/features/admin/products/types";
import { create } from "axios";
import { Pencil, Tag } from "lucide-react";
import { useState } from "react";

const dialogContentClass = "sm:max-w-xl";

const contentWrap = "space-y-4";

const formRow = "flex gap-3";

const categoriesList = "space-y-2";

const categoryRow =
  "flex items-center justify-between rounded-xl border border-border bg-card px-3 py-3";

const categoryInfo = "flex items-center gap-2";

const categoryIcon = "h-4 w-4 text-muted-foreground";

const categoryName = "text-sm font-medium text-foreground";

const emptyStateClass =
  "rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground";

const editButtonClass = "h-4 w-4";

type CategoryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  onSave: () => Promise<void>;
};

export function CategoryDialog({
  open,
  onOpenChange,
  categories,
  onSave,
}: CategoryDialogProps) {
  const [name, setName] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!name.trim()) return;

    try {
      setSaving(true);

      if (editingCategory) {
        await updateAdminCategory(editingCategory._id, { name: name.trim() });
      } else {
        await createAdminCategory({ name: name.trim() });
      }
      setName("");
      setEditingCategory(null);
      await onSave();
    } catch (error) {
      console.error("Failed to save category:", error);
    } finally {
      setSaving(false);
    }
  }

  // Handle edit button click - for now it just populates the input with the category name
  function handleEdit(currentCategory: Category) {
    setEditingCategory(currentCategory);
    setName(currentCategory.name);
  }

  // Reset form when dialog is closed
  function handleClose(nextOpen: boolean) {
    if (!nextOpen) {
      setName("");
      setEditingCategory(null);
    }
    onOpenChange(nextOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={dialogContentClass}>
        <DialogHeader>
          <DialogTitle>Manage Categories</DialogTitle>
        </DialogHeader>
        <div className={contentWrap}>
          <div className={formRow}>
            <Input
              placeholder="New category name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <Button disabled={saving || !name.trim()} onClick={handleSave}>
              {editingCategory ? "Update" : "Add"}
            </Button>
          </div>
          <Separator />

          <div className={categoriesList}>
            {categories.map((category) => (
              <div key={category._id} className={categoryRow}>
                <div className={categoryInfo}>
                  <Tag className={categoryIcon} />
                  <span className={categoryName}>{category.name}</span>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(category)}
                >
                  <Pencil className={editButtonClass} />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
