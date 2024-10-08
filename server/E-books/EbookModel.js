const { default: mongoose } = require("mongoose");

class EbookModel {
    constructor() {
        this.schema = new mongoose.Schema({
            title: { type: String, required: true },
            description: { type: String, required: true },
            publishDate: { type: Date, required: true },
            image: { type: String, required: true },
            author: { type: String, required: true },
            language: { type: String, required: true },
            createdBy: { type: mongoose.Types.ObjectId, ref: 'tbl_users' },
        }, { timestamps: true })

        this.model = mongoose.model("tbl_ebooks", this.schema)
    }
}

module.exports = EbookModel