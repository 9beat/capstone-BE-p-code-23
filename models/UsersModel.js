import  mongoose from "mongoose";


  //^____________________________//
 //^_________USER_MODEL_________//
//^____________________________//

const { ObjectId } = mongoose.Schema.Types;

// define USER
const UserSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, "Please provide first name"],
            min: 3,
            max: 35,
        },
        lastName: {
            type: String,
            required: [true, "Please provide last name"],
            min: 3,
            max: 35,
        },
        email: {
            type: String,
            required: [true, "Please provide email"],
            max: 80,
            unique: true,
        },
        password: {
            type: String,
            required: [true, "Please provide password"],
            min: 8,
        },
        picturePath : {
            type: String,
            default: "",
        },
        friends: [
            {
                type: ObjectId, 
                ref: "UsersModel"
            },
        ],

        location: String,
        occupation: String,
        viewedProfile: Number,
        impressions: Number,
    }, { 
        timestamps: true
    }
);

// pass schema to model 
const UsersModel = mongoose.model("UsersModel", UserSchema, 'users');

// console.log(UsersModel);

// export user model
export default UsersModel; 






// SpotifyModel ----------------------------------?????
        // spotifyId: String,
        // spotifyAccessToken : String,
        // spotifyRefreshToken: String,
        // spotifyProfile: {
        //     id: String,
        //     name: String,
        //     picture: String,
        //     genres: {
        //         type: Array,
        //         default: [],
        //     },
        //     albums: {
        //         type: Array,
        //         default: [],
        //     },
        //     artists: {
        //         type: Array,
        //         default: [],
        //     },
        //     tracks: {
        //         type: Array,
        //         default: [],
        //     }
        // },
        // spotifyPlaylists: [String],
        // spotifyFavoriteTracks: [String],
        // spotifyFavoriteArtists: [String],