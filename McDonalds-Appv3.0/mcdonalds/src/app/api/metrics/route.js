export async function GET() {
    const { MongoClient } = require("mongodb");

    const url = "mongodb+srv://b00165639:brightposy@cluster0.ah2kv3o.mongodb.net/?appName=Cluster0";
    const client = new MongoClient(url);

    await client.connect();
    const db = client.db("McDonalds");

    const ordersCollection = db.collection("orders");

    // Last 7 days
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);

    // Aggregate count of orders per day
    const results = await ordersCollection
        .aggregate([
            {
                $match: {
                    createdAt: { $gte: sevenDaysAgo }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ])
        .toArray();

    // Build consistent last-7-days array including days with 0 orders
    const labels = [];
    const values = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const label = d.toISOString().slice(0, 10);

        labels.push(label);

        const found = results.find(r => r._id === label);
        values.push(found ? found.count : 0);
    }

    return Response.json({
        labels,
        values
    });
}
