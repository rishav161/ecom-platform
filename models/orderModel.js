import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
// import User from "./Users.js";

const Order = sequelize.define("Order", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: "Users", key: "id" },
  },
  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("pending", "completed", "canceled"),
    defaultValue: "pending",
  },
});

export default Order;
