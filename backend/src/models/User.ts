import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database.config';
import bcrypt from 'bcrypt';

interface UserAttributes {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  company: string;
  role: 'admin' | 'recruiter' | 'viewer';
  subscription: 'free' | 'basic' | 'pro' | 'enterprise';
  subscriptionStatus: 'active' | 'inactive' | 'cancelled' | 'trial';
  stripeCustomerId?: string;
  apiKey?: string;
  emailVerified: boolean;
  lastLoginAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'role' | 'subscription' | 'subscriptionStatus' | 'emailVerified'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public email!: string;
  public password!: string;
  public firstName!: string;
  public lastName!: string;
  public company!: string;
  public role!: 'admin' | 'recruiter' | 'viewer';
  public subscription!: 'free' | 'basic' | 'pro' | 'enterprise';
  public subscriptionStatus!: 'active' | 'inactive' | 'cancelled' | 'trial';
  public stripeCustomerId?: string;
  public apiKey?: string;
  public emailVerified!: boolean;
  public lastLoginAt?: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Instance methods
  public async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }

  public toJSON(): object {
    const values = { ...this.get() };
    delete values.password;
    return values;
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    company: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('admin', 'recruiter', 'viewer'),
      defaultValue: 'recruiter',
    },
    subscription: {
      type: DataTypes.ENUM('free', 'basic', 'pro', 'enterprise'),
      defaultValue: 'free',
    },
    subscriptionStatus: {
      type: DataTypes.ENUM('active', 'inactive', 'cancelled', 'trial'),
      defaultValue: 'trial',
    },
    stripeCustomerId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    apiKey: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

export default User;
