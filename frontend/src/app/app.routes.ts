import { Routes } from "@angular/router";

import { authGuard } from "./core/guards/auth.guard";
import { adminGuard } from "./core/guards/admin.guard";
import { checkoutGuard } from "./core/guards/checkout.guard";

import { Layout } from "./layout/layout";

import { Home } from "./layout/home/home";
import { Checkout } from "./layout/checkout/checkout";

import { Login } from "./shared/login/login";
import { Signup } from "./shared/singup/singup";

import { Account } from "./layout/account/account";
import { Orders as UserOrders } from "./layout/orders/orders";
import { UserOrderStatus } from "./layout/orders/order-status/order-status";

import { AddressList } from "./layout/address/address-list/address-list";
import { AddressForm } from "./layout/address/address-form/address-form";

import { ProductDetails } from "./layout/product-details/product-details";
import { CategoryProducts } from "./layout/category-products/category-products";

import { TestimonialForm } from "./layout/testimonials/testimonial-form/testimonial-form";

import { Refund } from "./layout/refund/refund";

import { RefundList } from "./layout/refund/refund-list/refund-list";

import { RefundForm } from "./layout/refund/refund-form/refund-form";

import { Dashboard } from "./dashboard/dashboard";
import { DashboardHome } from "./dashboard/home/home";

import { Homepage } from "./dashboard/myWebsite/homepage/homepage";

import { Hero } from "./dashboard/myWebsite/hero/hero";

import { HeroForm } from "./dashboard/myWebsite/hero/hero-form/hero-form";

import { Promo } from "./dashboard/myWebsite/promo/promo";

import { PromoForm } from "./dashboard/myWebsite/promo/promo-form/promo-form";

import { About } from "./dashboard/myWebsite/about/about";

import { AboutForm } from "./dashboard/myWebsite/about/about-form/about-form";

import { Footer } from "./dashboard/myWebsite/footer/footer";

import { CategoryList } from "./dashboard/categories/category-list/category-list";

import { CategoryForm } from "./dashboard/categories/category-form/category-form";

import { CategoryDetails } from "./dashboard/categories/categorty-details/categorty-details";

import { SubcategoryList } from "./dashboard/categories/subcategory/subcategory-list/subcategory-list";

import { SubcategoryForm } from "./dashboard/categories/subcategory/subcategory-form/subcategory-form";

import { Products } from "./dashboard/products/products";

import { ProductForm } from "./dashboard/products/product-form/product-form";

import { ProductDetails as DashboardProductDetails } from "./dashboard/products/product-details/product-details";

import { Orders } from "./dashboard/orders/orders";

import { OrderDetails } from "./dashboard/orders/order-details/order-details";

import { Users } from "./dashboard/users/users";

import { UserDetails } from "./dashboard/users/user-details/user-details";

import { Testimonials } from "./dashboard/testimonials/testimonials";

import { TestimonialDetails } from "./dashboard/testimonials/testimonial-details/testimonial-details";

import { Messages } from "./dashboard/messages/messages";

import { Reports } from "./dashboard/reports/reports";

import { Shipping } from "./dashboard/shipping/shipping";

import { Refunds } from "./dashboard/refunds/refunds";

import { RefundDetails } from "./dashboard/refunds/refund-details/refund-details";
import { UserList } from "./dashboard/users/user-list/user-list";
import { NotFound } from "./shared/not-found/not-found";
import { Cart } from "./layout/cart/cart";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },

  {
    path: "",
    component: Layout,

    children: [
      {
        path: "home",
        component: Home,
      },

      {
        path: "login",
        component: Login,
      },

      {
        path: "signup",
        component: Signup,
      },

      {
        path: "orders",
        component: UserOrders,
        canActivate: [authGuard],
      },

      {
        path: "orders/:id",
        component: UserOrderStatus,
        canActivate: [authGuard],
      },

      {
        path: "account",
        component: Account,
        canActivate: [authGuard],
      },

      {
        path: "testimonials/write",
        component: TestimonialForm,
        canActivate: [authGuard],
      },

      {
        path: "refund",
        component: Refund,

        canActivate: [authGuard],

        children: [
          {
            path: "",
            component: RefundList,
          },

          {
            path: "request",
            component: RefundForm,
          },
        ],
      },

      {
        path: "product/:slug",
        component: ProductDetails,
      },

      {
        path: "cart",
        component: Cart,
      },

      {
        path: "category/:slug",
        component: CategoryProducts,
      },

      {
        path: "checkout",
        component: Checkout,
        canActivate: [checkoutGuard],
      },

      {
        path: "addresses",

        canActivate: [authGuard],

        children: [
          {
            path: "",
            component: AddressList,
          },

          {
            path: "add",
            component: AddressForm,
          },

          {
            path: ":addressId/edit",
            component: AddressForm,
          },
        ],
      },
    ],
  },

  {
    path: "dashboard",

    component: Dashboard,

    canActivate: [authGuard, adminGuard],

    children: [
      {
        path: "",
        component: DashboardHome,
      },

      {
        path: "myWebsite",
        component: Homepage,
      },

      {
        path: "myWebsite/hero",
        component: Hero,
      },

      {
        path: "myWebsite/hero/add",
        component: HeroForm,
      },

      {
        path: "myWebsite/hero/:id/edit",
        component: HeroForm,
      },

      {
        path: "myWebsite/promo",
        component: Promo,
      },

      {
        path: "myWebsite/promo/edit",
        component: PromoForm,
      },

      {
        path: "myWebsite/about",
        component: About,
      },

      {
        path: "myWebsite/about/add",
        component: AboutForm,
      },

      {
        path: "myWebsite/about/:id/edit",
        component: AboutForm,
      },

      {
        path: "myWebsite/footer",
        component: Footer,
      },

      {
        path: "categories",
        component: CategoryList,
      },

      {
        path: "categories/add",
        component: CategoryForm,
      },

      {
        path: "categories/:id/edit",
        component: CategoryForm,
      },

      {
        path: "categories/:id",
        component: CategoryDetails,
      },

      {
        path: "subcategories",
        component: SubcategoryList,
      },

      {
        path: "subcategories/add",
        component: SubcategoryForm,
      },

      {
        path: "subcategories/:id/edit",
        component: SubcategoryForm,
      },

      {
        path: "products",
        component: Products,
      },

      {
        path: "products/add",
        component: ProductForm,
      },

      {
        path: "products/:id/edit",
        component: ProductForm,
      },

      {
        path: "products/:id",
        component: DashboardProductDetails,
      },

      {
        path: "orders",
        component: Orders,
      },

      {
        path: "orders/:id",
        component: OrderDetails,
      },

      {
        path: "users",
        component: UserList,
      },

      {
        path: "users/:id",
        component: UserDetails,
      },

      {
        path: "testimonials",
        component: Testimonials,
      },

      {
        path: "testimonials/:id",
        component: TestimonialDetails,
      },

      {
        path: "messages",
        component: Messages,
      },

      {
        path: "reports",
        component: Reports,
      },

      {
        path: "shipping",
        component: Shipping,
      },

      {
        path: "refunds",
        component: Refunds,
      },

      {
        path: "refunds/:id",
        component: RefundDetails,
      },
    ],
  },

  {
    path: "not-found",
    component: NotFound,
  },

  {
    path: "**",
    redirectTo: "not-found",
  },
];
