const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();

//imports
const dbConnect = require('./config/database');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const {cloudinaryConnect} = require('./config/cloudinary');
const fileUpload = require('express-fileupload')

//import routes
const userRoutes = require('./routes/user');
const paymentRoutes = require('./routes/payment');
const profileRoutes = require('./routes/profile');
const courseRoutes = require('./routes/course');
const reachRoutes = require('./routes/reach');

const PORT = process.env.PORT || 4000;

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
}))

//mount routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/reach", reachRoutes);

//default route
app.get("/", (req, res) => {
    return res.status(200).json({
        success: true,
        message: `Your server is up and running...`,
    });
});

const startServer = async() => {
    await dbConnect.connect();
    cloudinaryConnect();

    app.listen(PORT, () => {
        console.log(`App is running as port ${PORT}`);
    });
};

startServer().catch((error) => {
    console.error(`Server startup failed: ${error.message}`);
    process.exit(1);
});