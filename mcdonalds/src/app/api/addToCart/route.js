export async function POST(req) {
    try {
        const { MongoClient, ObjectId } = require("mongodb");

        const url = "mongodb+srv://b00165639:brightposy@cluster0.ah2kv3o.mongodb.net/?appName=Cluster0";
        const client = new MongoClient(url);

        const { userId, productId } = await req.json();

        if (!userId || !productId) {
            return Response.json({ success: false, message: "Missing userId or productId" });
        }

        await client.connect();
        const db = client.db("McDonalds");

        // 1. Get product from menu
        const product = await db
            .collection("menu")
            .findOne({ _id: new ObjectId(productId) });

        if (!product) {
            return Response.json({ success: false, message: "Product not found." });
        }

        const price =
            typeof product.price === "string"
                ? parseFloat(product.price)
                : product.price;

        // 2. Find or create cart
        let cart = await db.collection("cart").findOne({ userId });

        if (!cart) {
            cart = {
                userId,
                items: [],
                updatedAt: new Date()
            };
            await db.collection("cart").insertOne(cart);
        }

        // 3. Check if product already in cart
        const existing = cart.items.find(
            (item) => String(item.productId) === String(productId)
        );

        if (existing) {
            existing.qty = Number(existing.qty || 0) + 1;
        } else {
            cart.items.push({
                productId: String(productId),
                name: product.name,
                price: price,
                qty: 1,
                image: product.image || "/placeholder-food.png"
            });
        }

        // 4. Save cart
        await db.collection("cart").updateOne(
            { userId },
            { $set: { items: cart.items, updatedAt: new Date() } }
        );

        return Response.json({
            success: true,
            message: `${product.name} added to cart!`
        });
    } catch (err) {
        console.error("addToCart error:", err);
        return Response.json({
            success: false,
            message: "Server error adding to cart."
        });
    }
}
