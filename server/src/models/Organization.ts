import mongoose, { Schema, Document } from 'mongoose';

export interface IOrganization extends Document {
  name: string;
  slug: string;
  ownerId: mongoose.Types.ObjectId;
  settings?: Record<string, any>;
  subscriptionTier?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrganizationSchema = new Schema<IOrganization>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true, trim: true },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    settings: { type: Schema.Types.Mixed, default: {} },
    subscriptionTier: { type: String, default: 'free' },
  },
  { timestamps: true }
);

OrganizationSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
  }
});

// Index for quick lookup by slug
OrganizationSchema.index({ slug: 1 });

export default mongoose.model<IOrganization>('Organization', OrganizationSchema);
