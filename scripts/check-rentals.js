const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const rentSchema = new mongoose.Schema({}, { strict: false });
const Rent = mongoose.models.Rent || mongoose.model('Rent', rentSchema);

async function run() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is missing in .env.local");
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to DB");

        const rents = await Rent.find({ status: 'active' });
        console.log(`Found ${rents.length} active rents.`);
        
        if (rents.length > 0) {
            const rent = rents[0];
            // Update the first one to emit notification logic
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            // Log old date
            console.log(`Updating Rent ${rent._id}. Old Date: ${rent.returnDate}`);
            
            // Direct update using mongo driver logic to avoid validation
            await Rent.collection.updateOne(
                { _id: rent._id },
                { $set: { returnDate: tomorrow } }
            );
            
            console.log(`New Date set to: ${tomorrow}`);
            console.log("Now please run the cron API manually or via browser: /api/cron/check-rentals");
        } else {
            console.log("No active rents found. Please rent a book first.");
        }

    } catch (e) {
        console.error("Error:", e);
    } finally {
        await mongoose.disconnect();
    }
}

run();
