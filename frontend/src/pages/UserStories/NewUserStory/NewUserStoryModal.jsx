import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Sparkles, ArrowRight } from 'lucide-react';
import Modal from '../../../components/common/Modal/Modal';
import Button from '../../../components/common/Button/Button';
import Textarea from '../../../components/common/Textarea/Textarea';
import { generateSustainableStory, clearAiSuggestion, createUserStory } from '../../../store/slices/userStoriesSlice';
import styles from './NewUserStoryModal.module.css';

const NewUserStoryModal = ({ onClose, projectId }) => {
  const dispatch = useDispatch();
  const [description, setDescription] = useState('');
  const aiState = useSelector(state => state.userStories.aiSuggestion);

  const handleGenerate = () => {
    if (description.trim()) {
      dispatch(generateSustainableStory(description));
    }
  };

  const handleCreate = (descriptionToUse, status) => {
    dispatch(createUserStory({
      projectId,
      title: descriptionToUse.substring(0, 40) + '...',
      description: descriptionToUse,
      status: status
    })).then(() => {
      onClose();
      dispatch(clearAiSuggestion());
    });
  };

  return (
    <Modal title="Create New User Story" isOpen={true} onClose={onClose} icon={Sparkles}>
      <div className={styles.splitLayout}>
        <div className={styles.leftPanel}>
          <div className={styles.panelHeader}>
            <h3 className={styles.panelTitle}>Write Your User Story</h3>
            <p className={styles.panelSubtitle}>As a [role], I want to [action], so that [benefit].</p>
          </div>
          <Textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="E.g., As an admin, I want to upload video files via a drag-and-drop interface so that content creators can easily manage their media..."
            rows={8}
          />
          <div className={styles.leftActions}>
             <Button variant="ghost" onClick={() => handleCreate(description, 'DRAFT')}>Save as Draft</Button>
             <Button variant="primary" onClick={handleGenerate} isLoading={aiState.isGenerating}>
               <Sparkles size={16} style={{ marginRight: '8px' }} />
               Generate Sustainable Version
             </Button>
          </div>
        </div>
        
        <div className={styles.divider}></div>
        
        <div className={styles.rightPanel}>
          <div className={styles.panelHeader}>
             <h3 className={styles.panelTitle}>AI Suggestion</h3>
             <p className={styles.panelSubtitle}>Let GreenStory evaluate and optimize your user story for sustainability impact.</p>
          </div>
          
          <div className={styles.suggestionBox}>
            {aiState.isGenerating ? (
               <div className={styles.loadingState}>
                  <div className={styles.bounceLoader}>
                    <div></div><div></div><div></div>
                  </div>
                  <span>Analyzing sustainability potential...</span>
               </div>
            ) : aiState.result ? (
               <div className={styles.resultState}>
                 <p className={styles.resultText}>{aiState.result}</p>
                 <div className={styles.resultActions}>
                    <Button variant="outline" onClick={() => dispatch(clearAiSuggestion())} fullWidth>Reject</Button>
                    <Button variant="primary" onClick={() => handleCreate(aiState.result, 'ACCEPTED')} fullWidth>
                      Accept <ArrowRight size={16} style={{ marginLeft: '4px' }} />
                    </Button>
                 </div>
               </div>
            ) : (
               <div className={styles.emptyState}>
                 <Sparkles size={32} className={styles.emptyIcon} />
                 <p>Click "Generate" to see sustainable alternatives</p>
               </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default NewUserStoryModal;
