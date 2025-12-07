<<<<<<< HEAD
export async function POST(req) {
    try {
        const { getSession } = require("@/lib/auth/sessions");
        const session = await getSession();

        if (!session) {
            return Response.json({ success: false, message: "Not logged in" });
        }

        const { MongoClient } = require("mongodb");
        const client = new MongoClient(
            "mongodb+srv://b00165639:brightposy@cluster0.ah2kv3o.mongodb.net/?appName=Cluster0"
        );

        const { productId } = await req.json();
        const userId = String(session.userId);

        await client.connect();
        const db = client.db("McDonalds");

        // Find the cart first
        const cart = await db.collection("cart").findOne({ userId });

        if (!cart) {
            return Response.json({
                success: false,
                message: "Cart not found"
            });
        }

        // Remove the item
        const newItems = cart.items.filter(
            (item) => String(item.productId) !== String(productId)
        );

        await db.collection("cart").updateOne(
            { userId },
            {
                $set: {
                    items: newItems,
                    appliedPromotion: null,
                    updatedAt: new Date()
                }
            }
        );

        return Response.json({
            success: true,
            message: "Item removed from cart."
        });

    } catch (err) {
        console.log("removeFromCart error:", err);
        return Response.json({
            success: false,
            message: "Server error removing item."
        });
    }
}
=======
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
>>>>>>> 08dd84b4e3d4881e84356a3efff9a8fab9b19d88
