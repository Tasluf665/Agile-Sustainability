import React, { useRef, useEffect } from 'react';
import { PlusCircle, MinusCircle, X } from 'lucide-react';
import Input from '../Input/Input';
import styles from './MainFlowBuilder.module.css';

const MainFlowBuilder = ({ 
  steps = ['', ''], 
  onChange, 
  onAddStep, 
  onRemoveStep,
  maxSteps = 10,
  placeholders = []
}) => {
  const lastInputRef = useRef(null);

  // Focus the last input when a new step is added
  useEffect(() => {
    if (steps.length > 2 && lastInputRef.current) {
      const inputs = lastInputRef.current.closest('.' + styles.container).querySelectorAll('input');
      const lastInput = inputs[inputs.length - 1];
      if (lastInput) lastInput.focus();
    }
  }, [steps.length]);

  const handleSliceChange = (index, value) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    onChange(newSteps);
  };

  return (
    <div className={styles.container}>
      {steps.map((step, index) => (
        <div key={index} className={styles.stepRow}>
          <div className={styles.numberBadgeWrapper}>
            <div className={styles.numberBadge}>{index + 1}</div>
          </div>
          <div className={styles.inputWrapper}>
            <Input
              placeholder={placeholders[index] || `Step ${index + 1}`}
              value={step}
              onChange={(e) => handleSliceChange(index, e.target.value)}
            />
          </div>
          {steps.length > 1 && (
            <button 
              type="button" 
              className={styles.removeButton} 
              onClick={() => onRemoveStep(index)}
              title="Remove step"
            >
              <X size={18} />
            </button>
          )}
        </div>
      ))}

      {steps.length < maxSteps ? (
        <button 
          type="button" 
          className={styles.addStepButton} 
          onClick={onAddStep}
        >
          <PlusCircle size={16} className={styles.addStepIcon} />
          Add Step
        </button>
      ) : (
        <p className={styles.maxStepsHint}>Maximum 10 steps reached</p>
      )}
    </div>
  );
};

export default MainFlowBuilder;
