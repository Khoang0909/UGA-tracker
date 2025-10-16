'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import styles from '@/styles/Navbar.module.css';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav className={styles.navbar} role="navigation" aria-label="Main navigation">
      <div className={styles.container}>
        <Link href="/" className={styles.logo} onClick={closeMobileMenu}>
          UGA Job Tracker
        </Link>

        <button
          className={styles.mobileMenuButton}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
          aria-expanded={mobileMenuOpen}
        >
          <span className={styles.hamburger}></span>
          <span className={styles.hamburger}></span>
          <span className={styles.hamburger}></span>
        </button>

        <div className={`${styles.navLinks} ${mobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
          <Link
            href="/jobs"
            className={`${styles.navLink} ${isActive('/jobs') ? styles.active : ''}`}
            onClick={closeMobileMenu}
          >
            Jobs
          </Link>

          {isAuthenticated && (
            <Link
              href="/applications"
              className={`${styles.navLink} ${isActive('/applications') ? styles.active : ''}`}
              onClick={closeMobileMenu}
            >
              My Applications
            </Link>
          )}

          <div className={styles.authSection}>
            {isAuthenticated && user ? (
              <>
                <span className={styles.welcomeMessage} aria-label={`Logged in as ${user.username}`}>
                  Welcome, {user.username}
                </span>
                <button onClick={handleLogout} className={styles.logoutButton} aria-label="Log out">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`${styles.navLink} ${isActive('/login') ? styles.active : ''}`}
                  onClick={closeMobileMenu}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className={`${styles.navLink} ${styles.signupLink} ${isActive('/signup') ? styles.active : ''}`}
                  onClick={closeMobileMenu}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
