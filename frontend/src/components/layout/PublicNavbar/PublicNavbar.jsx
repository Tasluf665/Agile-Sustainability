import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './PublicNavbar.module.css';

const PublicNavbar = () => {
  const navigate = useNavigate();

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <div className={styles.logoContainer}>
          <Link to="/" className={styles.logo}>GreenStory</Link>
        </div>
        
        <div className={styles.menuLinks}>
          <Link to="/mission" className={styles.navLink}>Our Mission</Link>
          <Link to="/impact" className={styles.navLink}>Impact</Link>
          <Link to="/archive" className={styles.navLink}>Archive</Link>
        </div>

        <div className={styles.actions}>
          <Link to="/login" className={styles.loginLink}>Log In</Link>
          <button 
            onClick={() => navigate('/register')} 
            className={styles.signUpButton}
          >
            Sign Up
          </button>
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;
