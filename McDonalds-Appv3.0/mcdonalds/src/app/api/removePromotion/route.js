export async function POST(req) {
    try {
        const { MongoClient } = require("mongodb");

        const url =
            "mongodb+srv://b00165639:brightposy@cluster0.ah2kv3o.mongodb.net/?appName=Cluster0";
        const client = new MongoClient(url);

        const { userId } = await req.json();

        if (!userId) {
            return Response.json({
                success: false,
                message: "Missing userId"
            });
        }

        await client.connect();
        const db = client.db("McDonalds");

        // Remove promotion from cart
        await db.collection("cart").updateOne(
            { userId },
            { $unset: { appliedPromotion: "" } }
        );

        return Response.json({
            success: true,
            message: "Promotion removed."
        });
    } catch (err) {
        console.error("removePromotion error:", err);
        return Response.json({
            success: false,
            message: "Server error removing promotion."
        });
    }
}
