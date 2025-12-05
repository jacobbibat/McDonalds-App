export async function POST(req, res) {

    console.log("in the login api");

    // =================================================
    const { MongoClient } = require('mongodb');

    const url = 'mongodb+srv://b00165639:brightposy@cluster0.ah2kv3o.mongodb.net/?appName=Cluster0';
    const client = new MongoClient(url);

    const dbName = 'McDonalds'; // database name

    await client.connect();
    console.log('Connected successfully to server');

    const db = client.db(dbName);
    const collection = db.collection('users'); // collection name

    // get body sent from frontend
    const body = await req.json();
    const { email, password } = body;

    console.log("Checking login for:", email);

    // find the matching user
    const user = await collection.findOne({
        email: email,
        password: password // not secure but fine for a college project
    });

    console.log("Found user =>", user);

    //==========================================================

    if (!user) {
        return Response.json({ success: false, message: "Invalid login" });
    }

    return Response.json({
        success: true,
        message: "Login successful",
        user: {
            id: user._id.toString(),
            firstName: user.firstName,
            role: user.role
        }
    });
}
