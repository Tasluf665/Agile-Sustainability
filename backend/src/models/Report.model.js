import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    totalUserStories: {
      type: Number,
      default: 0,
    },
    sustainableUserStories: {
      type: Number,
      default: 0,
    },
    totalUseCases: {
      type: Number,
      default: 0,
    },
    sustainableUseCases: {
      type: Number,
      default: 0,
    },
    estimatedCO2Saved: {
      type: Number,
      default: 0,
    },
    focusAreaBreakdown: [
      {
        area: String,
        count: Number,
        co2Saved: Number,
      },
    ],
    periodStart: {
      type: Date,
    },
    periodEnd: {
      type: Date,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

const Report = mongoose.model('Report', reportSchema);

export default Report;
