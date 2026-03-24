import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Sparkles, Info } from 'lucide-react';
import AppShell from '../../../components/layout/AppShell/AppShell';
import PageHeader from '../../../components/layout/PageHeader/PageHeader';
import Button from '../../../components/common/Button/Button';
import Textarea from '../../../components/common/Textarea/Textarea';
import InfoBox from '../../../components/common/InfoBox/InfoBox';
import AISuggestionPanel from '../../../components/sustainability/AISuggestionPanel/AISuggestionPanel';
import { generateSustainableStory, clearAiSuggestion, createUserStory } from '../../../store/slices/userStoriesSlice';
import { fetchProjects } from '../../../store/slices/projectsSlice';
import styles from './NewUserStory.module.css';

const NewUserStory = () => {
  const { projectId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  
  const projects = useSelector(state => state.projects.projects);
  const project = projects.find(p => p.id === projectId);
  const aiState = useSelector(state => state.userStories.aiSuggestion);

  useEffect(() => {
    if (!project && projects.length === 0) {
      dispatch(fetchProjects());
    }
    return () => {
      dispatch(clearAiSuggestion());
    };
  }, [dispatch, project, projects.length]);

  const handleGenerate = () => {
    if (description.trim()) {
      dispatch(generateSustainableStory(description));
    }
  };

  const handleAddUserStory = () => {
    if (description.trim()) {
      dispatch(createUserStory({
        projectId,
        title: description.substring(0, 40) + (description.length > 40 ? '...' : ''),
        description: description,
        status: 'DRAFT',
        acceptanceCriteria: []
      })).then(() => {
        dispatch(clearAiSuggestion());
        navigate(`/projects/${projectId}`);
      });
    }
  };

  const handleAccept = () => {
    dispatch(createUserStory({
      projectId,
      title: aiState.result.description.substring(0, 40) + (aiState.result.description.length > 40 ? '...' : ''),
      description: description,
      sustainableDescription: aiState.result.description,
      acceptanceCriteria: aiState.result.criteria || [],
      focusArea: aiState.result.focusArea,
      co2ImpactNote: aiState.result.co2ImpactNote,
      aiGenerated: true,
      status: 'DRAFT'
    })).then(() => {
      dispatch(clearAiSuggestion());
      navigate(`/projects/${projectId}`);
    });
  };

  const handleReject = () => {
    dispatch(clearAiSuggestion());
  };

  const breadcrumbs = (
    <div className={styles.breadcrumbLinkRow}>
      <Link to="/projects" className={styles.breadcrumbMuted}>
        Projects
      </Link>
      <span className={styles.breadcrumbChevron}>/</span>
      <Link to={`/projects/${projectId}`} className={styles.breadcrumbMuted}>
        {project ? project.name : "Project"}
      </Link>
      <span className={styles.breadcrumbChevron}>/</span>
      <span className={styles.breadcrumbActive}>New Story</span>
    </div>
  );

  // Determine panel status based on aiState
  let status = 'waiting';
  if (aiState.isGenerating) {
    status = 'loading';
  } else if (aiState.result) {
    status = 'result';
  }

  return (
    <AppShell>
      <div className={styles.pageWrapper}>
        <div className={styles.headerWrapper}>
          <PageHeader
            title="New User Story"
            subtitle={breadcrumbs}
          />
        </div>
        
        <div className={styles.contentWrapper}>
          <div className={styles.splitLayout}>
            {/* Left Panel */}
            <div className={styles.leftColumn}>
                <div className={styles.leftPanel}>
                    <div className={styles.panelHeader}>
                        <h3 className={styles.panelTitle}>Write Your User Story</h3>
                        <p className={styles.panelSubtitle}>
                            Define your feature requirements following the standard agile format. Focus on the value provided to the end user.
                        </p>
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label className={styles.inputLabel}>User Story Description</label>
                        <Textarea 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="As a user, I want to..."
                            rows={8}
                        />
                        
                        <div className={styles.generateActionWrapper}>
                            <Button 
                                variant="primary" 
                                onClick={handleGenerate} 
                                isLoading={aiState.isGenerating}
                                disabled={!description.trim() || aiState.isGenerating}
                                fullWidth
                            >
                                <Sparkles size={16} style={{ marginRight: '8px' }} />
                                Generate Sustainable Version
                            </Button>
                            <Button 
                                variant="outline" 
                                onClick={handleAddUserStory} 
                                disabled={!description.trim() || aiState.isGenerating}
                                fullWidth
                            >
                                Add User Story
                            </Button>
                        </div>
                        
                        <div className={styles.tipsRow}>
                            <Info size={12} className={styles.tipIcon} />
                            <span className={styles.tipText}>Tips: Be specific about the persona and the outcome.</span>
                        </div>
                    </div>
                </div>

                <div className={styles.infoBoxWrapper}>
                    <InfoBox 
                        icon={Info}
                        title="Why Sustainable User Stories?"
                        description={
                            <>
                                By incorporating sustainability into your user stories, you reduce<br />
                                digital waste, optimize server calls, and lower the carbon footprint of<br />
                                your software components from the design phase.
                            </>
                        }
                    />
                </div>
            </div>
            
            {/* Right Panel */}
            <div className={styles.rightColumn}>
              <AISuggestionPanel 
                status={status}
                suggestion={aiState.result ? aiState.result.description : null}
                acceptanceCriteria={aiState.result ? aiState.result.criteria : []}
                focusArea={aiState.result ? aiState.result.focusArea : 'ENERGY EFFICIENCY'}
                co2ImpactNote={aiState.result ? aiState.result.co2ImpactNote : ''}
                onAccept={handleAccept}
                onReject={handleReject}
                usageCount={12}
                usageUnit="teammates"
                usagePeriod="week"
              />
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default NewUserStory;
