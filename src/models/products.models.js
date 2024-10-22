import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productCollection = "products"

const productScheme = mongoose.Schema ({
    title: {type: String, required: true},
    description: {type: String, required: true},
    code: {type: String, required: true},
    price: {type: Number, required: true},
    stock: {type: Number, required: true},
    category:{type: String, required: true},
    status: {type: Boolean, default: true},
})

productScheme.plugin(mongoosePaginate);
const productModel = mongoose.model(productCollection, productScheme);

export default productModel;