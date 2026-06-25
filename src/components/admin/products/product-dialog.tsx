import type {
  Category,
  Product,
  ProductStatus,
} from "@/features/admin/products/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BRANDS } from "@/features/admin/products/constants";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ColorPicker } from "./color-picker";
import { SizeSelector } from "./size-selector";
import { ImagePicker } from "./image-picker";
import { Button } from "@/components/ui/button";
import { useProductForm } from "@/features/admin/products/use-product-form";

type ProductDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  product: Product | null;
  onSaved: () => Promise<void>;
};

const dialogContentClass = "max-h-[92vh] overflow-y-auto sm:max-w-4xl";

const contentWrapClass = "grid gap-6";

const twoColumnGridClass = "grid gap-4 md:grid-cols-2";

const threeColumnGridClass = "grid gap-4 md:grid-cols-3";

const fieldGroupClass = "space-y-2";

const sectionGridClass = "grid gap-6 md:grid-cols-2";

const statusGroupClass =
  "flex gap-6 rounded-xl border border-border bg-card px-4 py-3";

const statusItemClass = "flex items-center space-x-2";

const actionsRowClass = "flex justify-end gap-3";

export function ProductDialog({
  open,
  onOpenChange,
  categories,
  product,
  onSaved,
}: ProductDialogProps) {
  const {
    form,
    saving,
    isEditMode,
    toggleSize,
    addColor,
    removeColor,
    addFiles,
    submit,
    updateField,
    removeExistingImage,
    changeCoverImage,
  } = useProductForm({
    open,
    onClose: () => onOpenChange(false),
    onSaved,
    product,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={dialogContentClass}>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Update Product" : "Create Product"}
          </DialogTitle>
        </DialogHeader>
        {/* The content area is wrapped in a div with padding to prevent the
        content from touching the edges of the dialog, which improves
        readability and aesthetics. */}
        <div className={contentWrapClass}>
          {/* The main content area is organized into a grid layout. // On //
          smaller screens, it will be a single column, and on medium and larger
          // screens, it will have two columns. // This allows for a responsive
          design that adapts to different screen sizes. */}
          <div className={twoColumnGridClass}>
            {/* the title column */}
            <div className={fieldGroupClass}>
              <Label>Title</Label>
              <Input
                value={form.title}
                onChange={(event) => updateField("title", event.target.value)}
                placeholder="Title"
              ></Input>
            </div>
            {/* the category column */}
            <div className={fieldGroupClass}>
              <Label>Brand</Label>
              <Select
                value={form.brand}
                onValueChange={(val) => updateField("brand", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a brand" />
                </SelectTrigger>
                <SelectContent>
                  {BRANDS.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* the description column */}
          <div className={fieldGroupClass}>
            <Label> Description</Label>
            <Textarea
              value={form.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              rows={5}
              placeholder="Product description"
            ></Textarea>
          </div>

          <div className={twoColumnGridClass}>
            {/* the category column */}
            <div className={fieldGroupClass}>
              <Label> Category</Label>
              <Select
                value={form.category}
                onValueChange={(val) => updateField("category", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className={fieldGroupClass}>
              <Label> Status </Label>
              <RadioGroup
                value={form.status}
                onValueChange={(value) =>
                  updateField("status", value as ProductStatus)
                }
                className={statusGroupClass}
              >
                <div className={statusItemClass}>
                  <RadioGroupItem value="active" id="status-active" />
                  <Label htmlFor="status-active">Active</Label>
                </div>

                <div className={statusItemClass}>
                  <RadioGroupItem value="inactive" id="status-inactive" />
                  <Label htmlFor="status-inactive">Inactive</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className={threeColumnGridClass}>
            <div className={fieldGroupClass}>
              <Label> Price</Label>
              <Input
                value={form.price}
                onChange={(e) => updateField("price", e.target.value)}
                placeholder="Price"
                type="number"
                min="0"
              ></Input>
            </div>

            <div className={fieldGroupClass}>
              <Label> Sale percentage</Label>
              <Input
                value={form.salePercentage}
                onChange={(e) => updateField("salePercentage", e.target.value)}
                placeholder="Sale percentage"
                type="number"
                min="0"
                max="100"
              ></Input>
            </div>

            <div className={fieldGroupClass}>
              <Label> Stock</Label>
              <Input
                value={form.stock}
                onChange={(e) => updateField("stock", e.target.value)}
                placeholder="Stock quantity"
                type="number"
                min="0"
                max="100"
              ></Input>
            </div>
          </div>

          {/* add the color picker component*/}
          <div className={sectionGridClass}>
            <ColorPicker
              colors={form.colors}
              onAdd={addColor}
              onRemove={removeColor}
            />
            <SizeSelector selectedSizes={form.sizes} onToggle={toggleSize} />
          </div>

          <ImagePicker
            existingImages={form.existingImages}
            newFiles={form.newFiles}
            coverImagePublicId={form.coverImagePublicId}
            onFilesAdd={addFiles}
            onExistingRemove={removeExistingImage}
            onCoverImageChange={changeCoverImage}
          />

          <div className={actionsRowClass}>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button disabled={saving} onClick={submit}>
              {saving
                ? "saving..."
                : isEditMode
                  ? "Update Product"
                  : "Create Product"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
