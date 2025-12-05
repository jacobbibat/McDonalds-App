import { MongoClient, ObjectId } from "mongodb";

export async function POST(req) {

    const url =
        "mongodb+srv://b00165639:brightposy@cluster0.ah2kv3o.mongodb.net/?appName=Cluster0";

    const client = new MongoClient(url);
    await client.connect();

    const db = client.db("McDonalds");
    const orders = db.collection("orders");

    const body = await req.json();
    const { orderId, newStatus } = body;

    await orders.updateOne(
        { _id: new ObjectId(orderId) },
        { $set: { status: newStatus } }
    );

    return Response.json({
        success: true,
        message: "Order status updated!"
    });
}
