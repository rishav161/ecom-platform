import { Cart, Product, User } from "../models/index.js";

export const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || !quantity) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if the product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the user already has the product in the cart
    let cartItem = await Cart.findOne({ where: { userId, productId } });

    if (cartItem) {
      // Update the quantity if the product already exists in the cart
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      // Create a new cart entry
      cartItem = await Cart.create({ userId, productId, quantity });
    }

    res.status(200).json({ message: "Product added to cart", cartItem });
  } catch (error) {
    console.error("Add to Cart Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Remove Item from Cart
export const removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find the cart item
    const cartItem = await Cart.findOne({ where: { userId, productId } });

    if (!cartItem) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    await cartItem.destroy();
    res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Remove from Cart Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// View Cart
export const viewCart = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const cartItems = await Cart.findAll({
      where: { userId },
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["id", "name", "price", "imageUrl"],
        },
      ],
    });

    res.status(200).json(cartItems);
  } catch (error) {
    console.error("View Cart Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
