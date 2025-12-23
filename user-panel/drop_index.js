const mongoose = require('mongoose');

// URI from your .env
const MONGODB_URI = "mongodb+srv://omkarshewale22052007_db_user:IFnYfIzmqSRfkCHe@cluster0.85oylnt.mongodb.net/sehatnxt?appName=Cluster0";

async function fixIndexes() {
    console.log("Connecting to MongoDB...");
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected.");

        const collection = mongoose.connection.collection('users');

        console.log("Attempting to drop 'phone_1' index...");
        try {
            await collection.dropIndex('phone_1');
            console.log("✅ Successfully dropped 'phone_1' index.");
        } catch (err) {
            if (err.code === 27) {
                console.log("ℹ️ Index 'phone_1' not found. That's okay.");
            } else {
                console.error("❌ Error dropping index:", err.message);
            }
        }

    } catch (err) {
        console.error("Connection error:", err);
    } finally {
        await mongoose.disconnect();
        console.log("Done.");
        process.exit(0);
    }
}

fixIndexes();
