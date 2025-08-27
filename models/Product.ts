import mongoose, { Schema, Document, models } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  available: boolean;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    category: { type: String, required: true },
    available: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const Product =
  models.Product || mongoose.model<IProduct>("Product", ProductSchema);
export default Product;
