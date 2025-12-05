import { MongoClient } from "mongodb";

export async function GET() {

    console.log("in getAllOrders api");

    const url =
        "mongodb+srv://b00165639:brightposy@cluster0.ah2kv3o.mongodb.net/?appName=Cluster0";

    const client = new MongoClient(url);

    await client.connect();
    const db = client.db("McDonalds");

    const orders = db.collection("orders");

    const allOrders = await orders
        .find({})
        .sort({ createdAt: -1 })
        .toArray();

    return Response.json({
        success: true,
        orders: allOrders
    });
}
