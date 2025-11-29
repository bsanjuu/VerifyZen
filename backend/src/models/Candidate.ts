import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database.config';
import User from './User';

interface CandidateAttributes {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  linkedinUrl?: string;
  resumeUrl?: string;
  resumeS3Key?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  metadata?: object;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CandidateCreationAttributes extends Optional<CandidateAttributes, 'id' | 'status'> {}

class Candidate extends Model<CandidateAttributes, CandidateCreationAttributes> implements CandidateAttributes {
  public id!: string;
  public userId!: string;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public phone?: string;
  public linkedinUrl?: string;
  public resumeUrl?: string;
  public resumeS3Key?: string;
  public status!: 'pending' | 'in_progress' | 'completed' | 'failed';
  public metadata?: object;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public readonly user?: User;
}

Candidate.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
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
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    linkedinUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
    resumeUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resumeS3Key: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'in_progress', 'completed', 'failed'),
      defaultValue: 'pending',
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
    },
  },
  {
    sequelize,
    tableName: 'candidates',
    timestamps: true,
    indexes: [
      {
        fields: ['userId'],
      },
      {
        fields: ['email'],
      },
      {
        fields: ['status'],
      },
    ],
  }
);

// Define associations
Candidate.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

User.hasMany(Candidate, {
  foreignKey: 'userId',
  as: 'candidates',
});

export default Candidate;
