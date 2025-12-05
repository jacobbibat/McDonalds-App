import { ObjectId } from "mongodb";

export async function POST(req) {

    console.log("in getOrders api");

    const { MongoClient } = require("mongodb");

    const url =
        "mongodb+srv://b00165639:brightposy@cluster0.ah2kv3o.mongodb.net/?appName=Cluster0";
    const client = new MongoClient(url);

    await client.connect();
    const db = client.db("McDonalds");

    const ordersCollection = db.collection("orders");

    // Read request body
    const body = await req.json();
    const { userId } = body;

    console.log("Fetching orders for:", userId);

    const userObjectId = new ObjectId(userId);

    // Find all orders for this user
    const orders = await ordersCollection
        .find({ userId: userObjectId })
        .sort({ createdAt: -1 })
        .toArray();

    if (orders.length === 0) {
        return Response.json({
            success: false,
            message: "You have no orders."
        });
    }

    return Response.json({
        success: true,
        orders: orders
    });
}
