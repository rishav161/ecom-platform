import express from "express";
import { addToCart, removeFromCart, viewCart } from "../controllers/cartController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Shopping Cart
 *   description: Shopping cart management APIs
 */

/**
 * @swagger
 * /api/cart/add:
 *   post:
 *     summary: Add an item to the cart
 *     tags: [Shopping Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *               productId:
 *                 type: integer
 *                 example: 101
 *               quantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Item added to cart successfully
 *       400:
 *         description: Bad request
 */
router.post("/add", addToCart);

/**
 * @swagger
 * /api/cart/remove:
 *   post:
 *     summary: Remove an item from the cart
 *     tags: [Shopping Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *               productId:
 *                 type: integer
 *                 example: 101
 *     responses:
 *       200:
 *         description: Item removed from cart successfully
 *       400:
 *         description: Bad request
 */
router.post("/remove", removeFromCart);

/**
 * @swagger
 * /api/cart/{userId}:
 *   get:
 *     summary: View user's cart
 *     tags: [Shopping Cart]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: ID of the user whose cart needs to be viewed
 *     responses:
 *       200:
 *         description: User's cart retrieved successfully
 *       404:
 *         description: Cart not found
 */
router.get("/:userId", viewCart);

export default router;
