const express = require('express');
const app = express();

//imports
const dbConnect = require('./config/database');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const {cloudinaryConnect} = require('./config/cloudinary');
const fileUpload = require('express-fileupload')
const dotenv = require('dotenv');

//import routes
const userRoutes = require('./routes/user');
const paymentRoutes = require('./routes/payment');
const profileRoutes = require('./routes/profile');
const courseRoutes = require('./routes/course');

dotenv.config();
const PORT = process.env.PORT || 4000;
dbConnect.connect();

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

//connect with cloudinary
cloudinaryConnect();

//mount routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);

//default route
app.get("/", () => {
    return res.status(200).json({
        success: true,
        message: `Your server is up and running...`,
    });
});

app.listen(PORT, () => {
    console.log(`App is running as port ${PORT}`)
})