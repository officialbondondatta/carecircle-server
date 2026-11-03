import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { MongoClient } from 'mongodb';

const app = express()
const PORT = process.env.PORT || 8000



app.use(cors())
app.use(express.json())


const client = new MongoClient(`${process.env.MONGOURI}`);

export async function connectToMongoDB() {
    try {
        await client.connect();
        console.log("You successfully connected to MongoDB!");
        return client;
    } catch (err) {
        console.dir(err);
    }
}
const connectToDB = await connectToMongoDB()
const database = connectToDB.db("carecircle")
const usersCollection = database.collection("users")


app.get('/', (req, res) => {
    res.send("CareCircle Server HomePage")
})



app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})
