<<<<<<< HEAD
export async function POST(req) {
    const { getSession } = require("@/lib/auth/sessions");
    const session = await getSession();

    if (!session) {
        return Response.json(
            { success: false, message: "Not logged in" },
            { status: 401 }
        );
    }

    const { MongoClient } = require("mongodb");

    const client = new MongoClient(
        "mongodb+srv://b00165639:brightposy@cluster0.ah2kv3o.mongodb.net/?appName=Cluster0"
    );

    await client.connect();
    const db = client.db("McDonalds");

    const userId = String(session.userId);

    const orders = await db.collection("orders")
        .find({ userId })
        .sort({ createdAt: -1 })
        .toArray();

    return Response.json({
        success: true,
        orders
    });
}
=======
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
>>>>>>> 08dd84b4e3d4881e84356a3efff9a8fab9b19d88
