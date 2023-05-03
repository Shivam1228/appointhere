const mongoose =require("mongoose")

const userSchema= new mongoose.Schema({
    username:{
        type:String,
        default:true
    },
    email:{
        type:String,
        default:true
    },
    password:{
        type:String
    }
    
},
{timestamps:true}
) 


module.exports=mongoose.model("user",userSchema)