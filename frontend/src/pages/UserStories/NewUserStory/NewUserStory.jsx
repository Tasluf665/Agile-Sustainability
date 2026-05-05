import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProjects } from '../../../store/slices/projectsSlice';
import AppShell from '../../../components/layout/AppShell/AppShell';
import StepProgressBar from './components/StepProgressBar';
import Step1WriteStory from './components/Step1WriteStory';
import Step2QualityCheck from './components/Step2QualityCheck';
import Step3Structure from './components/Step3Structure';
import Step4Sustainability from './components/Step4Sustainability';
import api from '../../../services/api';
import styles from './NewUserStory.module.css';

const NewUserStory = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(1);
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // AI Results State
  const [qualityResults, setQualityResults] = useState(null);
  const [structuredData, setStructuredData] = useState(null);
  const [sustainabilityData, setSustainabilityData] = useState(null);

  const { projects } = useSelector((state) => state.projects);
  const project = projects.find(p => p.id === projectId || p._id === projectId);

  useEffect(() => {
    if (projects.length === 0) {
      dispatch(fetchProjects());
    }
  }, [dispatch, projects.length]);

  const steps = [
    { id: 1, label: 'Write Story' },
    { id: 2, label: 'Quality Check' },
    { id: 3, label: 'Structure' },
    { id: 4, label: 'Sustainability' }
  ];

  // Mock data for Step 2
  const investResults = [
    { title: 'Independent', status: 'PASS', description: 'Story is self-contained with no technical dependencies.' },
    { title: 'Negotiable', status: 'PASS', description: 'The focus is on the "What" and "Why", leaving "How" for the dev team.' },
    { title: 'Valuable', status: 'PASS', description: 'Provides clear business value to the end user.' },
    { title: 'Estimable', status: 'FAIL', description: 'Context is too vague to accurately gauge implementation effort.' },
    { title: 'Small', status: 'FAIL', description: 'This draft encompasses multiple high-level user goals (Epic).' },
    { title: 'Testable', status: 'PASS', description: 'Acceptance criteria can be defined based on the description.' }
  ];

  const issues = [
    { text: 'Missing User Persona (The ', highlight: 'WHO', suffix: ' is unclear)' },
    { text: 'Definition of Done is ', highlight: 'Too Vague' },
    { text: 'Technological ', highlight: 'Dependencies', suffix: ' detected' }
  ];

  const handleNext = async () => {
    if (currentStep === 1) {
      await handleQualityCheck();
    } else if (currentStep === 2) {
      await handleRestructure();
    } else if (currentStep === 3) {
      await handleSustainability();
    } else if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSustainability = async () => {
    if (!structuredData?.structured) return;

    setIsGenerating(true);
    try {
      const response = await api.post('/ai/generate-user-story', { 
        originalDescription: structuredData.structured,
        projectId
      });
      setSustainabilityData(response.data);
      setCurrentStep(4);
    } catch (error) {
      console.error('Sustainability generation failed:', error);
      alert('Failed to generate sustainable version. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRestructure = async () => {
    setIsGenerating(true);
    try {
      const response = await api.post('/ai/restructure', { story: description, projectId });
      setStructuredData(response.data);
      setCurrentStep(3);
    } catch (error) {
      console.error('Restructure failed:', error);
      alert('Failed to restructure story. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQualityCheck = async () => {
    if (!description.trim()) return;
    
    setIsGenerating(true);
    try {
      const response = await api.post('/ai/check-quality', { story: description, projectId });
      const data = response.data;
      
      // Map AI response to the format expected by Step 2
      const mappedInvest = [
        { title: 'Independent', status: data.independent.pass ? 'PASS' : 'FAIL', description: data.independent.note },
        { title: 'Negotiable', status: data.negotiable.pass ? 'PASS' : 'FAIL', description: data.negotiable.note },
        { title: 'Valuable', status: data.valuable.pass ? 'PASS' : 'FAIL', description: data.valuable.note },
        { title: 'Estimable', status: data.estimable.pass ? 'PASS' : 'FAIL', description: data.estimable.note },
        { title: 'Small', status: data.small.pass ? 'PASS' : 'FAIL', description: data.small.note },
        { title: 'Testable', status: data.testable.pass ? 'PASS' : 'FAIL', description: data.testable.note }
      ];
      
      const mappedIssues = data.issues.map(issueText => ({
        text: issueText,
        highlight: '', // We could potentially extract highlights if the AI provided them
        suffix: ''
      }));
      
      setQualityResults({
        investResults: mappedInvest,
        issues: mappedIssues,
        score: data.score
      });
      
      setCurrentStep(2);
    } catch (error) {
      console.error('Quality check failed:', error);
      alert('Failed to check story quality. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveUserStory = async (type) => {
    setIsGenerating(true);
    try {
      const payload = {
        projectId,
        priority: 'MEDIUM',
      };

      if (type === 'sustainable') {
        payload.originalDescription = description;
        payload.structuredDescription = structuredData?.structured || '';
        payload.sustainableDescription = sustainabilityData.sustainableStory;
        payload.acceptanceCriteria = sustainabilityData.acceptanceCriteria;
        payload.focusArea = sustainabilityData.focusArea;
        payload.co2ImpactNote = sustainabilityData.co2ImpactNote;
        payload.aiGenerated = true;
      } else {
        payload.originalDescription = description;
        payload.structuredDescription = structuredData?.structured || '';
        payload.acceptanceCriteria = structuredData?.acceptance_criteria || [];
        payload.aiGenerated = true; // Agent 1 still structured this draft
      }

      await api.post('/user-stories', payload);
      navigate(`/projects/${projectId}`);
    } catch (error) {
      console.error('Failed to save user story:', error);
      alert('Failed to save user story. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1WriteStory 
            description={description}
            setDescription={setDescription}
            onNext={handleNext}
            isGenerating={isGenerating}
          />
        );
      case 2:
        return (
          <Step2QualityCheck 
            originalStory={description}
            investResults={qualityResults?.investResults || []}
            issues={qualityResults?.issues || []}
            qualityScore={qualityResults?.score || 0}
            onNext={handleNext}
            isGenerating={isGenerating}
          />
        );
      case 3:
        return (
          <Step3Structure 
            originalDraft={description}
            initialDraft={structuredData?.structured || ''}
            acceptanceCriteria={structuredData?.acceptance_criteria || []}
            auditChanges={structuredData?.changes || []}
            onUpdate={(newDraft) => setStructuredData(prev => ({ ...prev, structured: newDraft }))}
            onNext={handleNext}
            onBack={handleBack}
            isGenerating={isGenerating}
          />
        );
      case 4:
        return (
          <Step4Sustainability 
            originalStory={description}
            functionalStory={structuredData?.structured || ''}
            functionalCriteria={structuredData?.acceptance_criteria || []}
            sustainableData={sustainabilityData}
            onAccept={() => handleSaveUserStory('sustainable')}
            onKeepOriginal={() => handleSaveUserStory('original')}
            onBack={handleBack}
            isSaving={isGenerating}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AppShell>
      <div className={styles.pageWrapper}>
        <div className={styles.mainContainer}>
          {/* Header & Breadcrumbs matching Figma design context */}
          <header className={styles.headerSection}>
            <nav className={styles.breadcrumbRow}>
              <Link to="/projects" className={styles.breadcrumbLink}>PROJECTS</Link>
              <span className={styles.breadcrumbChevron}><ChevronRight size={12} /></span>
              <Link to={`/projects/${projectId}`} className={styles.breadcrumbLink}>
                {project ? project.name.toUpperCase() : 'LOADING...'}
              </Link>
              <span className={styles.breadcrumbChevron}><ChevronRight size={12} /></span>
              <span className={`${styles.breadcrumbLink} ${styles.breadcrumbActive}`}>NEW USER STORY</span>
            </nav>
            <h1 className={styles.pageTitle}>New User Story</h1>
          </header>

          <StepProgressBar currentStep={currentStep} steps={steps} />

          {renderCurrentStep()}
        </div>
      </div>
    </AppShell>
  );
};

export default NewUserStory;
