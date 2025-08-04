// src/App.jsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

// Page Imports
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
    <div className="bg-gray-50 min-h-screen font-sans">
      <Navbar />
      <main>
        <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
            <Routes>
              {/* This route is essential for the "Read More" link to work */}
              <Route path="/post/:postId" element={<SinglePostPage />} />

              <Route path="/edit-profile" element={<ProfileEditPage />} />
              <Route path="/edit-post/:postId" element={<PostEditor />} />
              <Route path="/" element={<HomePage />} />
              <Route path="/category/:categoryName" element={<CategoryPage />} />
              <Route path="/profile/:userId" element={<ProfilePage />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              <Route path="/create-post" element={<PostEditor />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/reading-list" element={<ReadingListPage />} />
            </Routes>
        </div>
      </main>
    </div>
  );
}

// This wrapper component provides the router context to the App
function AppWithRouter() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

export default AppWithRouter;
