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

        const { productId, qty } = await req.json();
        const userId = String(session.userId);

        if (!productId || qty < 1) {
            return Response.json({
                success: false,
                message: "Invalid quantity or product ID."
            });
        }

        await client.connect();
        const db = client.db("McDonalds");

        const cart = await db.collection("cart").findOne({ userId });

        if (!cart) {
            return Response.json({
                success: false,
                message: "Cart not found."
            });
        }

        // Update the product qty
        const newItems = cart.items.map(item => {
            if (String(item.productId) === String(productId)) {
                return {
                    ...item,
                    qty: Number(qty)
                };
            }
            return item;
        });

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
            message: "Cart updated!"
        });

    } catch (err) {
        console.log("updateCartItem error:", err);
        return Response.json({
            success: false,
            message: "Server error updating cart."
        });
    }
}
=======
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
                        items: filtered,
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
>>>>>>> 08dd84b4e3d4881e84356a3efff9a8fab9b19d88
