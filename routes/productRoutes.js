import express from "express";
import {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getProducts, 
} from "../controllers/productController.js";
import upload from "../middleware/multer.js"; 
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management APIs
 */

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: image
 *         type: file
 *         description: Product image
 *     responses:
 *       201:
 *         description: Product created successfully
 */
router.post("/", upload.single("image"), createProduct);

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of all products
 */
router.get("/", getAllProducts);

/**
 * @swagger
 * /api/products/filter:
 *   get:
 *     summary: Get filtered products (price range, category, search, pagination)
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter products by category
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search products by name
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         description: Pagination - page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         description: Pagination - number of items per page
 *     responses:
 *       200:
 *         description: List of filtered products
 */
router.get("/filter", getProducts); // Changed from "/" to "/filter"

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product to update
 *     responses:
 *       200:
 *         description: Product updated successfully
 */
router.put("/:id", upload.single("image"), updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product to delete
 *     responses:
 *       200:
 *         description: Product deleted successfully
 */
router.delete("/:id", deleteProduct);

export default router;
