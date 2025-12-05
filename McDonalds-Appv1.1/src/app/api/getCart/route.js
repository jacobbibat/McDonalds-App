import { ObjectId } from "mongodb";

export async function POST(req) {

    console.log("in getCart api");

    const { MongoClient } = require("mongodb");

    const url = 'mongodb+srv://b00165639:brightposy@cluster0.ah2kv3o.mongodb.net/?appName=Cluster0';
    const client = new MongoClient(url);

    await client.connect();
    const db = client.db("McDonalds");

    const cartCollection = db.collection("cart");
    const menu = db.collection("menu");

    const body = await req.json();
    const { userId } = body;

    const userObjectId = new ObjectId(userId);

    const cart = await cartCollection.findOne({ userId: userObjectId });

    if (!cart) {
        return Response.json({
            success: false,
            message: "Cart is empty"
        });
    }

    // Build detailed cart items including name & price
    const detailedItems = [];

    for (let item of cart.items) {
        const product = await menu.findOne({ _id: item.productId });

        detailedItems.push({
            productId: item.productId,
            qty: item.qty,
            name: product.name,
            price: Number(product.price)
        });
    }

    return Response.json({
        success: true,
        cart: {
            userId: userId,
            items: detailedItems
        }
    });
}
