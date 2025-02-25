import { v2 as cloudinary } from "cloudinary";
import { Product, Category } from "../models/index.js";
import { Op } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, categoryId } = req.body;

    if (!name || !price || !stock || !categoryId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "ecom-products",
    });

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      categoryId,
      imageUrl: result.secure_url,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc Get all products with category details
 * @route GET /products
 */
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        {
          model: Category,
          as: "category", 
          attributes: ["id", "name"], 
        },
      ],
    });
    res.json(products);
  } catch (error) {
    console.error("Fetch Products Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, categoryId } = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      product.imageUrl = result.secure_url;
    }

    // Update product details
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.stock = stock || product.stock;
    product.categoryId = categoryId || product.categoryId;

    await product.save();
    res.json(product);
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.destroy();
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getProducts = async (req, res) => {
  try {
    const { search, categoryId, minPrice, maxPrice, page = 1, limit = 10 } = req.query;

    const whereClause = {};

    if (search) {
      whereClause.name = { [Op.iLike]: `%${search}%` };
    }
    if (categoryId) {
      whereClause.categoryId = categoryId;
    }
    if (minPrice && maxPrice) {
      whereClause.price = { [Op.between]: [parseFloat(minPrice), parseFloat(maxPrice)] };
    } else if (minPrice) {
      whereClause.price = { [Op.gte]: parseFloat(minPrice) };
    } else if (maxPrice) {
      whereClause.price = { [Op.lte]: parseFloat(maxPrice) };
    }

    const offset = (page - 1) * limit;

    const products = await Product.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: offset,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Category,
          as: "category", // ✅ Ensure alias is used
          attributes: ["id", "name"],
        },
      ],
    });

    res.status(200).json({
      total: products.count,
      totalPages: Math.ceil(products.count / limit),
      currentPage: parseInt(page),
      products: products.rows,
    });
  } catch (error) {
    console.error("Fetch Products Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
