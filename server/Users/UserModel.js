const { default: mongoose } = require("mongoose");

class UserModel {
    constructor(){
        this.schema = new mongoose.Schema({
            fullName: { type: String, required:true },
            email: { type: String, required: true },
            password: { type: String, required: true},
        },{ timestamps: true })

        this.model = mongoose.model("tbl_users", this.schema)
    }
}

module.exports = UserModel