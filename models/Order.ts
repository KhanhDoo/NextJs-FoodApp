import mongoose, { Schema, Document, models } from "mongoose";

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  items: IOrderItem[];
  totalPrice: number;
  status: "pending" | "preparing" | "delivering" | "completed" | "cancelled";
}

const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "preparing", "delivering", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true },
);

const Order = models.Order || mongoose.model<IOrder>("Order", OrderSchema);
export default Order;
