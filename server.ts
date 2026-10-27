import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/db";
import authRoutes from "./src/routes/authRoute";
import productRoutes from "./src/routes/productRoute";
import cartRoutes from "./src/routes/cartRoute";
import orderRoutes from "./src/routes/orderRoute";
import uploadRoutes from "./src/routes/uploadRoute";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "E-commerce API is running"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
