import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { fetchProjects } from '../../../store/slices/projectsSlice';
import Button from '../../../components/common/Button/Button';
import AppShell from '../../../components/layout/AppShell/AppShell';
import PageHeader from '../../../components/layout/PageHeader/PageHeader';
import ProjectCard from '../../../components/sustainability/ProjectCard/ProjectCard';
import CreateProjectCard from '../../../components/sustainability/CreateProjectCard/CreateProjectCard';
import SkeletonCard from '../../../components/common/SkeletonCard/SkeletonCard';
import CreateProjectModal from '../CreateProject/CreateProjectModal';
import styles from './ProjectList.module.css';

const ProjectList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { projects, loading } = useSelector((state) => state.projects);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleOpenProject = (id) => {
    navigate(`/projects/${id}`);
  };

  const renderContent = () => {
    if (loading && projects.length === 0) {
      return (
        <div className={styles.grid}>
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      );
    }

    return (
      <div className={styles.grid}>
        {projects.map((project) => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            onOpen={() => handleOpenProject(project.id)}
          />
        ))}
        <CreateProjectCard onClick={() => setIsModalOpen(true)} />
      </div>
    );
  };

  return (
    <AppShell>
      <div className={styles.container}>
        <PageHeader 
          title="Projects"
          subtitle="Manage and track your sustainable development goals."
          actions={
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus size={18} />
              New Project
            </Button>
          }
        />

        {renderContent()}

        <CreateProjectModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      </div>
    </AppShell>
  );
};

export default ProjectList;
