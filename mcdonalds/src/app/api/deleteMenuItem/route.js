export async function POST(req) {
    const { MongoClient, ObjectId } = require("mongodb");

    const url = "mongodb+srv://b00165639:brightposy@cluster0.ah2kv3o.mongodb.net/?appName=Cluster0";
    const client = new MongoClient(url);

    const { id } = await req.json();

    await client.connect();
    const db = client.db("McDonalds");

    await db.collection("menu").deleteOne({ _id: new ObjectId(id) });

    return Response.json({
        success: true,
        message: "Menu item deleted."
    });
}
