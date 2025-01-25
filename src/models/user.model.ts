import { DataTypes, Optional } from "sequelize";
import BaseModel from "./BaseModel";
import sequelize from "../config/db";

interface UserAttributes {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  password: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

interface UserCreationAttributes
  extends Optional<UserAttributes, "id" | "createdAt" | "updatedAt"> {}

class User
  extends BaseModel<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public role!: string;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public password!: string;
  public status!: string;
  public phone!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    role: {
      type: DataTypes.ENUM("mechanic", "customer"),
      defaultValue: "customer",
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "active",
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true,
  }
);

export default User;
