export async function POST(req) {
    const { MongoClient } = require("mongodb");

    const url = "mongodb+srv://b00165639:brightposy@cluster0.ah2kv3o.mongodb.net/?appName=Cluster0";
    const client = new MongoClient(url);

    const { title, description, discount, code } = await req.json();

    if (!code || code.trim() === "") {
        return Response.json({ success: false, message: "Promo code is required." });
    }

    await client.connect();
    const db = client.db("McDonalds");

    // Save promotion
    await db.collection("promotions").insertOne({
        title,
        description,
        discount: Number(discount),
        code: code.trim().toUpperCase(),
        active: true,
        createdAt: new Date()
    });

    return Response.json({
        success: true,
        message: "Promotion created successfully!"
    });
}
