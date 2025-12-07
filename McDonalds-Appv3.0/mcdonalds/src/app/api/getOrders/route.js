export async function POST(req) {
    console.log("in getOrders api");

    const { MongoClient } = require("mongodb");

    const url =
        "mongodb+srv://b00165639:brightposy@cluster0.ah2kv3o.mongodb.net/?appName=Cluster0";
    const client = new MongoClient(url);

    await client.connect();
    const db = client.db("McDonalds");
    const ordersCollection = db.collection("orders");

    // Read body
    const { userId } = await req.json();

    console.log("Fetching orders for user:", userId);

    // userId is stored as STRING
    const orders = await ordersCollection
        .find({ userId: userId }) // <–– match string directly
        .sort({ createdAt: -1 })
        .toArray();

    if (!orders || orders.length === 0) {
        return Response.json({
            success: false,
            message: "You have no orders."
        });
    }

    return Response.json({
        success: true,
        orders
    });
}
