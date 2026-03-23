import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { forgotPassword } from '../../store/slices/authSlice';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';
import StepDots from '../../components/common/StepDots/StepDots';
import PublicHeader from '../../components/layout/PublicHeader/PublicHeader';
import PublicFooter from '../../components/layout/PublicFooter/PublicFooter';
import styles from './ForgotPassword.module.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [formError, setFormError] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const validate = () => {
    if (!email) {
      setFormError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setFormError('Please enter a valid email address');
      return false;
    }
    setFormError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      const resultAction = await dispatch(forgotPassword(email));
      if (forgotPassword.fulfilled.match(resultAction)) {
        setIsEmailSent(true);
      }
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <PublicHeader />
      
      <main className={styles.mainContent}>
        <div className={styles.cardContainer}>
          <div className={styles.forgotCard}>
            <div className={styles.gradientBorder} />
            
            {!isEmailSent ? (
              <div className={styles.cardContent}>
                <h1 className={styles.title}>Reset your password</h1>
                <p className={styles.subtitle}>
                  Enter your email address to receive a link to reset your password.
                </p>

                <form onSubmit={handleSubmit} className={styles.form}>
                  <Input
                    label="Email Address"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={formError || error}
                    prefixIcon={<Mail size={18} />}
                  />

                  <Button type="submit" fullWidth isLoading={loading}>
                    Send Reset Link
                  </Button>
                </form>

                <div className={styles.backToLogin}>
                  <button 
                    onClick={() => navigate('/login')} 
                    className={styles.backLink}
                  >
                    <ArrowLeft size={16} />
                    Back to Login
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.cardContent}>
                <div className={styles.successIcon}>
                  <CheckCircle size={64} color="#1C5F20" />
                </div>
                <h1 className={styles.title}>Check your inbox</h1>
                <p className={styles.subtitle}>
                  We've sent a password reset link to <strong>{email}</strong>. 
                  It should arrive in a few minutes.
                </p>

                <div className={styles.backToLogin}>
                  <button 
                    onClick={() => navigate('/login')} 
                    className={styles.backLink}
                  >
                    <ArrowLeft size={16} />
                    Back to Login
                  </button>
                </div>
              </div>
            )}
          </div>

          <StepDots total={3} current={isEmailSent ? 2 : 1} />
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};

export default ForgotPassword;
