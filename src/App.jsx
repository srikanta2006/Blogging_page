// src/App.jsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout'; // Import the new layout

// Page Imports
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import SinglePostPage from './pages/SinglePostPage';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import PostEditor from './pages/PostEditor';
import Dashboard from './pages/Dashboard';
import CategoryPage from './pages/CategoryPage';
import ReadingListPage from './pages/ReadingListPage';
import ProfilePage from './pages/ProfilePage';
import ProfileEditPage from './pages/ProfileEditPage';

function App() {
  return (
    <Routes>
      {/* Public Routes - No Navbar */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      
      {/* Protected Routes - All use the MainLayout with the Navbar */}
      <Route 
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/home" element={<HomePage />} />
        <Route path="/post/:postId" element={<SinglePostPage />} />
        <Route path="/category/:categoryName" element={<CategoryPage />} />
        <Route path="/profile/:userId" element={<ProfilePage />} />
        <Route path="/edit-profile" element={<ProfileEditPage />} />
        <Route path="/edit-post/:postId" element={<PostEditor />} />
        <Route path="/create-post" element={<PostEditor />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reading-list" element={<ReadingListPage />} />
      </Route>
    </Routes>
  );
}

function AppWithRouter() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

export default AppWithRouter;
