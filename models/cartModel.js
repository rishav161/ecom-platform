import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Product from "./productModel.js";

const Cart = sequelize.define("Cart", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1,
    },
  },
});

// Define relationships
Cart.belongsTo(Product, { foreignKey: "productId", as: "product" });

export default Cart;
