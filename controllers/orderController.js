import { Order, OrderItem, Product, Cart, CartItem } from "../models/index.js";

export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    // Check if the cart has items
    const cart = await Cart.findOne({
      where: { userId },
      include: { model: CartItem, as: "items", include: [Product] },
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    // Calculate total amount
    let totalAmount = 0;
    cart.items.forEach((item) => {
      totalAmount += item.quantity * item.Product.price;
    });

    // Create order
    const order = await Order.create({ userId, totalAmount });

    // Add order items and reduce stock
    for (const item of cart.items) {
      await OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.Product.price,
      });

      // Update product stock
      const product = await Product.findByPk(item.productId);
      product.stock -= item.quantity;
      await product.save();
    }

    // Clear cart after order is placed
    await CartItem.destroy({ where: { cartId: cart.id } });

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    console.error("Order Placement Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const viewOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch orders with order items and product details
    const orders = await Order.findAll({
      where: { userId },
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              attributes: ["id", "name", "price", "imageUrl"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error" });
  }
};
