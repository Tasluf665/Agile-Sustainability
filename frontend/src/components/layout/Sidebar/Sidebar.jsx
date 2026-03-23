import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../store/slices/authSlice';
import { LayoutDashboard, Briefcase, Settings, ChevronDown, ChevronRight, User, LogOut } from 'lucide-react';
import leafIcon from '../../../assets/icons/leaf.svg';
import styles from './Sidebar.module.css';

const Sidebar = ({ projects = [] }) => {
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.topSection}>
        <Link to="/projects" className={styles.logoContainer}>
          <div className={styles.logoCircle}>
            <img src={leafIcon} alt="GreenStory" />
          </div>
          <span className={styles.logoText}>GreenStory</span>
        </Link>
      </div>

      <nav className={styles.nav}>
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <div className={styles.navGroup}>
          <button 
            className={`${styles.navItem} ${styles.expandable}`}
            onClick={() => setIsProjectsExpanded(!isProjectsExpanded)}
          >
            <div className={styles.navItemLeft}>
              <Briefcase size={20} />
              <span>Projects</span>
            </div>
            {isProjectsExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          
          {isProjectsExpanded && (
            <div className={styles.subItems}>
              {projects.map(project => (
                <NavLink 
                  key={project.id}
                  to={`/projects/${project.id}`}
                  className={({ isActive }) => `${styles.subItem} ${isActive ? styles.subActive : ''}`}
                >
                  {project.name}
                </NavLink>
              ))}
            </div>
          )}
        </div>

        <NavLink 
          to="/settings" 
          className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
        >
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
      </nav>

      <div className={styles.profileSection}>
        <div className={styles.profileMain}>
          <div className={styles.avatar}>
            <User size={24} color="#1C5F20" />
          </div>
          <div className={styles.profileInfo}>
            <p className={styles.profileName}>{user?.name || 'Admin User'}</p>
            <p className={styles.profileRole}>{user?.role || 'Sustainability Lead'}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout} 
          className={styles.logoutButton}
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
