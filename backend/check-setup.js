import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Transaction from './src/models/Transaction.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/truestate';

async function checkSetup() {
    console.log('🔍 Checking TruEstate Setup...\n');
    
    // Check MongoDB connection
    console.log('1. Checking MongoDB connection...');
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('   ✓ MongoDB connected successfully\n');
    } catch (error) {
        console.error('   ✗ MongoDB connection failed:', error.message);
        console.log('\n   Please check:');
        console.log('   - Is MongoDB running?');
        console.log('   - Is MONGODB_URI correct in .env file?');
        process.exit(1);
    }

    // Check if database has data
    console.log('2. Checking database for transactions...');
    try {
        const count = await Transaction.countDocuments();
        console.log(`   ✓ Found ${count.toLocaleString()} transactions in database\n`);
        
        if (count === 0) {
            console.log('   ⚠️  WARNING: Database is empty!');
            console.log('   Run: npm run seed\n');
        } else {
            // Test search functionality
            console.log('3. Testing search functionality...');
            const testKeyword = 'phone';
            const searchQuery = {
                $or: [
                    { customerName: new RegExp(testKeyword, 'i') },
                    { phone: new RegExp(testKeyword, 'i') },
                    { productName: new RegExp(testKeyword, 'i') }
                ]
            };
            
            const searchResults = await Transaction.countDocuments(searchQuery);
            console.log(`   ✓ Search for "${testKeyword}" found ${searchResults.toLocaleString()} results\n`);
            
            // Show sample data
            console.log('4. Sample transaction data:');
            const sample = await Transaction.findOne().lean();
            if (sample) {
                console.log('   Customer:', sample.customerName);
                console.log('   Product:', sample.productName);
                console.log('   Phone:', sample.phone);
                console.log('   Amount:', sample.finalAmount);
                console.log('');
            }
        }
    } catch (error) {
        console.error('   ✗ Error checking database:', error.message);
        process.exit(1);
    }

    // Check if server can start
    console.log('5. Setup check complete!');
    console.log('\n   Next steps:');
    console.log('   - If database is empty, run: npm run seed');
    console.log('   - Start backend: npm run dev');
    console.log('   - Start frontend: cd ../frontend && npm run dev\n');

    await mongoose.disconnect();
    process.exit(0);
}

checkSetup();

