import { createBrowserRouter } from "react-router-dom";
import { CustomerLayout } from "./components/layout/CustomerLayout";
import { StoreHome } from "./pages/customer/Home";
import { PublicOnlyLayout } from "./components/auth/PublicOnlyLayout";
import { SignIn, SignUp } from "@clerk/react";
import { ProtectedOnlyLayout } from "./components/auth/ProtectedLayout";
import { CustomerProfile } from "./pages/customer/Profile";
import { RoleGuardLayout } from "./components/auth/RoleGuardLayout";
import { AdminLayout } from "./components/layout/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminPromos from "./pages/admin/Promos";
import AdminOrders from "./pages/admin/Orders";
import Adminsettings from "./pages/admin/Settings";

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
            element: <SignIn />,
          },
          {
            path: "sign-up/*",
            element: <SignUp />,
          },
        ],
      },
      {
        element: <ProtectedOnlyLayout />,
        children: [
          {
            path: "profile",
            element: <CustomerProfile />,
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
