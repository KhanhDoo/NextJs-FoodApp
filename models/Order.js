import { Schema, model, models, Types } from "mongoose";


const OrderSchema = new Schema(
{
userId: { type: Types.ObjectId, ref: "User", required: true },
items: [
{
productId: { type: Types.ObjectId, ref: "Product", required: true },
quantity: { type: Number, required: true, min: 1 },
price: { type: Number, required: true, min: 0 },
},
],
totalPrice: { type: Number, required: true, min: 0 },
status: { type: String, enum: ["pending", "preparing", "delivered"], default: "pending" },
},
{ timestamps: true }
);
export default models.Order || model("Order", OrderSchema);