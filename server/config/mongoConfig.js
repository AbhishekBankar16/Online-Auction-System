import dotenv from ".env";
import path from "path";

// Load MongoDB-specific dotenv file
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const MONGO_URI = process.env.MONGO_URI;

export default MONGO_URI;
