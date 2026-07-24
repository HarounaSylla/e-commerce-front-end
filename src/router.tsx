import { createBrowserRouter } from "react-router-dom";
import { CustomerLayout } from "./components/layout/CustomerLayout";
import { StoreHome } from "./pages/customer/Home";
import { PublicOnlyLayout } from "./components/auth/PublicOnlyLayout";
import { SignInPage } from "./pages/auth/sign-in";
import { SignUpPage } from "./pages/auth/sign-up";
import { ProtectedOnlyLayout } from "./components/auth/ProtectedLayout";
import { RoleGuardLayout } from "./components/auth/RoleGuardLayout";
import { AdminLayout } from "./components/layout/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminPromos from "./pages/admin/Promos";
import AdminOrders from "./pages/admin/Orders";
import Adminsettings from "./pages/admin/Settings";
import Collections from "./pages/customer/Collections";
import CollectionsDetails from "./pages/customer/Collections-Details";
import CustomerOrderSuccessPage from "./pages/customer/Order-success";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <CustomerLayout />,
    children: [
      {
        index: true,
        element: <StoreHome />,
      },
      {
        element: <PublicOnlyLayout />,
        children: [
          {
            path: "sign-in/*",
            element: <SignInPage />,
          },
          {
            path: "sign-up/*",
            element: <SignUpPage />,
          },
          {
            path: "collections",
            element: <Collections />,
          },
          {
            path: "collection/:id",
            element: <CollectionsDetails />,
          },
        ],
      },
      {
        element: <ProtectedOnlyLayout />,
        children: [
          {
            path: "order-success",
            element: <CustomerOrderSuccessPage />,
          },
        ],
      },
    ],
  },

  {
    element: <ProtectedOnlyLayout />,
    children: [
      {
        element: <RoleGuardLayout allow={["admin"]} />,
        children: [
          {
            path: "/admin",
            element: <AdminLayout />,

            children: [
              {
                index: true,
                element: <AdminDashboard />,
              },
              {
                path: "products",
                element: <AdminProducts />,
              },
              {
                path: "promos",
                element: <AdminPromos />,
              },
              {
                path: "orders",
                element: <AdminOrders />,
              },
              {
                path: "settings",
                element: <Adminsettings />,
              },
            ],
          },
        ],
      },
    ],
  },
]);
