import mongoose from 'mongoose';

const useCaseSchema = new mongoose.Schema(
  {
    userStoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserStory',
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    actor: {
      type: String,
      required: true,
    },
    precondition: {
      type: String,
      default: '',
    },
    mainFlow: {
      type: [String],
      default: [],
    },
    postcondition: {
      type: String,
      default: '',
    },
    sustainableTitle: {
      type: String,
      default: '',
    },
    sustainableFlow: {
      type: [String],
      default: [],
    },
    sustainabilityNotes: {
      type: String,
      default: '',
    },
    co2SavingPerHour: {
      type: Number,
      default: 0,
    },
    dimension: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      default: 'ACTIVE',
    },
  },
  {
    timestamps: true,
  }
);

const UseCase = mongoose.model('UseCase', useCaseSchema);

export default UseCase;
