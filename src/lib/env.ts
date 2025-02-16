//ensures env vars have default values if not present or set incorrectly
export const env = {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: process.env.PORT || 8080,
    HOST: process.env.HOST || "http://localhost",
    PUBLIC_URL: process.env.PUBLIC_URL || "",
    MONGO_CONN_STRING: process.env.MONGO_CONN_STRING || "mongodb://localhost:27017"
};




