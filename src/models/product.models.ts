import { DataTypes, Optional } from "sequelize";
import sequelize from "../config/db";
import BaseModel from "./BaseModel";

interface ProductAttributes {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
  isAvailable: boolean;
  rating: number;
  pdfUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ProductCreationAttributes
  extends Optional<ProductAttributes, "id" | "createdAt" | "updatedAt"> {}

class Product
  extends BaseModel<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes
{
  public id!: number;
  public name!: string;
  public description!: string;
  public pdfUrl!: string;
  public rating!: number;
  public price!: number;
  public stock!: number;
  public category!: string;
  public imageUrl!: string;
  public isAvailable!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    rating: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    pdfUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "products",
    timestamps: true, // Handles createdAt and updatedAt
  }
);

export default Product;
