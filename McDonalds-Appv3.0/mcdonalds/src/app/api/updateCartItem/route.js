export async function POST(req) {
    try {
        const { MongoClient } = require("mongodb");

        const url = "mongodb+srv://b00165639:brightposy@cluster0.ah2kv3o.mongodb.net/?appName=Cluster0";
        const client = new MongoClient(url);

        const { userId, productId, qty } = await req.json();

        if (!userId || !productId || qty === undefined) {
            return Response.json({
                success: false,
                message: "Missing userId, productId, or qty"
            });
        }

        const newQty = Number(qty);

        await client.connect();
        const db = client.db("McDonalds");

        const cart = await db.collection("cart").findOne({ userId });

        if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
            return Response.json({
                success: false,
                message: "Cart not found."
            });
        }

        const items = cart.items;
        const item = items.find(
            (i) => String(i.productId) === String(productId)
        );

        if (!item) {
            return Response.json({
                success: false,
                message: "Item not found in cart."
            });
        }

        if (newQty <= 0) {
            // Remove item
            const filtered = items.filter(
                (i) => String(i.productId) !== String(productId)
            );

            if (filtered.length === 0) {
                await db.collection("cart").deleteOne({ userId });
                return Response.json({
                    success: true,
                    message: "Item removed. Cart now empty."
                });
            }

            await db.collection("cart").updateOne(
                { userId },
                {
                    $set: {
                        items: cart.items,
                        appliedPromotion: null,   // RESET PROMO WHEN QUANTITY CHANGES ??
                        updatedAt: new Date()
                    }
                }
            );


            return Response.json({
                success: true,
                message: "Item removed from cart."
            });
        }

        // Update quantity
        item.qty = newQty;

        await db.collection("cart").updateOne(
            { userId },
            {
                $set: {
                    items: items,
                    updatedAt: new Date()
                }
            }
        );

        return Response.json({
            success: true,
            message: "Quantity updated."
        });
    } catch (err) {
        console.error("updateCartItem error:", err);
        return Response.json({
            success: false,
            message: "Server error updating quantity."
        });
    }
}
