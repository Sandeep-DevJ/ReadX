import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Login from './pages/login.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import Signup from './pages/signup.jsx'
import Home from './pages/home.jsx'
import Verify from './pages/verify.jsx'
import VerifyEmail from './pages/VerifyEmail.jsx'
import NavBar from './components/NavBar.jsx'
import { UserProvider } from './context/userContext';
import ProtectedRoute from './components/ProtectedRoute.jsx'
import VerifyOtp from './pages/VerifyOtp.jsx';
import ChangePassword from './pages/ChangePassword.jsx';
import Library from './pages/library.jsx';
import Category from './pages/category.jsx';
import Profile from './pages/profile.jsx';
const router = createBrowserRouter([
  {
    path: "/",
    element: <><Home /></>,
  },
 {
    path: "/library",
    element: <Library />,
  },

   {
    path: "/category",
    element: <Category />,
  },

     {
    path: "/profile",
    element: <Profile />,
  },

  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },

  {
    path: "/signup",
    element: <Signup />,
  },
  
  {
    path: "/verify",
    element: <VerifyEmail />,
  },

    {
    path: "/verify-otp/:email",
    element: <VerifyOtp />,
  },
      {
    path: "/reset-password/:email",
    element: <ChangePassword />,
  },
  
  {
    path: "/verify/:token",
    element: <Verify />,
  }
])

const App = () => {
  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  );
};

export default App
