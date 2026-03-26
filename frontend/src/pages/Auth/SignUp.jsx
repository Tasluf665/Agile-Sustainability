import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, resetSignupSuccess } from '../../store/slices/authSlice';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';
import { Eye, EyeOff, Mail, CheckCircle } from 'lucide-react';
import PasswordStrengthBar from '../../components/common/PasswordStrengthBar/PasswordStrengthBar';
import PublicHeader from '../../components/layout/PublicHeader/PublicHeader';
import PublicFooter from '../../components/layout/PublicFooter/PublicFooter';
import leafIcon from '../../assets/icons/leaf.svg';
import styles from './SignUp.module.css';

const SignUp = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, signupSuccess } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/projects');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(resetSignupSuccess());
    };
  }, [dispatch]);

  const validate = () => {
    const errors = {};
    if (!fullName.trim()) errors.fullName = 'Full name is required';
    
    if (!email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Email is invalid';
    
    if (!password) errors.password = 'Password is required';
    else if (password.length < 6) errors.password = 'Password must be at least 6 characters';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      dispatch(registerUser({ fullName, email, password }));
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <PublicHeader />
      
      <main className={styles.mainContent}>
        <div className={styles.blurTop} />
        <div className={styles.blurBottom} />
        
        <div className={styles.signUpCard}>
          {signupSuccess ? (
            <div className={styles.successMessage}>
              <div className={styles.successIconWrapper}>
                <CheckCircle size={48} className={styles.checkIcon} />
              </div>
              <h1 className={styles.title}>Registration Successful!</h1>
              <p className={styles.successText}>
                We've sent a verification email to <strong>{email}</strong>.
              </p>
              <div className={styles.instructionBox}>
                <Mail size={20} className={styles.mailIcon} />
                <span>Please check your inbox and click the verification link to activate your account.</span>
              </div>
              <Link to="/login" className={styles.backToLoginBtn}>
                Back to Login
              </Link>
            </div>
          ) : (
            <>
              <div className={styles.branding}>
                <div className={styles.logoCircle}>
                  <img src={leafIcon} alt="GreenStory Logo" />
                </div>
                <h1 className={styles.title}>Create your account</h1>
                <p className={styles.subtitle}>Join the sustainability archive</p>
              </div>

              <form onSubmit={handleSubmit} className={styles.form}>
                <Input
                  label="Full Name"
                  placeholder="Jane Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  error={formErrors.fullName}
                />

                <Input
                  label="Email Address"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={formErrors.email}
                />

                <div className={styles.passwordSection}>
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={formErrors.password || error}
                    suffix={
                      <div onClick={togglePasswordVisibility} className="cursor-pointer">
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </div>
                    }
                  />
                  <PasswordStrengthBar password={password} />
                </div>

                <Button type="submit" fullWidth isLoading={loading}>
                  Sign Up
                </Button>
              </form>

              <div className={styles.footerLinkSection}>
                <p className={styles.signinText}>
                  Already have an account? <Link to="/login" className={styles.signinLink}>Sign in</Link>
                </p>
              </div>
            </>
          )}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};

export default SignUp;
