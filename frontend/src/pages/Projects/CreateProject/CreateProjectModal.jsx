import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Zap, Database, Truck, Recycle } from 'lucide-react';
import { createProject } from '../../../store/slices/projectsSlice';
import Modal from '../../../components/common/Modal/Modal';
import Input from '../../../components/common/Input/Input';
import Select from '../../../components/common/Select/Select';
import Textarea from '../../../components/common/Textarea/Textarea';
import Button from '../../../components/common/Button/Button';
import FocusAreaTag from '../../../components/sustainability/FocusAreaTag/FocusAreaTag';
import styles from './CreateProjectModal.module.css';

const CreateProjectModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.projects);
  
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    description: '',
    goals: '',
    focusAreas: []
  });

  const [errors, setErrors] = useState({});

  const FOCUS_AREAS = [
    { id: 'energy', label: 'ENERGY', icon: Zap, color: '#10b981' },
    { id: 'data', label: 'DATA', icon: Database, color: '#3b82f6' },
    { id: 'logistics', label: 'LOGISTICS', icon: Truck, color: '#f59e0b' },
    { id: 'lifecycle', label: 'LIFECYCLE', icon: Recycle, color: '#6366f1' }
  ];

  const INDUSTRIES = [
    { value: 'Tech', label: 'Technology & Software' },
    { value: 'Retail', label: 'Retail & E-commerce' },
    { value: 'Manufacturing', label: 'Manufacturing' },
    { value: 'Logistics', label: 'Transport & Logistics' }
  ];

  const handleToggleFocusArea = (area) => {
    const isAlreadySelected = formData.focusAreas.some(fa => fa.label === area.label);
    if (isAlreadySelected) {
      setFormData({
        ...formData,
        focusAreas: formData.focusAreas.filter(fa => fa.label !== area.label)
      });
    } else {
      setFormData({
        ...formData,
        focusAreas: [...formData.focusAreas, { label: area.label, color: area.color }]
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Project name is required';
    if (!formData.industry) newErrors.industry = 'Industry is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (formData.focusAreas.length === 0) newErrors.focusAreas = 'Select at least one focus area';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      const resultAction = await dispatch(createProject(formData));
      if (createProject.fulfilled.match(resultAction)) {
        onClose();
        setFormData({ name: '', industry: '', description: '', goals: '', focusAreas: [] });
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Project">
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input 
          label="Project Name"
          placeholder="e.g. Sustainable Supply Chain"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          error={errors.name}
        />

        <Select 
          label="Industry"
          placeholder="Select industry"
          options={INDUSTRIES}
          value={formData.industry}
          onChange={(e) => setFormData({...formData, industry: e.target.value})}
          error={errors.industry}
        />

        <Textarea 
          label="Description"
          placeholder="Briefly describe the project scope and purpose..."
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          error={errors.description}
        />

        <div className={styles.focusAreaSection}>
          <label className={styles.fieldLabel}>Focus Areas</label>
          <div className={styles.tagGrid}>
            {FOCUS_AREAS.map(area => (
              <FocusAreaTag 
                key={area.id}
                label={area.label}
                icon={area.icon}
                isSelected={formData.focusAreas.some(fa => fa.label === area.label)}
                onToggle={() => handleToggleFocusArea(area)}
              />
            ))}
          </div>
          {errors.focusAreas && <p className={styles.error}>{errors.focusAreas}</p>}
        </div>

        <Textarea 
          label="Sustainability Goals"
          placeholder="What are the key environmental or social targets?"
          value={formData.goals}
          onChange={(e) => setFormData({...formData, goals: e.target.value})}
          rows={3}
        />

        <div className={styles.actions}>
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={loading}>
            Create Project
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateProjectModal;
