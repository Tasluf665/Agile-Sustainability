import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a project name'],
      trim: true,
    },
    industry: {
      type: String,
      required: [true, 'Please specify the industry'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    sustainabilityGoals: {
      type: String,
      required: [true, 'Please define sustainability goals'],
    },
    focusAreas: {
      type: [String],
      enum: ['ENERGY', 'WATER', 'WASTE', 'DATA', 'LOGISTICS', 'LIFECYCLE'],
      default: [],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model('Project', projectSchema);

export default Project;
