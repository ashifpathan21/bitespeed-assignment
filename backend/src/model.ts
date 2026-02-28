import 'dotenv/config'
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined")
}

const connectionString = process.env.DATABASE_URL;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export default prisma ;