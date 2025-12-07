export async function POST(req, res) {

    console.log("in the register api");

    const { MongoClient } = require("mongodb");
    const bcrypt = require("bcrypt");
    const saltRounds = 10;

    const url = "mongodb+srv://b00165639:brightposy@cluster0.ah2kv3o.mongodb.net/?appName=Cluster0";
    const client = new MongoClient(url);

    const dbName = "McDonalds";

    await client.connect();
    console.log("Connected successfully to server");

    const db = client.db(dbName);
    const collection = db.collection("users");

    // get body from request
    const body = await req.json();
    const { firstName, lastName, email, password } = body;

    console.log("Registering:", email);

    // check if email exists
    const existing = await collection.findOne({ email: email });

    if (existing) {
        return Response.json({
            success: false,
            message: "Email already registered"
        });
    }

    // HASH PASSWORD HERE
    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    const newUser = {
        firstName,
        lastName,
        email,
        password: hashedPassword, // store hashed password
        role: "client",
        createdAt: new Date()
    };

    const result = await collection.insertOne(newUser);

    console.log("Successfully registered:", firstName, lastName);
    console.log("Inserted user ID:", result.insertedId);

    return Response.json({
        success: true,
        message: "Registration successful",
        userId: result.insertedId
    });
}
