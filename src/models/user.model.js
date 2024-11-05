import {Schema,mongoose} from 'mongoose';
import JWT from 'jsonwebtoken';
import bcrypt from 'bcrypt';


const userSchema = new Schema({

    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    fullName:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    password:{
        type:String,
        required:true
    },
    refreshToken:{
        type:String
    },
    avatar:{
        type:String,
        required:true,
        default:'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
    },
    coverImage:{
        type:String
    },

},{timestamps:true});



//presave
userSchema.pre('save',async function(next){
    const user = this;

    if(!user.isModified('password')){
        return next();
    }

    const hashedPassword = await bcrypt.hash(user.password,10);
    this.password = hashedPassword;
    next();
})

//methods

userSchema.methods.isPasswordCorrect = async function(password){
    const user = this;
    return await bcrypt.compare(password,user.password);
}

userSchema.methods.generateAccessToken = async function(){

    return JWT.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )

}

userSchema.methods.generateRefreshToken = async function(){

    return JWT.sign(
        {
            id:this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

//next is used in pre because its a middle ware and once work is done we need to forward



export const User = mongoose.model('User',userSchema);