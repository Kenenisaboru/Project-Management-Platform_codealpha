import mongoose, { Schema, Document } from 'mongoose';
import { ProjectStatus } from '../shared/types';

export interface IProject extends Document {
  workspaceId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  status: ProjectStatus;
  ownerId: mongoose.Types.ObjectId;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    status: {
      type: String,
      enum: Object.values(ProjectStatus),
      default: ProjectStatus.PLANNING,
    },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  { timestamps: true }
);

ProjectSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
  }
});

ProjectSchema.index({ workspaceId: 1 });
ProjectSchema.index({ ownerId: 1 });

export default mongoose.model<IProject>('Project', ProjectSchema);
