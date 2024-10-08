const { default: mongoose } = require("mongoose");

class BookModel {
    constructor(){
        this.schema = new mongoose.Schema({
            ebookId: { type: mongoose.Types.ObjectId, required:true, ref:"tbl_ebooks" },
            userId: { type: mongoose.Types.ObjectId, required: true, ref:"tbl_users" },
            status: { type: String, default:"Booked"},
        },{ timestamps: true })

        this.model = mongoose.model("tbl_borrows", this.schema)
    }
}

module.exports = BookModel