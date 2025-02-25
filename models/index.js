import sequelize from "../config/db.js";
import User from "./Users.js";
import Product from "./productModel.js";
import Category from "./categoryModel.js";
import Cart from "./cartModel.js";
import Order from "./orderModel.js";
import OrderItem from "./orderItemModel.js";

// Define relationships
User.hasMany(Cart, { foreignKey: "userId", as: "cartItems" });
Cart.belongsTo(User, { foreignKey: "userId", as: "user" });

Product.hasMany(Cart, { foreignKey: "productId", as: "cartItems" });
Cart.belongsTo(Product, { foreignKey: "productId", as: "cartProduct" }); // ✅ Changed alias

Category.hasMany(Product, { foreignKey: "categoryId", as: "products" });
Product.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

User.hasMany(Order, { foreignKey: "userId" });
Order.belongsTo(User, { foreignKey: "userId" });

Order.hasMany(OrderItem, { foreignKey: "orderId", as: "items" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });

Product.hasMany(OrderItem, { foreignKey: "productId" });
OrderItem.belongsTo(Product, { foreignKey: "productId", as: "orderProduct" }); 

export { sequelize, User, Product, Category, Cart, Order, OrderItem };
