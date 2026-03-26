import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword } from '../../store/slices/authSlice';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import PasswordStrengthBar from '../../components/common/PasswordStrengthBar/PasswordStrengthBar';
import PublicHeader from '../../components/layout/PublicHeader/PublicHeader';
import PublicFooter from '../../components/layout/PublicFooter/PublicFooter';
import styles from './ResetPassword.module.css';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess] = useState(false);
  
  const { loading, error } = useSelector((state) => state.auth);

  const validate = () => {
    const errors = {};
    if (!password) errors.password = 'Password is required';
    else if (password.length < 6) errors.password = 'Password must be at least 6 characters';
    
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        await dispatch(resetPassword({ token, password })).unwrap();
        setSuccess(true);
      } catch (err) {
        // Error handled by Redux
      }
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <PublicHeader />
      <main className={styles.mainContent}>
        <div className={styles.card}>
          {success ? (
            <div className={styles.successContent}>
              <CheckCircle className={styles.successIcon} size={48} />
              <h1 className={styles.title}>Password Reset</h1>
              <p className={styles.text}>
                Your password has been reset successfully. You can now log in with your new password.
              </p>
              <Link to="/login" className={styles.actionButton}>
                Go to Login
              </Link>
            </div>
          ) : (
            <>
              <h1 className={styles.title}>Set New Password</h1>
              <p className={styles.text}>
                Please enter a new password for your account.
              </p>

              <form onSubmit={handleSubmit} className={styles.form}>
                <Input
                  label="New Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={formErrors.password}
                  suffix={
                    <div onClick={() => setShowPassword(!showPassword)} className="cursor-pointer">
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </div>
                  }
                />
                <PasswordStrengthBar password={password} />

                <Input
                  label="Confirm New Password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={formErrors.confirmPassword || error}
                />

                <Button type="submit" fullWidth isLoading={loading}>
                  Reset Password
                </Button>
              </form>
            </>
          )}
        </div>
      </main>
      <PublicFooter />
    </div>
  );
};

export default ResetPassword;
