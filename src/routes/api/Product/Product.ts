import mongoose, { Model, model, ObjectId } from 'mongoose';

const Schema = mongoose.Schema;

interface IProduct {
    name: string;
    description: string;
    price: number;
    _id: ObjectId;
}
const ProductSchema = new Schema<IProduct>({
    name: { type: String, required: true},
    description: { type: String, required: true},
    price: { type: Number, required: true},
});


const ProductModel: Model<IProduct> = model<IProduct>('Product', ProductSchema, 'product');

export default ProductModel;

