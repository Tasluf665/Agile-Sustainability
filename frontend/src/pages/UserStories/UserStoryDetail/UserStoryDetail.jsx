import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { PlusCircle, ArrowLeft, Trash2 } from 'lucide-react';
import AppShell from '../../../components/layout/AppShell/AppShell';
import PageHeader from '../../../components/layout/PageHeader/PageHeader';
import Button from '../../../components/common/Button/Button';
import Badge from '../../../components/common/Badge/Badge';
import SkeletonCard from '../../../components/common/SkeletonCard/SkeletonCard';
import AlertBanner from '../../../components/feedback/AlertBanner/AlertBanner';

import {
  fetchUserStoryById,
  generateSustainableStory,
  acceptSustainableStory,
  rejectSustainableStory,
  deleteUserStory,
  updateUserStory,
  updateAISuggestion
} from '../../../store/slices/userStoriesSlice';
import { fetchUseCasesByStory } from '../../../store/slices/useCasesSlice';
import { fetchProjects } from '../../../store/slices/projectsSlice';

import OriginalStoryPanel from '../../../components/sustainability/OriginalStoryPanel/OriginalStoryPanel';
import SustainableVersionPanel from '../../../components/sustainability/SustainableVersionPanel/SustainableVersionPanel';
import AISuggestionPanel from '../../../components/sustainability/AISuggestionPanel/AISuggestionPanel';
import UseCaseRow from '../../../components/sustainability/UseCaseRow/UseCaseRow';

import styles from './UserStoryDetail.module.css';

const UserStoryDetail = () => {
  const { projectId, storyId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentStory = useSelector(state => state.userStories.currentStory);
  const isStoryLoading = useSelector(state => state.userStories.isLoading);
  const storyError = useSelector(state => state.userStories.error);

  const aiState = useSelector(state => state.userStories.aiSuggestion);

  const useCases = useSelector(state => state.useCases.useCases);
  const isUseCasesLoading = useSelector(state => state.useCases.loading);

  const projects = useSelector(state => state.projects.projects);
  const project = projects.find(p => p.id === projectId);

  const isApproved = currentStory?.status === 'APPROVED';

  useEffect(() => {
    if (!project) {
      dispatch(fetchProjects());
    }
    dispatch(fetchUserStoryById({ projectId, storyId }));
    dispatch(fetchUseCasesByStory({ projectId, storyId }));
  }, [dispatch, projectId, storyId, project]);

  const handleRegenerate = () => {
    if (currentStory && currentStory.description) {
      dispatch(generateSustainableStory(currentStory.description));
    }
  };

  const handleAccept = () => {
    dispatch(acceptSustainableStory(storyId));
  };

  const handleReject = () => {
    dispatch(rejectSustainableStory(storyId));
  };

  const handleAddUseCase = () => {
    navigate(`/projects/${projectId}/user-stories/${storyId}/use-cases/new`);
  };

  const handleViewUseCase = (useCaseId) => {
    navigate(`/projects/${projectId}/user-stories/${storyId}/use-cases/${useCaseId}`);
  };

  const handleDeleteStory = () => {
    dispatch(deleteUserStory({ projectId, storyId })).then(() => {
      navigate(`/projects/${projectId}`);
    });
  };

  const handleUpdateOriginalStory = (updates) => {
    dispatch(updateUserStory({ storyId, updates }));
  };

  const handleUpdateSustainableVersion = (updates) => {
    // If we have an active result with a suggestionId and the story is not yet approved,
    // we update the AI suggestion record.
    if (!isApproved && aiState.result?.suggestionId) {
      dispatch(updateAISuggestion({
        suggestionId: aiState.result.suggestionId,
        updates
      }));
    } else {
      // Otherwise (approved story or a draft with existing sustainable fields),
      // we update the UserStory model directly.
      dispatch(updateUserStory({
        storyId,
        updates: {
          sustainableDescription: updates.sustainableStory,
          acceptanceCriteria: updates.acceptanceCriteria
        }
      }));
    }
  };

  // Build the Header actions and title
  const getBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'success';
      case 'pending review':
      case 'in_review': return 'warning';
      default: return 'default'; // Draft
    }
  };

  const breadcrumbs = (
    <div className={styles.breadcrumbLinkRow}>
      <Link to={`/projects/${projectId}`} className={styles.backLink}>
        <ArrowLeft size={16} />
      </Link>
      <Link to="/projects" className={styles.breadcrumbMuted}>Projects</Link>
      <span className={styles.breadcrumbChevron}>/</span>
      <Link to={`/projects/${projectId}`} className={styles.breadcrumbMuted}>
        {project ? project.name : "Project"}
      </Link>
      <span className={styles.breadcrumbChevron}>/</span>
      <span className={styles.breadcrumbActive}>User Story</span>
    </div>
  );

  const HeaderActions = currentStory ? (
    <div className={styles.headerActions}>
      <Badge text={currentStory.status.replace('_', ' ')} color={getBadgeColor(currentStory.status)} size="md" />
      <Button
        variant="outline"
        onClick={handleDeleteStory}
        className={styles.deleteButton}
      >
        <Trash2 size={16} />
      </Button>
    </div>
  ) : null;

  // Determine Right Panel State
  const renderRightPanel = () => {
    if (aiState.error) {
      return (
        <div className={styles.rightPanelWrapper}>
          <AlertBanner type="error" title="Generation Failed" message={aiState.error} />
          <AISuggestionPanel status="waiting" />
        </div>
      );
    }

    if (aiState.isGenerating) {
      return (
        <div className={styles.rightPanelWrapper}>
          <AISuggestionPanel status="loading" />
        </div>
      );
    }

    // State 3: Generated (before accepting OR after accepting) - For this task, the mock data has `sustainableDescription`
    // aiState.result will override mock data if newly generated.
    const sustainableDesc = aiState.result?.description || currentStory?.sustainableDescription;
    const criteria = aiState.result?.criteria || currentStory?.acceptanceCriteria;
    const focusArea = aiState.result?.focusArea || currentStory?.focusArea;
    const co2ImpactNote = aiState.result?.co2ImpactNote || currentStory?.co2ImpactNote;

    if (sustainableDesc) {
      return (
        <div className={styles.rightPanelWrapper}>
          <SustainableVersionPanel
            description={sustainableDesc}
            focusArea={focusArea}
            acceptanceCriteria={criteria}
            co2ImpactNote={co2ImpactNote}
            onAccept={handleAccept}
            onRegenerate={handleRegenerate}
            onUpdate={handleUpdateSustainableVersion}
            isAccepting={false} // Would add if there was an accepting thunk loading state
            isRegenerating={aiState.isGenerating}
            isApproved={isApproved}
            readonly={false} // Always allowed to edit/regenerate now
          />
        </div>
      );
    }

    // State 1: No sustainable version
    return (
      <div className={styles.rightPanelWrapper}>
        <AISuggestionPanel status="waiting" />
      </div>
    );
  };

  return (
    <AppShell>
      <div className={styles.pageWrapper}>
        <div className={styles.headerWrapper}>
          <PageHeader
            title={currentStory ? currentStory.title : "Loading..."}
            subtitle={breadcrumbs}
            actions={HeaderActions}
          />
        </div>

        <div className={styles.contentWrapper}>
          {isStoryLoading || !currentStory ? (
            <div className={styles.panelsGrid}>
              <SkeletonCard height={400} />
              <SkeletonCard height={400} />
            </div>
          ) : (
            <div className={styles.panelsGrid}>
              <div className={styles.leftPanelWrapper}>
                <OriginalStoryPanel
                  description={currentStory.description}
                  priority={currentStory.priority}
                  feature={currentStory.feature}
                  onRegenerate={handleRegenerate}
                  isGenerating={aiState.isGenerating}
                  onUpdate={handleUpdateOriginalStory}
                />
              </div>

              {renderRightPanel()}
            </div>
          )}

          <div className={styles.useCasesSection}>
            <div className={styles.useCasesHeader}>
              <h2 className={styles.useCasesTitle}>Use Cases</h2>
              <Button variant="outline" onClick={handleAddUseCase}>
                <PlusCircle size={14} style={{ marginRight: '6px' }} /> Add Use Case
              </Button>
            </div>

            <div className={styles.useCasesList}>
              {isUseCasesLoading ? (
                <>
                  <SkeletonCard height={120} />
                  <SkeletonCard height={120} />
                </>
              ) : useCases && useCases.length > 0 ? (
                useCases.map(uc => (
                  <UseCaseRow
                    key={uc._id || uc.id}
                    id={uc.customId || ''}
                    title={uc.title}
                    status={uc.status}
                    lastEdited={uc.updatedAt ? `Edited ${new Date(uc.updatedAt).toLocaleDateString()}` : ''}
                    originalTitle={uc.title}
                    sustainableTitle={uc.sustainableTitle}
                    onViewDetails={() => handleViewUseCase(uc._id || uc.id)}
                  />
                ))
              ) : (
                <div className={styles.emptyUseCases}>
                  No use cases linked to this user story yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default UserStoryDetail;
