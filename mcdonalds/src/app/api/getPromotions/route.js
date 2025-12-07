<<<<<<< HEAD
export async function GET() {

    const { MongoClient } = require("mongodb");

    const client = new MongoClient(
        "mongodb+srv://b00165639:brightposy@cluster0.ah2kv3o.mongodb.net/?appName=Cluster0"
    );

    await client.connect();
    const db = client.db("McDonalds");

    const promotions = await db.collection("promotions")
        .find({ active: true })
        .toArray();

    return Response.json({
        success: true,
        promotions
    });
}
=======
export async function GET() {
    const { MongoClient } = require("mongodb");

    const url =
        "mongodb+srv://b00165639:brightposy@cluster0.ah2kv3o.mongodb.net/?appName=Cluster0";
    const client = new MongoClient(url);

    await client.connect();
    const db = client.db("McDonalds");

    const promotions = await db.collection("promotions").find({
        active: true
    }).toArray();

    return Response.json({
        success: true,
        promotions
    });
}
>>>>>>> 08dd84b4e3d4881e84356a3efff9a8fab9b19d88
