import React from "react";
import LoginSignUp from "./pages/LoginSignUp";
import Navbar from "./components/Navbar";
import HeroSection from "./pages/student/HeroSection";
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MainLayout from "./layout/MainLayout";

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
            {/* Courses */}
          </>
        ),
      },
      {
        path: "/login",
        element: <LoginSignUp />,
      },
    ],
  },
]);
const App = () => {
  return (
    <main>
      <RouterProvider router = {appRouter}/>
    </main>
  );
};

export default App;
