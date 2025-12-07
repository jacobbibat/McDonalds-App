export async function POST(req) {
    const { MongoClient } = require("mongodb");

    const url = "mongodb+srv://b00165639:brightposy@cluster0.ah2kv3o.mongodb.net/?appName=Cluster0";
    const client = new MongoClient(url);

    const { name, description, price, category, image, available } = await req.json();

    await client.connect();
    const db = client.db("McDonalds");

    await db.collection("menu").insertOne({
        name,
        description,
        price: parseFloat(price),
        category,
        image: image || "",
        available,
        createdAt: new Date()
    });

    return Response.json({
        success: true,
        message: "Menu item added!"
    });
}
