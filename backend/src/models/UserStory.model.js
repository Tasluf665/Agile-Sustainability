import mongoose from 'mongoose';

const userStorySchema = new mongoose.Schema(
  {
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
    originalDescription: {
      type: String,
      required: [true, 'Please add the original description'],
    },
    sustainableDescription: {
      type: String,
      default: '',
    },
    acceptanceCriteria: {
      type: [String],
      default: [],
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'MEDIUM',
    },
    feature: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['DRAFT', 'IN_REVIEW', 'APPROVED'],
      default: 'DRAFT',
    },
    aiGenerated: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const UserStory = mongoose.model('UserStory', userStorySchema);

export default UserStory;
