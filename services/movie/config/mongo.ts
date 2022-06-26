const dbConfig = {
    mongoUri:`${process.env.DB_HOST}${process.env.DB_NAME}`,
    config: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        user: process.env.DB_USER,
        pass: process.env.DB_PASS,
        serverSelectionTimeoutMS: 30000,
    }
}
export default dbConfig;