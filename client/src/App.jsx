import React from "react";
import LoginSignUp from "./pages/LoginSignUp";
import Cources from "./pages/student/Cources";
import HeroSection from "./pages/student/HeroSection";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import MyLearning from "./pages/student/MyLearning";
import Profile from "./pages/student/Profile";
import Sidebar from "./pages/admin/Sidebar";
import Dashboard from "./pages/admin/Dashboard";
import AddCourse from "./pages/admin/course/AddCourse";
import CourseTable from "./pages/admin/course/CourseTable";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: (
          <>
            <HeroSection />
            <Cources />
          </>
        ),
      },
      {
        path: "/login",
        element: <LoginSignUp />,
      },
      {
        path: "/my-learning",
        element: <MyLearning />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "admin",
        element: <Sidebar />,
        children: [
          {
            path:"dashboard",
            element: <Dashboard />,
          },
          {
            path:"course",
            element: <CourseTable />,
          },
          {
            path:"course/create",
            element:<AddCourse/>
          }
        ]
      },
    ], 
  },
]);
const App = () => {
  return (
    <main>
      <RouterProvider router={appRouter} />
    </main>
  );
};

export default App;
