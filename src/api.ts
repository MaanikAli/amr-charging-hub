
import { MongoClient, Db } from 'mongodb';

const uri = "mongodb+srv://sowad:sowad@cluster0.m7vh241.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

let db: Db;

export async function connectToDatabase(): Promise<Db> {
    if (db) return db;