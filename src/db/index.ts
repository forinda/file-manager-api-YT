import { dbConfig } from "@/config";
import mongoose from 'mongoose'

mongoose.connect(dbConfig.mongoUri)

mongoose.connection.on('conenected', () => {
    console.log('Db connected');
})

mongoose.connection.on('error', (err: any) => {
    console.log(`Error connecting to db: ${err.message}`);
})

export default mongoose