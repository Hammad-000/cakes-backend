import Product from "../models/productModel.js";

// Get all products with pagination
const getAllProducts = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10
        const products = await Product.find()
            .skip((page - 1) * limit) // Skip products based on current page
            .limit(limit); // Limit the number of products per page

        const totalProducts = await Product.countDocuments(); // Count total products for pagination
        const totalPages = Math.ceil(totalProducts / limit); // Calculate total pages

        res.status(200).json({
            message: 'Admin Get All Products Successfully!',
            products,
            pagination: {
                totalProducts,
                totalPages,
                currentPage: page,
                pageSize: limit,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message,
        });
    }
};

// Get a product by ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                message: "Product not found!",
            });
        }
        res.status(200).json({
            message: 'Admin Gets Product By Id!',
            product,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message,
        });
    }
};

// Create a new product
const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, isAvailable, imageUrl } = req.body;

        // Validate required fields
        if (!name || !description || !price || !category || !imageUrl) {
            return res.status(400).json({
                message: "All fields are required (name, description, price, category, imageUrl).",
            });
        }

        // Create new product
        const product = await Product.create({
            name,
            description,
            price,
            category,
            isAvailable,
            imageUrl,
        });

        res.status(201).json({
            message: "Product created successfully!",
            product,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message,
        });
    }
};

// Update a product by ID
const updateProductById = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true } // Ensure schema validation on update
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        res.status(200).json({
            message: "Product updated successfully!",
            product,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message,
        });
    }
};

// Delete a product by ID (soft delete version)
const deleteProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        // Soft delete: Set `isAvailable` to false instead of deleting from DB
        product.isAvailable = false;
        await product.save();

        res.status(200).json({
            message: "Product deleted successfully!",
            product,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message,
        });
    }
};

export {
    getProductById,
    createProduct,
    updateProductById,
    deleteProductById,
    getAllProducts,
};