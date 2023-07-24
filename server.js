import express from "express"; // http server
import bodyParser from "body-parser"; // req body data process
import mongoose from "mongoose"; // mongoose db access
import cors from "cors"; // cross-origin resource sharing
import dotenv from "dotenv"; // environment variables
import multer from "multer"; // locally uploaded files
import helmet from "helmet"; // security
import morgan from "morgan"; // HTTP req logger
import path from "path"; // relative path to absolute
import { fileURLToPath } from "url"; // ensure file path is 
// ROUTES
import authRoutes from "./routes/authRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import postsRoutes from "./routes/postsRoutes.js";
// ENDPOINTS
import { userRegister } from "./endpoints/AuthController.js";
import { newPost } from "./endpoints/PostsController.js";
// MIDDLEWARES
import { verifyToken } from "./middlewares/authMiddleware.js";
// MODELS
// import UsersModel from "./models/UsersModel.js";
// import PostsModel from "./models/PostsModel.js";
// import { users, posts } from "./data/data.js";


// paths
const __filename = fileURLToPath(import.meta.url);
// console.log(__filename);
const __dirname = path.dirname(__filename);
// console.log(__dirname);

// config 
dotenv.config();
const app = express();

//^###########################
//^####----MIDDLEWARES----####
//^###########################

// parse data into req.body
app.use(express.json());

// secure express setting headers 
app.use(helmet());

// access x-origin sharing policy
app.use( 
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin",
  })
);

// logger (req-url_res-status/time)
app.use(morgan("common")); // param[dev,combined,short,tiny]

// req body parse
app.use(bodyParser.json(
  {
    limit: "50mb",
    extended: true
  }
));
app.use(bodyParser.urlencoded(
  {
    limit: "50mb",
    extended: true
  }
));

// invokes x-origin policy
app.use(cors()); 

// assets local storage 
app.use("/assets", express.static(path.join(__dirname, "./public/assets")));
// console.log('====================================');
// console.log(__dirname);
// console.log('====================================');
// files storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/assets");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
// upload files destination 
const upload = multer({ storage });


//^#############################
//^####----UPLOAD_ROUTES----####
//^#############################

// TODO UPDATE PICTURE PROPERTY  
// user register
app.post("/auth/register", upload.single("picture"), userRegister);
// post upload
app.post("/posts", verifyToken, upload.single("picture"), newPost);

//^######################
//^####----ROUTES----####
//^######################

// auth routes
app.use("/auth", authRoutes);
// users routes 
app.use("/users", usersRoutes);
// posts routes
app.use("/posts", postsRoutes);


//^#########################
//^####----DB__SETUP----####
//^#########################

const PORT = process.env.PORT || 5050;
// database connection
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(`Error: ${error} cannot connect to database`);
  });

const db = mongoose.connection;
// console.log(db);
db.on("error", console.error.bind(console, "DB connection error:"));
db.once("open", () => {
    // console.log("DB connected successfully");
})

//^################################
//^####----ERROR_MIDDLEWARE----####
//^################################

// global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("GLOBAL ERROR HANDLER : ", err);
});
