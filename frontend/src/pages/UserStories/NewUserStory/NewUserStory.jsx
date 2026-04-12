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
import styles from './NewUserStory.module.css';

const NewUserStory = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(1);
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

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

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    // Navigation to project detail after completion
    navigate(`/projects/${projectId}`);
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
            investResults={investResults}
            issues={issues}
            onNext={handleNext}
          />
        );
      case 3:
        return (
          <Step3Structure 
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <Step4Sustainability 
            onAccept={handleFinish}
            onBack={handleBack}
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
