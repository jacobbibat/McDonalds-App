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

        // -------------------------
        // 1. GET USER CART
        // -------------------------
        const cart = await db.collection("cart").findOne({ userId });

        if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
            return Response.json({
                success: false,
                message: "Your cart is empty."
            });
        }

        // -------------------------
        // 2. CALCULATE TOTALS
        // -------------------------

        const subtotal = cart.items.reduce((sum, item) => {
            return sum + Number(item.qty) * Number(item.price);
        }, 0);

        let discountAmount = 0;
        let finalTotal = subtotal;
        let promoTitle = null;

        // If a promo is applied, re-check from DB
        if (cart.appliedPromotion) {
            const promo = await db.collection("promotions").findOne({
                code: cart.appliedPromotion,
                active: true
            });

            if (promo) {
                discountAmount = subtotal * (promo.discount / 100);
                finalTotal = subtotal - discountAmount;
                promoTitle = promo.title;
            }
        }

        // -------------------------
        // 3. BUILD ORDER DOCUMENT
        // -------------------------

        const order = {
            userId, // keep as STRING
            items: cart.items,
            subtotal: Number(subtotal),
            discount: Number(discountAmount),
            total: Number(finalTotal),
            promotionUsed: promoTitle,
            status: "pending",
            createdAt: new Date()
        };

        // -------------------------
        // 4. INSERT INTO ORDERS
        // -------------------------

        const result = await db.collection("orders").insertOne(order);

        // -------------------------
        // 5. CLEAR CART AFTER ORDER
        // -------------------------

        await db.collection("cart").deleteOne({ userId });

        // -------------------------
        // 6. RETURN SUCCESS
        // -------------------------

        return Response.json({
            success: true,
            message: "Order created successfully.",
            orderId: result.insertedId
        });
    } catch (err) {
        console.error("createOrder API error:", err);
        return Response.json({
            success: false,
            message: "Server error creating order."
        });
    }
}
