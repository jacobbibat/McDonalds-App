<<<<<<< HEAD
export async function POST(req) {
    try {
        const { getSession } = require("@/lib/auth/sessions");
        const session = await getSession();

        if (!session) {
            return Response.json({ success: false, message: "You must be logged in." });
        }

        const { MongoClient } = require("mongodb");
        const client = new MongoClient(
            "mongodb+srv://b00165639:brightposy@cluster0.ah2kv3o.mongodb.net/?appName=Cluster0"
        );

        const { promoCode } = await req.json();
        const code = promoCode.trim().toUpperCase();
        const userId = String(session.userId);

        await client.connect();
        const db = client.db("McDonalds");

        // Find user cart
        const cart = await db.collection("cart").findOne({ userId });

        if (!cart || !cart.items || cart.items.length === 0) {
            return Response.json({ success: false, message: "Cart is empty." });
        }

        // Find promo
        const promo = await db.collection("promotions").findOne({
            code: code,
            active: true
        });

        if (!promo) {
            return Response.json({
                success: false,
                message: "Invalid or expired promotion code."
            });
        }

        // Apply to cart
        await db.collection("cart").updateOne(
            { userId },
            {
                $set: {
                    appliedPromotion: code,
                    updatedAt: new Date()
                }
            }
        );

        return Response.json({
            success: true,
            message: `Promotion '${code}' applied!`
        });
    } catch (err) {
        console.log("applyPromotion error:", err);
        return Response.json({ success: false, message: "Server error applying promotion." });
    }
}
=======
export async function POST(req) {
    try {
        const { MongoClient } = require("mongodb");

        const url = "mongodb+srv://b00165639:brightposy@cluster0.ah2kv3o.mongodb.net/?appName=Cluster0";
        const client = new MongoClient(url);

        const { userId, promoCode } = await req.json();

        if (!userId || !promoCode) {
            return Response.json({
                success: false,
                message: "Missing userId or promoCode"
            });
        }

        const code = promoCode.trim().toUpperCase();

        await client.connect();
        const db = client.db("McDonalds");

        // Check cart exists
        const cart = await db.collection("cart").findOne({ userId });

        if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
            return Response.json({
                success: false,
                message: "Cart is empty."
            });
        }

        // Check promotion
        const promo = await db.collection("promotions").findOne({
            code: code,
            active: true
        });

        if (!promo) {
            return Response.json({
                success: false,
                message: "Invalid or expired promotion code."
            });
        }

        // Save applied promotion on cart
        await db.collection("cart").updateOne(
            { userId },
            {
                $set: {
                    appliedPromotion: code,
                    updatedAt: new Date()
                }
            }
        );

        return Response.json({
            success: true,
            message: `Promotion '${code}' applied!`
        });
    } catch (err) {
        console.error("applyPromotion error:", err);
        return Response.json({
            success: false,
            message: "Server error applying promotion."
        });
    }
}
>>>>>>> 08dd84b4e3d4881e84356a3efff9a8fab9b19d88
