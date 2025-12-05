export async function POST(req) {
    const { MongoClient } = require("mongodb");

    const url = "mongodb+srv://b00165639:brightposy@cluster0.ah2kv3o.mongodb.net/?appName=Cluster0";
    const client = new MongoClient(url);

    const { userId } = await req.json();

    await client.connect();
    const db = client.db("McDonalds");

    // Fetch cart
    const cart = await db.collection("cart").findOne({ userId });

    if (!cart || !cart.items || cart.items.length === 0) {
        return Response.json({ success: false, message: "Cart is empty" });
    }

    // Calculate totals
    const total = cart.items.reduce((sum, item) => sum + item.qty * item.price, 0);

    // Create order
    const order = {
        userId,
        items: cart.items,
        total,
        status: "pending",
        createdAt: new Date()
    };

    await db.collection("orders").insertOne(order);

    // Clear the cart
    await db.collection("cart").updateOne(
        { userId },
        { $set: { items: [], updatedAt: new Date() } }
    );

    return Response.json({
        success: true,
        message: "Order placed successfully",
        orderId: order._id
    });
}
