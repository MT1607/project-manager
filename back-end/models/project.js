import mongoose, { Schema } from 'mongoose';

export const projectSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    workspace: {
      type: Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
    },
    status: {
      type: String,
      enum: ['Planning', 'In Progress', 'On Hold', 'Completed', 'Cancelled'],
      default: 'Planning',
    },
    startDate: { type: Date },
    dueDate: { type: Date },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
    members: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        role: {
          type: String,
          enum: ['manager', 'contributor', 'viewer'],
          default: 'contributor',
        },
      },
    ],
    tags: [{ type: String }],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Project = mongoose.model('Project', projectSchema);
export default Project;
