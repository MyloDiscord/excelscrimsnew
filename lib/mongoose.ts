import { ServerApiVersion } from 'mongodb';
import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI || "mongodb+srv://mylobusiness1:Fsv4o3xPPeMqjo7I@excel-website.mhgzda3.mongodb.net/?retryWrites=true&w=majority&appName=Excel-Website";

if (!uri) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

async function connect() {
    if (mongoose.connection.readyState >= 1) {
        return;
    }

    await mongoose.connect(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        },
    });
}

const db = { connect, mongoose };
export default db;
