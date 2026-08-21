import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        avatar: {
            url:{
                type: String,  //cloudinary url
                required: true,
            },
            public_id:{
                type: String,  //cloudinary public_id
                required: true,
            }
        },
        coverImage: {
            url:{
                type: String,  //cloudinary url
            },
            public_id:{
                type: String, 
            }
        },

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },

        isOnline: {
            type: Boolean,
            default: false
        },

        showOnlineStatus: {
            type: Boolean,
            default: true
        },

        privacy: {
            showOnlineStatus: {
                type: Boolean,
                default: true
            },
            showLastSeen: {
                type: Boolean,
                default: true
            }
        },

        lastSeen: {
            type: Date,
            default: null
        },

        location: {
            lat: {
                type: Number,
                default: null
            },
            lon: {
                type: Number,
                default: null
            },
            city: {
                type: String,
                default: ""
            },
            address: {
                type: String,
                default: ""
            },
            updatedAt: {
                type: Date,
                default: Date.now
            }
        },

        watchHistory: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password: {
            type: String,  //encrypted password
            required: [true, 'Password is required!'],
        },


        favouriteCountry: {
            name: {
                type: String,
                default: null
            },
            flag: {
                type: String,
                default: null
            }
        },

        favouriteClub: {
            name: {
                type: String,
                default: null
            },
            logo: {
                type: String,
                default: null
            }
        },

        favouritePlayer: {
            name: {
                type: String,
                default: null
            },
            image: {
                type: String,
                default: null
            }
        },


        refreshToken: {
            type: String,

        }
    },
    {timestamps: true}
)

userSchema.pre("save", async function(next){   //Just before saving the user to the database, this function will run
    if(this.isModified("password")){     //Check if the password field is modified, if yes then only hash the password, otherwise skip hashing
        this.password = await bcrypt.hash(this.password, 10)
    }
    next
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model('User', userSchema)