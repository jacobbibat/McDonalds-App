import { ObjectId } from "mongodb";

export async function POST(req) {

    console.log("in addToCart api");

    const { MongoClient } = require("mongodb");

    const url = 'mongodb+srv://b00165639:brightposy@cluster0.ah2kv3o.mongodb.net/?appName=Cluster0';
    const client = new MongoClient(url);

    await client.connect();
    const db = client.db("McDonalds");
    const cartCollection = db.collection("cart");

    const body = await req.json();
    const { userId, productId } = body;

    console.log("Adding to cart:", userId, productId);

    const userObjectId = new ObjectId(userId);
    const productObjectId = new ObjectId(productId);

    // Does cart exist for this user?
    const existingCart = await cartCollection.findOne({ userId: userObjectId });

    if (!existingCart) {
        // Create a new cart
        const newCart = {
            userId: userObjectId,
            items: [
                { productId: productObjectId, qty: 1 }
            ],
            updatedAt: new Date()
        };

        await cartCollection.insertOne(newCart);

        return Response.json({
            success: true,
            message: "Item added to new cart"
        });
    }

    // Cart exists → update it
    const items = existingCart.items;

    const index = items.findIndex(i => i.productId.toString() === productObjectId.toString());

    if (index > -1) {
        items[index].qty += 1;
    } else {
        items.push({ productId: productObjectId, qty: 1 });
    }

    await cartCollection.updateOne(
        { userId: userObjectId },
        { $set: { items: items, updatedAt: new Date() } }
    );

    return Response.json({
        success: true,
        message: "Item added to cart"
    });
}
