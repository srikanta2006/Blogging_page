// src/components/Navbar.jsx

import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useClickOutside } from '../hooks/useClickOutside';
import NotificationPanel from './NotificationPanel';
import styles from './Navbar.module.css';
import { User, Edit3, LogOut, Menu, X } from 'lucide-react';

function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef();

  useClickOutside(dropdownRef, () => setIsDropdownOpen(false));

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Left Section - App Name */}
          <div className={styles.leftSection}>
            <Link to="/" className={styles.logo}>Burst</Link>
          </div>

          {/* Right Section - Horizontal Layout */}
          <div className={styles.rightSection}>
            {currentUser ? (
              <>
                {/* Desktop Menu Items - Horizontal */}
                <Link to="/create-post" className={styles.button}>Create Post</Link>
                <NotificationPanel />
                <div className={styles.profileMenu} ref={dropdownRef}>
                  <button 
                    onClick={() => navigate(`/profile/${currentUser.uid}`)} 
                    className={styles.avatarButton}
                  >
                    <img 
                      src={currentUser.photoURL || `https://i.pravatar.cc/40?u=${currentUser.uid}`} 
                      alt="User Avatar"
                      className={styles.avatar}
                    />
                  </button>
                </div>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                  className={styles.hamburgerButton}
                >
                  {isDropdownOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Dropdown Menu */}
                <div className={`${styles.dropdown} ${isDropdownOpen ? styles.open : ''}`} ref={dropdownRef}>
                  <div className={styles.dropdownHeader}>
                    <p className={styles.dropdownUsername}>{currentUser.displayName}</p>
                    <p className={styles.dropdownEmail}>{currentUser.email}</p>
                  </div>
                  <div className={styles.dropdownMenu}>
                    <Link to="/" className={styles.dropdownLink} onClick={() => setIsDropdownOpen(false)}>Home</Link>
                    <Link to="/dashboard" className={styles.dropdownLink} onClick={() => setIsDropdownOpen(false)}>Dashboard</Link>
                    <Link to="/reading-list" className={styles.dropdownLink} onClick={() => setIsDropdownOpen(false)}>Reading List</Link>
                    <hr className="my-1 border-gray-200" />
                    <button onClick={handleLogout} className={`${styles.dropdownButton} ${styles.logoutButton}`}>
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className={styles.link}>Login</Link>
                <Link to="/signup" className={styles.button}>Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;