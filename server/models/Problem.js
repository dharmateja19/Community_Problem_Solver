import mongoose from 'mongoose'

const problemSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String, 
        required : true 
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    image : {
        type : String
    },
    location : {
        type : String,
        required : true
    },
    status : {
        type : String,
        enum : ["open", "in-progress", "completed"],
        default : "open"
    }
}, {timestamps : true})

const Problem = mongoose.model('Problem', problemSchema)

export default Problem;