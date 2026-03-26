import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { verifyEmail } from '../../store/slices/authSlice';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import PublicHeader from '../../components/layout/PublicHeader/PublicHeader';
import PublicFooter from '../../components/layout/PublicFooter/PublicFooter';
import styles from './VerifyEmail.module.css';

const VerifyEmail = () => {
  const { token } = useParams();
  const dispatch = useDispatch();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');

  const hasAttempted = React.useRef(false);

  useEffect(() => {
    const performVerification = async () => {
      if (hasAttempted.current) return;
      hasAttempted.current = true;
      
      try {
        const result = await dispatch(verifyEmail(token)).unwrap();
        setStatus('success');
        setMessage(result.message || 'Email verified successfully!');
      } catch (err) {
        setStatus('error');
        setMessage(err.message || 'Verification failed. The link may be invalid or expired.');
      }
    };

    if (token) {
      performVerification();
    }
  }, [dispatch, token]);

  return (
    <div className={styles.pageWrapper}>
      <PublicHeader />
      <main className={styles.mainContent}>
        <div className={styles.card}>
          {status === 'loading' && (
            <div className={styles.statusContent}>
              <Loader2 className={styles.spinner} size={48} />
              <h1 className={styles.title}>Verifying your email...</h1>
              <p className={styles.text}>Please wait while we confirm your account.</p>
            </div>
          )}

          {status === 'success' && (
            <div className={styles.statusContent}>
              <CheckCircle className={styles.successIcon} size={48} />
              <h1 className={styles.title}>Email Verified!</h1>
              <p className={styles.text}>{message}</p>
              <Link to="/login" className={styles.actionButton}>
                Go to Login
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className={styles.statusContent}>
              <XCircle className={styles.errorIcon} size={48} />
              <h1 className={styles.title}>Verification Failed</h1>
              <p className={styles.text}>{message}</p>
              <div className={styles.actionGroup}>
                <Link to="/signup" className={styles.actionButton}>
                  Sign Up Again
                </Link>
                <Link to="/login" className={styles.actionButtonOutline}>
                    Back to Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <PublicFooter />
    </div>
  );
};

export default VerifyEmail;
