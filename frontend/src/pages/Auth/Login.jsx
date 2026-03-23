import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { loginUser } from '../../store/slices/authSlice';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';
import leafIcon from '../../assets/icons/leaf.svg';
import PublicHeader from '../../components/layout/PublicHeader/PublicHeader';
import PublicFooter from '../../components/layout/PublicFooter/PublicFooter';
import styles from './Login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/projects');
    }
  }, [isAuthenticated, navigate]);

  const validate = () => {
    const errors = {};
    if (!email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Email is invalid';
    
    if (!password) errors.password = 'Password is required';
    else if (password.length < 6) errors.password = 'Password must be at least 6 characters';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      dispatch(loginUser({ email, password }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.pageWrapper}>
      <PublicHeader />

      <main className={styles.mainContent}>
        <div className={styles.loginCard}>
          <div className={styles.branding}>
            <div className={styles.logoCircle}>
              <img src={leafIcon} alt="GreenStory Logo" />
            </div>
            <h1 className={styles.title}>Welcome Back</h1>
            <p className={styles.subtitle}>Access the sustainability archive</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <Input
              label="Email Address"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={formErrors.email}
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={formErrors.password || error}
              rightElement={
                <Link to="/forgot-password" className={styles.forgotPassword}>
                  Forgot password?
                </Link>
              }
              suffix={
                <div onClick={togglePasswordVisibility} className="cursor-pointer">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </div>
              }
            />

            <Button type="submit" fullWidth isLoading={loading}>
              Sign In
            </Button>
          </form>

          <div className={styles.footer}>
            <p className={styles.signupText}>
              Don't have an account? <Link to="/signup" className={styles.signupLink}>Sign up</Link>
            </p>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};

export default Login;
