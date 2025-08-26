import { Schema, model, models } from "mongoose";


const ProductSchema = new Schema(
{
name: { type: String, required: true },
description: String,
price: { type: Number, required: true },
imageUrl: String,
category: String,
available: { type: Boolean, default: true },
},
{ timestamps: true }
);
export default models.Product || model("Product", ProductSchema);