import React from 'react';
import styles from './StepProgressBar.module.css';

const StepProgressBar = ({ currentStep, steps }) => {
  return (
    <div className={styles.progressBarWrapper}>
      <div className={styles.progressContainer}>
        {steps.map((step) => {
          const isActive = currentStep === step.id;
          
          return (
            <div 
              key={step.id} 
              className={`${styles.stepItem} ${isActive ? styles.highlightedStep : ''}`}
            >
              <span className={`${styles.stepNumber} ${isActive ? styles.stepNumberActive : ''}`}>
                STEP {step.id}
              </span>
              <span className={`${styles.stepLabel} ${isActive ? styles.stepLabelActive : ''}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepProgressBar;
