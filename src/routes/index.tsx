import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/login";
import Home from "../pages/dashboard/home";
import Users from "../pages/dashboard/users";
import NotFound from "../pages/notFound";
import Dashboard from "../pages/dashboard";
import PrivateRoute from "./privateRoutes";
import PublicRoute from "./publicRoutes";
import BlogPage from "../pages/dashboard/blog";
import AddNewBlog from "../pages/dashboard/blog/AddNewBlog";
import EditBlog from "../pages/dashboard/blog/EditBlog";
import Demo from "../pages/dashboard/demo";
import PartnerWithUs from "../pages/dashboard/partnerWithUsReport/PartnerWithUs";
import ContactUs from "../pages/dashboard/contactUsReport/ContactUs";
import BookOrderReport from "../pages/dashboard/bookReport/BookOrderReport";
import FailedOrderReport from "../pages/dashboard/bookReport/FailedOrderReport";
import CartPendingOrderReport from "../pages/dashboard/bookReport/CartPendingOrderReport";
import DynamicPages from "../pages/dashboard/dynamic-pages/DynamicPages";
import CreatePage from "../pages/dashboard/dynamic-pages/CreatePage";
import UpdatePage from "../pages/dashboard/dynamic-pages/UpdatePage";
import BlogCommentsManagement from "../pages/dashboard/blog/BlogCommentsManagement";
import PlacementSupport from "../pages/dashboard/placementSupport/PlacementSupport";
import QuickContact from "../pages/dashboard/QuickContactReport/QuickContact";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Login />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Home />} />
          <Route path="user" element={<Users />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="blog/comments" element={<BlogCommentsManagement />} />
          <Route path="add-new-blog" element={<AddNewBlog />} />
          <Route path="edit-blog/:id" element={<EditBlog />} />
          <Route path="demo" element={<Demo />} />
          <Route path="partner-with-us" element={<PartnerWithUs />} />
          <Route path="placement-support" element={<PlacementSupport />} />
          <Route path="contact-us" element={<ContactUs />} />
          <Route path="quick-contact" element={<QuickContact />} />
          <Route path="book-order-report" element={<BookOrderReport />} />
          <Route path="failed-order-report" element={<FailedOrderReport />} />
          <Route path="cart-pending-order-report" element={<CartPendingOrderReport />} />
          <Route path="dynamic-pages" element={<DynamicPages />} />
          <Route path="create/dynamic-page" element={<CreatePage />} />
          <Route path="dynamic-page/edit/:id" element={<UpdatePage />} />
        </Route>
      </Route>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
