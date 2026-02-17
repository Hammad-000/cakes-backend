import Product from "../models/productModel.js";

const getAllProducts = async (req, res) => {

    try {
        const products = await Product.find();
        res.status(200).json({
            message: 'Admin Get All Products Successfully!',
            products
        });
    } catch (error) {
        res.status(500).json({
            message: "Server Error"
        });
    }}

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                message: "Product not found !"
            });  }
        res.status(200).json({
            message: 'Admin Gets Product By Id !',
            product
        });
    } catch (error) {
        res.status(500).json({
            message: "Server Error"
        });
    }
}


const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, isAvailable  } = req.body;
        const product = await Product.create({
            name,description, price,category, isAvailable
        })
        res.status(201).json({
            message: "Product created successfully !",
            product,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server Error"
        });
    }
}

const updateProductById = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product updated successfully!",
            product,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server Error"
        });
    }

}

const deleteProductById = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id)

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product deleted successfully !",
            product,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server  Error"
        });
    }

}

export {
 getProductById,createProduct, updateProductById, deleteProductById,getAllProducts,
 };