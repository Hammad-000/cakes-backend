import express from "express";
import { authMiddleware, authorize } from "../middleware/authMiddleware.js";
import { 
    createProduct, 
    getAllProducts, 
    getProductById, 
    updateProductById, 
    deleteProductById 
} from "../controllers/productController.js";

const router = express.Router();

router.route("/")
  .get(getAllProducts)
  .post(authMiddleware, authorize("admin"), createProduct);

router.route("/:id")
  .get(getProductById)
  .put(authMiddleware, authorize("admin"), updateProductById)
  .delete(authMiddleware, authorize("admin"), deleteProductById);

export default router;