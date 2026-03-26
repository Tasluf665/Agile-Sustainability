import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, PlusCircle, Sparkles } from 'lucide-react';
import AppShell from '../../../components/layout/AppShell/AppShell';
import PageHeader from '../../../components/layout/PageHeader/PageHeader';
import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';
import Textarea from '../../../components/common/Textarea/Textarea';
import AISuggestionPanel from '../../../components/sustainability/AISuggestionPanel/AISuggestionPanel';
import MainFlowBuilder from '../../../components/common/MainFlowBuilder/MainFlowBuilder';
import { generateSustainableUseCase, resetSuggestion } from '../../../store/slices/aiSuggestionSlice';
import { createUseCase } from '../../../store/slices/useCasesSlice';
import { fetchProjectById } from '../../../store/slices/projectsSlice';
import { fetchUserStoryById } from '../../../store/slices/userStoriesSlice';
import styles from './NewUseCase.module.css';

const NewUseCase = () => {
  const { projectId, storyId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // State
  const [useCaseData, setUseCaseData] = useState({
    title: '',
    actor: '',
    precondition: '',
    postcondition: '',
    mainFlow: ['', '']
  });

  const { currentProject } = useSelector(state => state.projects);
  const { currentStory } = useSelector(state => state.userStories);
  const { currentSuggestion, loading: isGenerating, error: aiError } = useSelector(state => state.aiSuggestion);

  useEffect(() => {
    if (!currentProject || currentProject._id !== projectId) {
      dispatch(fetchProjectById(projectId));
    }
    if (!currentStory || currentStory._id !== storyId) {
      dispatch(fetchUserStoryById({ projectId, storyId }));
    }
    // Clear any previous suggestions when mounting
    dispatch(resetSuggestion());
  }, [dispatch, projectId, storyId]);

  const handleChange = (field, value) => {
    setUseCaseData(prev => ({ ...prev, [field]: value }));
  };

  const handleFlowChange = (newFlow) => {
    setUseCaseData(prev => ({ ...prev, mainFlow: newFlow }));
  };

  const handleAddStep = () => {
    if (useCaseData.mainFlow.length < 10) {
      setUseCaseData(prev => ({
        ...prev,
        mainFlow: [...prev.mainFlow, '']
      }));
    }
  };

  const handleRemoveStep = (index) => {
    if (useCaseData.mainFlow.length > 1) {
      const newFlow = useCaseData.mainFlow.filter((_, i) => i !== index);
      setUseCaseData(prev => ({ ...prev, mainFlow: newFlow }));
    }
  };

  const handleGenerate = () => {
    if (!useCaseData.title || !useCaseData.mainFlow.some(s => s.trim())) {
      alert('Please provide at least a title and one flow step.');
      return;
    }
    
    dispatch(generateSustainableUseCase({
      projectId,
      userStoryId: storyId,
      title: useCaseData.title,
      actor: useCaseData.actor,
      precondition: useCaseData.precondition,
      postcondition: useCaseData.postcondition,
      mainFlow: useCaseData.mainFlow.filter(s => s.trim())
    }));
  };

  const handleAccept = () => {
    if (!currentSuggestion) return;
    
    const finalUseCase = {
      projectId,
      userStoryId: storyId,
      title: useCaseData.title,
      actor: useCaseData.actor,
      precondition: useCaseData.precondition,
      postcondition: useCaseData.postcondition,
      mainFlow: useCaseData.mainFlow.filter(s => s.trim()),
      
      // Sustainable fields from AI
      sustainableTitle: currentSuggestion.sustainableTitle,
      sustainableFlow: currentSuggestion.sustainableFlow,
      sustainabilityNotes: currentSuggestion.sustainabilityNotes,
      co2SavingPerHour: currentSuggestion.co2SavingPerHour,
      dimension: currentSuggestion.dimension,
      status: 'Approved'
    };

    dispatch(createUseCase(finalUseCase)).then((res) => {
      if (!res.error) {
        navigate(`/projects/${projectId}/user-stories/${storyId}`);
      }
    });
  };

  const handleSave = () => {
    if (!useCaseData.title || !useCaseData.mainFlow.some(s => s.trim())) {
      alert('Please provide at least a title and one flow step.');
      return;
    }

    const finalUseCase = {
      projectId,
      userStoryId: storyId,
      title: useCaseData.title,
      actor: useCaseData.actor,
      precondition: useCaseData.precondition,
      postcondition: useCaseData.postcondition,
      mainFlow: useCaseData.mainFlow.filter(s => s.trim()),
      status: 'Draft'
    };

    dispatch(createUseCase(finalUseCase)).then((res) => {
      if (!res.error) {
        navigate(`/projects/${projectId}/user-stories/${storyId}`);
      }
    });
  };

  const handleReject = () => {
    dispatch(resetSuggestion());
  };

  const breadcrumbs = (
    <div className={styles.breadcrumbLinkRow}>
      <Link to={`/projects/${projectId}/user-stories/${storyId}`} className={styles.backLink}>
        <ArrowLeft size={16} />
      </Link>
      <Link to="/projects" className={styles.breadcrumbMuted}>Projects</Link>
      <span className={styles.breadcrumbChevron}>/</span>
      <Link to={`/projects/${projectId}`} className={styles.breadcrumbMuted}>
        {currentProject ? currentProject.name : 'Project'}
      </Link>
      <span className={styles.breadcrumbChevron}>/</span>
      <Link to={`/projects/${projectId}/user-stories/${storyId}`} className={styles.breadcrumbMuted}>
        User Story
      </Link>
      <span className={styles.breadcrumbChevron}>/</span>
      <span className={styles.breadcrumbActive}>New Use Case</span>
    </div>
  );

  return (
    <AppShell activeItem="Projects">
      <div className={styles.pageWrapper}>
        <PageHeader 
          title="Create New Use Case" 
          subtitle={breadcrumbs}
        />

        <div className={styles.contentWrapper}>
          <div className={styles.formCard}>
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>General Information</h3>
              <div className={styles.formRow}>
                <Input 
                  label="Use Case Title"
                  placeholder="e.g., Stream High Fidelity Asset"
                  value={useCaseData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                />
                <Input 
                  label="Primary Actor"
                  placeholder="e.g., Registered User"
                  value={useCaseData.actor}
                  onChange={(e) => handleChange('actor', e.target.value)}
                />
              </div>

              <div className={styles.formRow}>
                <Textarea 
                  label="Precondition"
                  placeholder="e.g., User is logged in and has stable connection"
                  value={useCaseData.precondition}
                  onChange={(e) => handleChange('precondition', e.target.value)}
                  rows={3}
                />
                <Textarea 
                  label="Postcondition"
                  placeholder="e.g., Asset is displayed on user's screen"
                  value={useCaseData.postcondition}
                  onChange={(e) => handleChange('postcondition', e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>Main Flow</h3>
              <MainFlowBuilder 
                steps={useCaseData.mainFlow}
                onChange={handleFlowChange}
                onAddStep={handleAddStep}
                onRemoveStep={handleRemoveStep}
                placeholders={['User clicks on the asset', 'System requests asset from CDN']}
              />
            </div>

            <div className={styles.generateArea}>
              <div className={styles.generateButtonWrapper}>
                <Button 
                    variant="primary" 
                    fullWidth 
                    onClick={handleGenerate}
                    disabled={isGenerating}
                >
                    <Sparkles size={18} style={{ marginRight: '8px' }} />
                    {isGenerating ? 'Generating...' : 'Generate Sustainable Use Case'}
                </Button>
                <Button 
                    variant="outline" 
                    fullWidth 
                    onClick={handleSave}
                    disabled={isGenerating}
                    className={styles.addUseCaseBtn}
                >
                    <PlusCircle size={18} style={{ marginRight: '8px' }} />
                    Add Use Case
                </Button>
              </div>
            </div>
          </div>

          <div className={styles.rightPanelWrapper}>
            <AISuggestionPanel 
              type="useCase"
              status={isGenerating ? 'loading' : (currentSuggestion ? 'result' : 'waiting')}
              suggestion={currentSuggestion?.sustainableTitle}
              sustainableFlow={currentSuggestion?.sustainableFlow || []}
              sustainabilityNotes={currentSuggestion?.sustainabilityNotes}
              co2SavingPerHour={currentSuggestion?.co2SavingPerHour}
              dimension={currentSuggestion?.dimension}
              focusArea={currentSuggestion?.focusArea}
              co2ImpactNote={currentSuggestion?.co2ImpactNote}
              onAccept={handleAccept}
              onReject={handleGenerate}
            />
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default NewUseCase;
