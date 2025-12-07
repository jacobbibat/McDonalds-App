export async function POST(req) {
    const { MongoClient, ObjectId } = require("mongodb");

    const url = "mongodb+srv://b00165639:brightposy@cluster0.ah2kv3o.mongodb.net/?appName=Cluster0";
    const client = new MongoClient(url);

    const data = await req.json();

    await client.connect();
    const db = client.db("McDonalds");

    await db.collection("menu").updateOne(
        { _id: new ObjectId(data._id) },
        {
            $set: {
                name: data.name,
                description: data.description,
                price: parseFloat(data.price),
                category: data.category,
                image: data.image,
                available: data.available
            }
        }
    );

    return Response.json({
        success: true,
        message: "Menu item updated!"
    });
}
