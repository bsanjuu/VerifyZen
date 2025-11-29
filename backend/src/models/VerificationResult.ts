import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database.config';
import Candidate from './Candidate';
import User from './User';

interface VerificationResultAttributes {
  id: string;
  candidateId: string;
  userId: string;
  verificationType: 'full' | 'employment' | 'education' | 'linkedin' | 'timeline';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  riskScore: number;
  findings: object;
  timeline: object;
  employment: object;
  education: object;
  linkedinVerification: object;
  documentAnalysis: object;
  flags: string[];
  recommendations: string[];
  reportUrl?: string;
  reportS3Key?: string;
  executionArn?: string;
  priority: 'low' | 'normal' | 'high';
  startedAt?: Date;
  completedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface VerificationResultCreationAttributes
  extends Optional<VerificationResultAttributes, 'id' | 'status' | 'riskScore' | 'findings' | 'timeline' | 'employment' | 'education' | 'linkedinVerification' | 'documentAnalysis' | 'flags' | 'recommendations' | 'priority'> {}

class VerificationResult extends Model<VerificationResultAttributes, VerificationResultCreationAttributes>
  implements VerificationResultAttributes {
  public id!: string;
  public candidateId!: string;
  public userId!: string;
  public verificationType!: 'full' | 'employment' | 'education' | 'linkedin' | 'timeline';
  public status!: 'pending' | 'in_progress' | 'completed' | 'failed';
  public riskScore!: number;
  public findings!: object;
  public timeline!: object;
  public employment!: object;
  public education!: object;
  public linkedinVerification!: object;
  public documentAnalysis!: object;
  public flags!: string[];
  public recommendations!: string[];
  public reportUrl?: string;
  public reportS3Key?: string;
  public executionArn?: string;
  public priority!: 'low' | 'normal' | 'high';
  public startedAt?: Date;
  public completedAt?: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public readonly candidate?: Candidate;
  public readonly user?: User;
}

VerificationResult.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    candidateId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'candidates',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    verificationType: {
      type: DataTypes.ENUM('full', 'employment', 'education', 'linkedin', 'timeline'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'in_progress', 'completed', 'failed'),
      defaultValue: 'pending',
    },
    riskScore: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100,
      },
    },
    findings: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    timeline: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    employment: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    education: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    linkedinVerification: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    documentAnalysis: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    flags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    recommendations: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    reportUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    reportS3Key: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    executionArn: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    priority: {
      type: DataTypes.ENUM('low', 'normal', 'high'),
      defaultValue: 'normal',
    },
    startedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'verification_results',
    timestamps: true,
    indexes: [
      {
        fields: ['candidateId'],
      },
      {
        fields: ['userId'],
      },
      {
        fields: ['status'],
      },
      {
        fields: ['verificationType'],
      },
      {
        fields: ['riskScore'],
      },
    ],
  }
);

// Define associations
VerificationResult.belongsTo(Candidate, {
  foreignKey: 'candidateId',
  as: 'candidate',
});

VerificationResult.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

Candidate.hasMany(VerificationResult, {
  foreignKey: 'candidateId',
  as: 'verifications',
});

User.hasMany(VerificationResult, {
  foreignKey: 'userId',
  as: 'verifications',
});

export default VerificationResult;
