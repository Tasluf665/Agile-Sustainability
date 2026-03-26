import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AppShell from '../../../components/layout/AppShell/AppShell';
import PageHeader from '../../../components/layout/PageHeader/PageHeader';
import Button from '../../../components/common/Button/Button';
import SearchInput from '../../../components/common/SearchInput/SearchInput';
import TabNav from '../../../components/common/TabNav/TabNav';
import StatCard from '../../../components/common/StatCard/StatCard';
import SustainabilityScoreChart from '../../../components/sustainability/SustainabilityScoreChart/SustainabilityScoreChart';
import ActivityFeed from '../../../components/common/ActivityFeed/ActivityFeed';
import UserStoryRow from '../../../components/sustainability/UserStoryRow/UserStoryRow';
import { PlusCircle, ArrowRight, ArrowLeft, Trash2, AlertTriangle, X } from 'lucide-react';
import styles from './ProjectDetail.module.css';

// Thunks and Selectors
import { fetchProjects, deleteProject } from '../../../store/slices/projectsSlice';
import { fetchUserStoriesByProject } from '../../../store/slices/userStoriesSlice';
import { fetchUseCasesByProject } from '../../../store/slices/useCasesSlice';
import { fetchProjectActivity } from '../../../store/slices/activitySlice';
import { fetchSustainabilityScore } from '../../../store/slices/analyticsSlice';
import {
  selectStoryCount,
  selectAcceptedSuggestionCount,
  selectTotalUseCaseCount,
  selectActiveUserStories
} from '../../../store/selectors/storySelectors';

const TABS = [
  { label: 'Overview', value: 'overview' },
  { label: 'User Stories', value: 'stories' }
];

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const projects = useSelector(state => state.projects.projects);
  const project = projects.find(p => p.id === projectId);

  const activeStories = useSelector(selectActiveUserStories);
  const storyCount = useSelector(selectStoryCount);
  const acceptedSuggestions = useSelector(selectAcceptedSuggestionCount);
  const useCaseCount = useSelector(selectTotalUseCaseCount);

  const activityFeed = useSelector(state => state.activity.items);
  const chartData = useSelector(state => state.analytics.sustainabilityScores);
  const isStoriesLoading = useSelector(state => state.userStories.isLoading);
  const useCases = useSelector(state => state.useCases.useCases);

  useEffect(() => {
    // We fetch project list if missing to populate title. 
    if (!project) {
      dispatch(fetchProjects());
    }
    dispatch(fetchUserStoriesByProject(projectId));
    dispatch(fetchUseCasesByProject(projectId));
    dispatch(fetchProjectActivity(projectId));
    dispatch(fetchSustainabilityScore(projectId));
  }, [dispatch, projectId, project]);

  const handleAddUserStory = () => {
    navigate(`/projects/${projectId}/user-stories/new`);
  };

  const handleViewStory = (storyId) => {
    navigate(`/projects/${projectId}/user-stories/${storyId}`);
  };

  const handleAddUseCase = (storyId) => {
    navigate(`/projects/${projectId}/user-stories/${storyId}/use-cases/new`);
  };
  
  const handleDeleteProject = async () => {
    setIsDeleting(true);
    try {
      await dispatch(deleteProject(projectId)).unwrap();
      navigate('/projects');
    } catch (err) {
      console.error('Failed to delete project:', err);
      alert('Failed to delete project. Please try again.');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const filteredStories = activeStories.filter(story =>
    story.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const HeaderActions = (
    <div className={styles.headerActions}>
      {showDeleteConfirm ? (
        <div className={styles.confirmWrapper}>
          <div className={styles.confirmMessage}>
            <AlertTriangle size={16} className={styles.warningIcon} />
            <span>Delete project?</span>
          </div>
          <div className={styles.confirmButtons}>
            <Button 
               variant="danger" 
               size="sm" 
               onClick={handleDeleteProject}
               isLoading={isDeleting}
            >
              Confirm
            </Button>
            <Button 
               variant="outline" 
               size="sm" 
               onClick={() => setShowDeleteConfirm(false)}
               disabled={isDeleting}
            >
              <X size={14} />
            </Button>
          </div>
        </div>
      ) : (
        <>
          <Button variant="outline" onClick={() => setShowDeleteConfirm(true)} className={styles.deleteButton}>
            <Trash2 size={16} />
          </Button>
          <Button variant="primary" onClick={handleAddUserStory}>
            <PlusCircle size={16} />
            <span style={{ marginLeft: '8px' }}>Add User Story</span>
          </Button>
        </>
      )}
    </div>
  );

  // Custom styled breadcrumbs
  const breadcrumbs = (
    <div className={styles.breadcrumbLinkRow}>
      <Link to="/projects" className={styles.backLink}>
        <ArrowLeft size={16} />
      </Link>
      <Link to="/projects" className={styles.breadcrumbMuted}>Projects</Link>
      <span className={styles.breadcrumbChevron}>/</span>
      <span className={styles.breadcrumbActive}>{project ? project.name : "Project"}</span>
    </div>
  );

  const renderOverviewTab = () => (
    <div className={styles.tabContent}>
      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <StatCard title="Total User Stories" value={storyCount} subtitle="+2 this week" />
        <StatCard title="Sustainability Suggestions Accepted" value={acceptedSuggestions} subtitle="67% adoption" />
        <StatCard title="Use Cases Added" value={useCaseCount} subtitle="1.2 avg/story" />
      </div>

      {/* Active User Stories List */}
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>Active User Stories</h3>
        <button className={styles.textButton} onClick={() => setActiveTab('stories')}>
          View all stories <ArrowRight size={14} />
        </button>
      </div>

      <div className={styles.storiesList}>
        {isStoriesLoading ? (
          <div className={styles.loader}>Loading stories...</div>
        ) : filteredStories.length > 0 ? (
          filteredStories.map(story => (
            <UserStoryRow
              key={story._id || story.id}
              status={story.status}
              focusArea={story.focusArea}
              title={story.title}
              useCaseCount={useCases.filter(uc => uc.userStoryId === (story._id || story.id)).length}
              assignees={story.assignees}
              onViewStory={() => handleViewStory(story._id || story.id)}
              onAddUseCase={() => handleAddUseCase(story._id || story.id)}
            />
          ))
        ) : (
          <div className={styles.emptyState}>No stories found.</div>
        )}
      </div>

      {/* Bottom Split: Chart and Activity */}
      <div className={styles.bottomSplit}>
        <div className={styles.chartPanel}>
          <h3 className={styles.sectionTitle}>Sustainability Score Trend</h3>
          <div className={styles.chartWrapper}>
            <SustainabilityScoreChart
              data={chartData}
              caption="Project efficiency increased by 14% over the last 6 months."
            />
          </div>
        </div>
        <div className={styles.activityPanel}>
          <h3 className={styles.sectionTitle}>Recent Activity</h3>
          <ActivityFeed activities={activityFeed} />
        </div>
      </div>
    </div>
  );

  const renderStoriesTab = () => (
    <div className={styles.tabContent}>
      <div className={styles.tabHeader}>
        <h3 className={styles.sectionTitle}>Project User Stories</h3>
      </div>

      <div className={styles.storiesList}>
        {isStoriesLoading ? (
          <div className={styles.loader}>Loading stories...</div>
        ) : filteredStories.length > 0 ? (
          filteredStories.map(story => (
            <UserStoryRow
              key={story._id || story.id}
              status={story.status}
              focusArea={story.focusArea}
              title={story.title}
              useCaseCount={useCases.filter(uc => uc.userStoryId === (story._id || story.id)).length}
              assignees={story.assignees}
              onViewStory={() => handleViewStory(story._id || story.id)}
              onAddUseCase={() => handleAddUseCase(story._id || story.id)}
            />
          ))
        ) : (
          <div className={styles.emptyState}>
            {searchQuery ? "No stories match your search." : "No stories found in this project."}
          </div>
        )}
      </div>
    </div>
  );

  const renderEmptyTab = (tabName) => (
    <div className={styles.emptyTab}>
      <h2>{tabName} tab content goes here.</h2>
    </div>
  );

  return (
    <AppShell>
      <div className={styles.pageWrapper}>
        <div className={styles.topSection}>
          <div className={styles.headerWrapper}>
            <PageHeader
              title={project ? project.name : "Loading..."}
              subtitle={breadcrumbs}
              actions={HeaderActions}
            />
          </div>
          <div className={styles.tabNavWrapper}>
            <TabNav tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />
          </div>
        </div>

        <div className={styles.scrollableContent}>
          {activeTab === 'overview' ? renderOverviewTab() :
            activeTab === 'stories' ? renderStoriesTab() :
              renderEmptyTab(TABS.find(t => t.value === activeTab)?.label)}
        </div>
      </div>
    </AppShell>
  );
};

export default ProjectDetail;
