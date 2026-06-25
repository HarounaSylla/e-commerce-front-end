import { CategoryDialog } from "@/components/admin/products/category-dialog";
import { ProductDialog } from "@/components/admin/products/product-dialog";
import { ProductsTable } from "@/components/admin/products/products-table";
import { ProductsToolbar } from "@/components/admin/products/products-toolbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminProducts } from "@/features/admin/products/use-admin-products";
import { Car } from "lucide-react";

const pageWrap = "space-y-6 p-6";

const cardClass = "border-border bg-card shadow-sm";

const cardHeaderClass = "space-y-4";

const cardTitleClass = "text-xl";

const cardContentClass = "space-y-4";

function AdminProducts() {
  const {
    search,
    setSearch,
    products,
    categories,
    loading,
    categoryDialogOpen,
    setCategoryDialogOpen,
    productDialogOpen,
    setProductDialogOpen,
    editingProduct,
    setEditingProduct,
    openCreateDialog,
    closeProductDialog,
    refreshAll,
    openEditDialog,
  } = useAdminProducts();

  return (
    <div className={pageWrap}>
      <Card className={cardClass}>
        <CardHeader className={cardHeaderClass}>
          <CardTitle className={cardTitleClass}>Products</CardTitle>
          <ProductsToolbar
            onAddProduct={openCreateDialog}
            onManageCategory={() => setCategoryDialogOpen(true)}
            search={search}
            onSearchChange={setSearch}
          />
        </CardHeader>
        <CardContent className={cardContentClass}>
          <ProductsTable
            products={products}
            onEdit={openEditDialog}
            loading={loading}
          ></ProductsTable>
        </CardContent>
      </Card>
      <CategoryDialog
        open={categoryDialogOpen}
        onOpenChange={setCategoryDialogOpen}
        categories={categories}
        onSave={refreshAll}
      />

      <ProductDialog
        open={productDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeProductDialog();
            return;
          }

          setCategoryDialogOpen(true);
        }}
        categories={categories}
        product={editingProduct}
        onSaved={refreshAll}
      ></ProductDialog>
    </div>
  );
}

export default AdminProducts;
