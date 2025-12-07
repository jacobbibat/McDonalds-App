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

    const user = await collection.findOne({ email });

    if (!user) {
        return Response.json({ success: false, message: "Invalid email or password" });
    }

    const bcrypt = require("bcrypt");
    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
        return Response.json({ success: false, message: "Invalid email or password" });
    }

    return Response.json({
        success: true,
        message: "Login successful",
        userId: user._id
    });

}
