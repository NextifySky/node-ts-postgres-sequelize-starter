import { DataTypes, Optional } from "sequelize";
import sequelize from "../config/db";
import BaseModel from "./BaseModel";
import User from "./user.model";
import Product from "./product.models";

interface OrderAttributes {
  id: number;
  productId: number; // Updated to reference productId directly
  userId: number;
  totalPrice: number;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

interface OrderCreationAttributes
  extends Optional<OrderAttributes, "id" | "createdAt" | "updatedAt"> {}

class Order
  extends BaseModel<OrderAttributes, OrderCreationAttributes>
  implements OrderAttributes
{
  public id!: number;
  public productId!: number; // Updated to reference productId directly
  public userId!: number;
  public totalPrice!: number;
  public quantity!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "products",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
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
    tableName: "orders",
    timestamps: true,
  }
);

Order.belongsTo(User, { foreignKey: "userId" });
Order.belongsToMany(Product, { through: "order_products" });

export default Order;
