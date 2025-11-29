import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database.config';

interface CompanyAttributes {
  id: string;
  name: string;
  domain?: string;
  foundedYear?: number;
  status: 'active' | 'inactive' | 'acquired' | 'closed' | 'unknown';
  industry?: string;
  size?: string;
  linkedinUrl?: string;
  website?: string;
  verified: boolean;
  metadata?: object;
  lastVerifiedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CompanyCreationAttributes extends Optional<CompanyAttributes, 'id' | 'status' | 'verified'> {}

class Company extends Model<CompanyAttributes, CompanyCreationAttributes> implements CompanyAttributes {
  public id!: string;
  public name!: string;
  public domain?: string;
  public foundedYear?: number;
  public status!: 'active' | 'inactive' | 'acquired' | 'closed' | 'unknown';
  public industry?: string;
  public size?: string;
  public linkedinUrl?: string;
  public website?: string;
  public verified!: boolean;
  public metadata?: object;
  public lastVerifiedAt?: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Company.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    domain: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    foundedYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1800,
        max: new Date().getFullYear(),
      },
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'acquired', 'closed', 'unknown'),
      defaultValue: 'unknown',
    },
    industry: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    size: {
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
    website: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
    },
    lastVerifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'companies',
    timestamps: true,
    indexes: [
      {
        fields: ['name'],
      },
      {
        fields: ['domain'],
      },
      {
        fields: ['status'],
      },
    ],
  }
);

export default Company;
