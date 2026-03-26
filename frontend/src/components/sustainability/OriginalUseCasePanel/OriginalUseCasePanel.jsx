import React, { useState, useEffect } from 'react';
import { FileText, Edit2, X, Check, Sparkles } from 'lucide-react';
import Button from '../../common/Button/Button';
import Input from '../../common/Input/Input';
import Textarea from '../../common/Textarea/Textarea';
import MainFlowBuilder from '../../common/MainFlowBuilder/MainFlowBuilder';
import styles from './OriginalUseCasePanel.module.css';

const OriginalUseCasePanel = ({
  title,
  actor,
  precondition,
  mainFlow = [],
  postcondition,
  status,
  onUpdate,
  onRegenerate,
  isGenerating
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: title || '',
    actor: actor || '',
    precondition: precondition || '',
    postcondition: postcondition || ''
  });
  const [editedFlow, setEditedFlow] = useState(mainFlow || []);

  useEffect(() => {
    setFormData({
      title: title || '',
      actor: actor || '',
      precondition: precondition || '',
      postcondition: postcondition || ''
    });
    setEditedFlow(mainFlow || []);
  }, [title, actor, precondition, postcondition, mainFlow]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({
      title: title || '',
      actor: actor || '',
      precondition: precondition || '',
      postcondition: postcondition || ''
    });
    setEditedFlow(mainFlow || []);
    setIsEditing(false);
  };

  const handleSave = () => {
    if (onUpdate) {
      onUpdate({
        ...formData,
        mainFlow: editedFlow.filter(step => step && step.trim() !== '')
      });
    }
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className={styles.originalPanel}>
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <FileText size={18} color="#0f172a" />
          <h3 className={styles.headerTitle}>Original Use Case</h3>
        </div>
        {!isEditing && (
          <button className={styles.editIconButton} onClick={handleEdit} title="Edit Use Case">
            <Edit2 size={16} />
          </button>
        )}
      </div>
      
      <div className={styles.content}>
        {isEditing ? (
          <div className={styles.editModeContainer}>
            <Input
              label="USE CASE TITLE"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Standard Video Playback Flow"
              required
            />
            
            <Input
              label="ACTOR"
              name="actor"
              value={formData.actor}
              onChange={handleChange}
              placeholder="e.g., Subscriber"
              required
            />
            
            <Textarea
              label="PRECONDITION"
              name="precondition"
              value={formData.precondition}
              onChange={handleChange}
              placeholder="e.g., User is logged in..."
            />
            
            <MainFlowBuilder 
              steps={editedFlow}
              onChange={setEditedFlow}
              onAddStep={() => setEditedFlow([...editedFlow, ''])}
              onRemoveStep={(index) => setEditedFlow(editedFlow.filter((_, i) => i !== index))}
            />
            
            <Textarea
              label="POSTCONDITION"
              name="postcondition"
              value={formData.postcondition}
              onChange={handleChange}
              placeholder="e.g., Video content is delivered..."
            />
            
            <div className={styles.editActions}>
              <Button variant="outline" size="sm" onClick={handleCancel}>
                <X size={14} style={{ marginRight: '4px' }} /> Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSave}>
                <Check size={14} style={{ marginRight: '4px' }} /> Save Changes
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className={styles.section}>
              <span className={styles.label}>Title</span>
              <span className={styles.value}>{title || '—'}</span>
            </div>
            
            <div className={styles.section}>
              <span className={styles.label}>Actor</span>
              <span className={styles.value}>{actor || '—'}</span>
            </div>
            
            <div className={styles.section}>
              <span className={styles.label}>Precondition</span>
              <span className={styles.text}>{precondition || '—'}</span>
            </div>
            
            <div className={styles.section}>
              <span className={styles.label}>Main Flow</span>
              <ol className={styles.flowList}>
                {mainFlow && mainFlow.length > 0 ? (
                  mainFlow.map((step, index) => (
                    <li key={index} className={styles.flowItem}>
                      {typeof step === 'object' ? (step.text || step.value || JSON.stringify(step)) : step}
                    </li>
                  ))
                ) : (
                  <span className={styles.text}>—</span>
                )}
              </ol>
            </div>
            
            <div className={styles.section}>
              <span className={styles.label}>Postcondition</span>
              <span className={styles.text}>{postcondition || '—'}</span>
            </div>
          </>
        )}
      </div>

      {!isEditing && onRegenerate && (
        <div className={styles.footer}>
          <Button 
            variant="primary" 
            onClick={onRegenerate}
            isLoading={isGenerating}
            fullWidth
            className={styles.generateButton}
          >
            <Sparkles size={16} style={{ marginRight: '8px' }} />
            Generate Sustainable Use Case
          </Button>
        </div>
      )}
    </div>
  );
};

export default OriginalUseCasePanel;
