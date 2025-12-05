import { ObjectId } from "mongodb";

export async function POST(req) {

    const { MongoClient } = require("mongodb");

    const url = 'mongodb+srv://b00165639:brightposy@cluster0.ah2kv3o.mongodb.net/?appName=Cluster0';
    const client = new MongoClient(url);

    await client.connect();
    const db = client.db("McDonalds");

    const cartCollection = db.collection("cart");
    const ordersCollection = db.collection("orders");
    const menu = db.collection("menu");

    const body = await req.json();
    const { userId } = body;

    const userObjectId = new ObjectId(userId);

    // Load user's cart
    const cart = await cartCollection.findOne({ userId: userObjectId });

    if (!cart || cart.items.length === 0) {
        return Response.json({
            success: false,
            message: "Cart is empty."
        });
    }

    // Build the order items with prices
    const orderItems = [];

    for (let item of cart.items) {
        const product = await menu.findOne({ _id: item.productId });

        orderItems.push({
            productId: item.productId,
            qty: item.qty,
            price: Number(product.price),
            name: product.name
        });
    }

    // Calculate total
    const total = orderItems.reduce((sum, item) =>
        sum + item.qty * item.price, 0);

    // Insert order into database
    await ordersCollection.insertOne({
        userId: userObjectId,
        items: orderItems,
        total: total,
        status: "pending",
        createdAt: new Date()
    });

    // Empty the cart
    await cartCollection.updateOne(
        { userId: userObjectId },
        { $set: { items: [] } }
    );

    return Response.json({
        success: true,
        message: "Order placed successfully!"
    });
}
