import Product from "../models/productModel.js";

const getAllProducts = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    if (page < 1) page = 1; 
    if (limit > 100) limit = 100; 

    const products = await Product.find()
      .skip((page - 1) * limit)
      .limit(limit);
    const totalProducts = await Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit);

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

const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, isAvailable, imageUrl, originalPrice, rating } = req.body;

    if (!name || !description || !price || !category || !imageUrl) {
      return res.status(400).json({
        message: "All fields are required (name, description, price, category, imageUrl).",
      });
    }

    const product = await Product.create({
      title: name, 
      description,
      price,
      category,
      isAvailable,
      image: imageUrl, 
      originalPrice,
      rating,
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

const updateProductById = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
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

const deleteProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

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