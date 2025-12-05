import { ObjectId } from "mongodb";

export async function POST(req) {

    console.log("in removeFromCart api");

    const { MongoClient } = require("mongodb");

    const url = 'mongodb+srv://b00165639:brightposy@cluster0.ah2kv3o.mongodb.net/?appName=Cluster0';
    const client = new MongoClient(url);

    await client.connect();
    const db = client.db("McDonalds");

    const cartCollection = db.collection("cart");

    const body = await req.json();
    const { userId, productId } = body;

    const userObjectId = new ObjectId(userId);
    const productObjectId = new ObjectId(productId);

    await cartCollection.updateOne(
        { userId: userObjectId },
        { $pull: { items: { productId: productObjectId } } }
    );

    return Response.json({
        success: true,
        message: "Item removed from cart"
    });
}
