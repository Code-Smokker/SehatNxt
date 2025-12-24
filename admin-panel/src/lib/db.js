import mongoose from 'mongoose';

const MONGODB_URL = process.env.MONGODB_URL || "mongodb+srv://omkarshewale22052007_db_user:IFnYfIzmqSRfkCHe@cluster0.85oylnt.mongodb.net/sehatnxt?appName=Cluster0";

if (!MONGODB_URL) {
    throw new Error('Please define the MONGODB_URL environment variable inside .env');
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default connectDB;
