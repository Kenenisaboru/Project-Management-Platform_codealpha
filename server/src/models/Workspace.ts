import mongoose, { Schema, Document } from 'mongoose';
import { UserRole } from '../shared/types';

export interface IWorkspace extends Document {
  orgId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  members: { userId: mongoose.Types.ObjectId; role: UserRole }[];
  createdAt: Date;
  updatedAt: Date;
}

const WorkspaceSchema = new Schema<IWorkspace>(
  {
    orgId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    members: [
      {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        role: { type: String, enum: Object.values(UserRole), default: UserRole.MEMBER },
      },
    ],
  },
  { timestamps: true }
);

WorkspaceSchema.index({ orgId: 1 });

export default mongoose.model<IWorkspace>('Workspace', WorkspaceSchema);
