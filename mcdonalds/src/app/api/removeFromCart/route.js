export async function POST(req) {
    try {
        const { MongoClient } = require("mongodb");

        const url = "mongodb+srv://b00165639:brightposy@cluster0.ah2kv3o.mongodb.net/?appName=Cluster0";
        const client = new MongoClient(url);

        const { userId, productId } = await req.json();

        await client.connect();
        const db = client.db("McDonalds");

        const cart = await db.collection("cart").findOne({ userId });

        if (!cart || !Array.isArray(cart.items)) {
            return Response.json({ success: false, message: "Cart empty" });
        }

        // Remove the item
        const updatedItems = cart.items.filter(item => item.productId !== productId);

        if (updatedItems.length === 0) {
            // Delete cart entirely
            await db.collection("cart").deleteOne({ userId });

            return Response.json({
                success: true,
                message: "Item removed. Cart is now empty."
            });
        }

        await db.collection("cart").updateOne(
            { userId },
            { $set: { items: updatedItems } }
        );

        return Response.json({
            success: true,
            message: "Item removed successfully."
        });

    } catch (err) {
        console.error("removeFromCart Error:", err);
        return Response.json({
            success: false,
            message: "Error removing item."
        });
    }
}
