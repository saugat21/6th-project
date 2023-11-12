import CategoryModel from "../models/CategoryModel.js";
import slugify from "slugify";

//CReating category
export const createCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(401).send({ message: 'Name is required' });
        }
        const existingCategory = await CategoryModel.findOne({ name })
        if (existingCategory) {
            return res.status(200).send({
                success: true,
                message: 'Category already Exists'
            })
        }
        const category = await new CategoryModel({ name, slug: slugify(name) }).save();
        res.status(201).send({
            success: true,
            message: 'new category created',
            category
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error in category'
        })
    }
}

//updating category
export const updateCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        const { id } = req.params;
        const category = await CategoryModel.findByIdAndUpdate(id, { name, slug: slugify(name) }, { new: true })
        res.status(200).send({
            success: true,
            message: 'Category Updated Successfully',
            category
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error while updating category'
        })
    }
}

//get all category
export const categoryController = async (req, res) => {
    try {
        const category = await CategoryModel.find({})
        res.status(200).send({
            success: true,
            message: 'All Categories List',
            category
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error while getting all category'
        })
    }
}

//Single Controller
export const singleCategoryController = async (req, res) => {
    try {

        const category = await CategoryModel.findOne({ slug: req.params.slug });
        res.status(200).send({
            success: true,
            message: 'Get single category successfully',
            category
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error while getting single category'
        })
    }
}

//delet controller
export const deleteCategoryController = async (req, res) => {
    try {
        const { id } = req.params;
        await CategoryModel.findByIdAndDelete(id);
        res.status(200).send({
            success: true,
            message: 'category deleted successfully',

        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error while deleting  category'
        })
    }
}