import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PublicRoute from './PublicRoute';
import ProtectedRoute from './ProtectedRoute';
import Login from '../pages/Auth/Login';
import SignUp from '../pages/Auth/SignUp';
import ForgotPassword from '../pages/Auth/ForgotPassword';
import ProjectList from '../pages/Projects/ProjectList/ProjectList';
import ProjectDetail from '../pages/Projects/ProjectDetail/ProjectDetail';
import NewUserStory from '../pages/UserStories/NewUserStory/NewUserStory';
import UserStoryDetail from '../pages/UserStories/UserStoryDetail/UserStoryDetail';
import NewUseCase from '../pages/UseCases/NewUseCase/NewUseCase';
import UseCaseDetail from '../pages/UseCases/UseCaseDetail/UseCaseDetail';
import Dashboard from '../pages/Dashboard/Dashboard';
import Settings from '../pages/Settings/Settings';
import VerifyEmail from '../pages/Auth/VerifyEmail';
import ResetPassword from '../pages/Auth/ResetPassword';

const AppRouter = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Routes>
      <Route path="/" element={
        isAuthenticated ? <Navigate to="/projects" replace /> : <Navigate to="/login" replace />
      } />

      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/projects" element={<ProjectList />} />
        <Route path="/projects/:projectId" element={<ProjectDetail />} />
        <Route path="/projects/:projectId/user-stories/new" element={<NewUserStory />} />
        <Route path="/projects/:projectId/user-stories/:storyId" element={<UserStoryDetail />} />
        <Route path="/projects/:projectId/user-stories/:storyId/use-cases/new" element={<NewUseCase />} />
        <Route path="/projects/:projectId/user-stories/:storyId/use-cases/:useCaseId" element={<UseCaseDetail />} />
        
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
