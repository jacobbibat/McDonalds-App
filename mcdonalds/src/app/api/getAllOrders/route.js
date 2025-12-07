<<<<<<< HEAD
export async function GET() {

    const { getSession } = require("@/lib/auth/sessions");
    const session = await getSession();

    if (!session || session.role !== "manager") {
        return Response.json(
            { success: false, message: "Unauthorized" },
            { status: 401 }
        );
    }

    const { MongoClient } = require("mongodb");

    const url = "mongodb+srv://b00165639:brightposy@cluster0.ah2kv3o.mongodb.net/?appName=Cluster0";
    const client = new MongoClient(url);

    await client.connect();
    const db = client.db("McDonalds");

    const orders = await db.collection("orders")
        .find({})
        .sort({ createdAt: -1 })
        .toArray();

    return Response.json({
        success: true,
        orders
    });
}
=======
import { MongoClient } from "mongodb";

export async function GET() {

    console.log("in getAllOrders api");

    const url =
        "mongodb+srv://b00165639:brightposy@cluster0.ah2kv3o.mongodb.net/?appName=Cluster0";

    const client = new MongoClient(url);

    await client.connect();
    const db = client.db("McDonalds");

    const orders = db.collection("orders");

    const allOrders = await orders
        .find({})
        .sort({ createdAt: -1 })
        .toArray();

    return Response.json({
        success: true,
        orders: allOrders
    });
}
>>>>>>> 08dd84b4e3d4881e84356a3efff9a8fab9b19d88
