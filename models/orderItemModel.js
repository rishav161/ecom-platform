import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
// import Order from "./orderModel.js";
// import Product from "./productModel.js";

const OrderItem = sequelize.define("OrderItem", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  orderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: "Orders", key: "id" },
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: "Products", key: "id" },
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

export default OrderItem;
