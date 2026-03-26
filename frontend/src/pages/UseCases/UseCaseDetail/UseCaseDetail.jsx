import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AppShell from '../../../components/layout/AppShell/AppShell';
import PageHeader from '../../../components/layout/PageHeader/PageHeader';
import Sidebar from '../../../components/layout/Sidebar/Sidebar';
import Button from '../../../components/common/Button/Button';
import SkeletonCard from '../../../components/common/SkeletonCard/SkeletonCard';
import AlertBanner from '../../../components/feedback/AlertBanner/AlertBanner';
import OriginalUseCasePanel from '../../../components/sustainability/OriginalUseCasePanel/OriginalUseCasePanel';
import SustainableUseCasePanel from '../../../components/sustainability/SustainableUseCasePanel/SustainableUseCasePanel';
import AISuggestionPanel from '../../../components/sustainability/AISuggestionPanel/AISuggestionPanel';
import LinkedUserStoryCard from '../../../components/sustainability/LinkedUserStoryCard/LinkedUserStoryCard';
import {
  ArrowLeft,
  Trash2
} from 'lucide-react';
import styles from './UseCaseDetail.module.css';

// Thunks and Actions
import { fetchProjectById } from '../../../store/slices/projectsSlice';
import { fetchUserStoryById } from '../../../store/slices/userStoriesSlice';
import {
  fetchUseCaseById,
  acceptSustainableUseCase,
  rejectSustainableUseCase,
  updateUseCase,
  deleteUseCase
} from '../../../store/slices/useCasesSlice';
import { generateSustainableUseCase, resetSuggestion } from '../../../store/slices/aiSuggestionSlice';

const UseCaseDetail = () => {
  const { projectId, storyId, useCaseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { currentProject } = useSelector(state => state.projects);
  const { currentStory: selectedStory, isLoading: storyLoading, error: storyError } = useSelector(state => state.userStories);
  const { currentUseCase, loading: useCaseLoading, error: useCaseError } = useSelector(state => state.useCases);
  const { loading: aiLoading, currentSuggestion: aiSuggestion } = useSelector(state => state.aiSuggestion);

  useEffect(() => {
    if (projectId) dispatch(fetchProjectById(projectId));
    if (storyId) dispatch(fetchUserStoryById({ projectId, storyId }));
    if (useCaseId) dispatch(fetchUseCaseById({ projectId, storyId, useCaseId }));

    return () => {
      dispatch(resetSuggestion());
    };
  }, [dispatch, projectId, storyId, useCaseId]);

  const handleGenerateSustainable = async () => {
    if (!currentUseCase) return;

    setIsGenerating(true);
    try {
      await dispatch(generateSustainableUseCase({
        title: currentUseCase.title,
        actor: currentUseCase.actor,
        precondition: currentUseCase.precondition,
        mainFlow: currentUseCase.mainFlow,
        postcondition: currentUseCase.postcondition,
        userStoryId: storyId
      })).unwrap();
    } catch (err) {
      console.error("Generation failed:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAcceptFinal = () => {
    if (aiSuggestion && !currentUseCase.sustainableTitle) {
      // Coming from AISuggestionPanel just generated
      const dataToSave = {
        sustainableTitle: aiSuggestion.sustainableTitle,
        sustainableFlow: aiSuggestion.sustainableFlow,
        sustainabilityNotes: aiSuggestion.sustainabilityNotes,
        co2SavingPerHour: aiSuggestion.co2SavingPerHour,
        dimension: aiSuggestion.dimension,
        focusArea: aiSuggestion.focusArea,
        co2ImpactNote: aiSuggestion.co2ImpactNote,
        status: 'APPROVED'
      };
      dispatch(updateUseCase({ id: useCaseId, ...dataToSave }));
      dispatch(resetSuggestion());
    } else {
      // Existing sustainable fields, just transition to Approved
      dispatch(acceptSustainableUseCase(useCaseId));
    }
  };

  const handleReject = () => {
    dispatch(rejectSustainableUseCase(useCaseId));
    dispatch(resetSuggestion());
  };

  const handleRegenerateFromReview = () => {
    // Reject current one (moves to Draft) and start generation
    dispatch(rejectSustainableUseCase(useCaseId)).then(() => {
      handleGenerateSustainable();
    });
  };

  const handleUpdateOriginalUseCase = async (updatedFields) => {
    try {
      await dispatch(updateUseCase({
        id: useCaseId,
        ...updatedFields
      })).unwrap();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleUpdateAISuggestion = async (updatedData) => {
    // This allows editing the sustainable version after acceptance
    try {
      await dispatch(updateUseCase({
        id: useCaseId,
        ...updatedData
      })).unwrap();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await dispatch(deleteUseCase(useCaseId)).unwrap();
      navigate(`/projects/${projectId}/user-stories/${storyId}`);
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete the use case. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Loading State
  if (useCaseLoading || storyLoading || (!currentUseCase && !useCaseError)) {
    return (
      <AppShell>
        <div style={{ padding: '32px' }}>
          <PageHeader
            title="Loading Details..."
            subtitle="Please wait while we fetch the use case information"
          />
          <div className={styles.loadingGrid}>
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </AppShell>
    );
  }

  // Error State
  if (useCaseError || storyError) {
    return (
      <AppShell>
        <div style={{ padding: '32px' }}>
          <PageHeader
            title="Error"
            subtitle="Could not load use case details"
          />
          <AlertBanner
            type="error"
            message={useCaseError || storyError || "An unexpected error occurred."}
          />
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            style={{ marginTop: '20px' }}
          >
            Go Back
          </Button>
        </div>
      </AppShell>
    );
  }

  // Success State
  const breadcrumbProjectName = currentProject ? currentProject.name : 'Project';
  const breadcrumbStoryName = selectedStory ? selectedStory.title : 'User Story';
  const rawId = currentUseCase?._id || currentUseCase?.id || '0000';
  const idStr = rawId.toString();
  const ucCode = `UC-${idStr.substring(idStr.length > 4 ? idStr.length - 4 : 0).toUpperCase()}`;

  // Determine which right panel to show
  const hasSustainableVersion = currentUseCase.sustainableTitle || (currentUseCase.sustainableFlow && currentUseCase.sustainableFlow.length > 0);
  const isApproved = currentUseCase.status === 'APPROVED';

  let rightPanel;
  if (isApproved || hasSustainableVersion) {
    rightPanel = (
      <SustainableUseCasePanel
        optimizedTitle={currentUseCase.sustainableTitle}
        modifiedFlow={currentUseCase.sustainableFlow || []}
        sustainabilityNotes={currentUseCase.sustainabilityNotes}
        co2SavingPerHour={currentUseCase.co2SavingPerHour}
        dimension={currentUseCase.dimension}
        status={isApproved ? "APPROVED" : "IN REVIEW"}
        onAccept={handleAcceptFinal}
        onReject={handleReject}
        onRegenerate={handleRegenerateFromReview}
        onUpdate={handleUpdateAISuggestion}
      />
    );
  } else {
    // Draft state - show AI Suggestion Panel (waiting, loading, or result)
    rightPanel = (
      <AISuggestionPanel
        type="useCase"
        status={isGenerating || aiLoading ? 'loading' : (aiSuggestion ? 'result' : 'waiting')}
        suggestion={aiSuggestion?.sustainableTitle}
        sustainableFlow={aiSuggestion?.sustainableFlow || []}
        sustainabilityNotes={aiSuggestion?.sustainabilityNotes}
        co2SavingPerHour={aiSuggestion?.co2SavingPerHour}
        dimension={aiSuggestion?.dimension}
        onAccept={handleAcceptFinal}
        onReject={handleRegenerateFromReview}
        onGenerate={handleGenerateSustainable}
      />
    );
  }

  const breadcrumbText = (
    <div className={styles.breadcrumbLinkRow}>
      <Link to={`/projects/${projectId}/user-stories/${storyId}`} className={styles.backLink}>
        <ArrowLeft size={16} />
      </Link>
      <Link to="/projects" className={styles.breadcrumbMuted}>Projects</Link>
      <span className={styles.breadcrumbChevron}>/</span>
      <Link to={`/projects/${projectId}`} className={styles.breadcrumbMuted}>
        {breadcrumbProjectName}
      </Link>
      <span className={styles.breadcrumbChevron}>/</span>
      <Link to={`/projects/${projectId}/user-stories/${storyId}`} className={styles.breadcrumbMuted}>
        {breadcrumbStoryName}
      </Link>
      <span className={styles.breadcrumbChevron}>/</span>
      <span className={styles.breadcrumbActive}>{ucCode}</span>
    </div>
  );

  const HeaderActions = (
    <div className={styles.headerActions}>
      <Button variant="outline" onClick={() => navigate(-1)}>
        <ArrowLeft size={16} style={{ marginRight: '8px' }} /> Back
      </Button>
      <Button
        variant="outline"
        onClick={handleDelete}
        disabled={isDeleting}
        style={{ color: '#dc2626', borderColor: '#fca5a5' }}
      >
        <Trash2 size={16} style={{ marginRight: '8px' }} />
        {isDeleting ? 'Deleting...' : 'Delete'}
      </Button>
    </div>
  );

  return (
    <AppShell>
      <div className={styles.detailContainer}>
        <PageHeader
          title={`Use Case: ${currentUseCase.title}`}
          subtitle={breadcrumbText}
          actions={HeaderActions}
        />

        <div className={styles.gridContainer}>
          <div className={styles.mainColumn}>
            <OriginalUseCasePanel
              title={currentUseCase.title}
              actor={currentUseCase.actor}
              precondition={currentUseCase.precondition}
              mainFlow={currentUseCase.mainFlow || []}
              postcondition={currentUseCase.postcondition}
              status={isApproved ? "APPROVED" : "DRAFT"}
              onUpdate={handleUpdateOriginalUseCase}
              onRegenerate={(!hasSustainableVersion && !isApproved) ? handleGenerateSustainable : null}
              isGenerating={isGenerating}
            />
          </div>

          <div className={styles.sideColumn}>
            <div className={styles.rightPanelWrapper}>
              {rightPanel}

              <div className={styles.linkedStoryContainer}>
                <LinkedUserStoryCard
                  status={currentUseCase.status === 'APPROVED' ? 'APPROVED' : (hasSustainableVersion ? 'IN REVIEW' : 'DRAFT')}
                  storyExcerpt={selectedStory?.description || `As a ${currentUseCase.actor}, I want to...`}
                  onViewStory={() => navigate(`/projects/${projectId}/user-stories/${storyId}`)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default UseCaseDetail;
