import mongoose from 'mongoose';

const aiSuggestionSchema = new mongoose.Schema(
  {
    refId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'refType',
    },
    refType: {
      type: String,
      required: true,
      enum: ['UserStory', 'UseCase'],
    },
    inputText: {
      type: String,
      required: true,
    },
    outputText: {
      type: String,
      required: true,
    },
    outputAcceptanceCriteria: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    outputMainFlow: {
      type: [String],
      default: [],
    },
    sustainabilityNotes: {
      type: String,
      default: '',
    },
    co2Impact: {
      type: String,
      default: '',
    },
    dimension: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
      default: 'PENDING',
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: {
      type: Date,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

const AISuggestion = mongoose.model('AISuggestion', aiSuggestionSchema);

export default AISuggestion;
