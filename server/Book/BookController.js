const { httpErrors, httpSuccess } = require("../constents");
const ebookController = require("../E-books/EbookController");
const sendMail = require("../nodeMailer/nodemailer");
const BookModel = require("./BookModel");

class BookController extends BookModel {
    constructor() {
        super()
        this.addBooking = this.addBooking.bind(this)
        this.deleteBooking = this.deleteBooking.bind(this)
        this.listByUser = this.listByUser.bind(this)
    }

    async addBooking(req, res) {
        const { ebookId, userId } = req.body
        if (!ebookId || !userId) throw httpErrors[400]
        const result = await this.model.create({ ...req.body })
        if (!result) throw httpErrors[500]
        const eventData = await ebookController.findOneEbook(ebookId)
        sendMail(req.user.email, eventData)
        return res.status(200).send({ message: httpSuccess })
    }

    async deleteBooking(req, res) {
        const { id } = req.params
        if (!id) throw httpErrors[400]
        const result = await this.model.deleteOne({ _id: id })
        if (!result || result.deletedCount <= 0) throw httpErrors[500]
        return res.status(200).send({ message: httpSuccess })
    }

    async listByUser(req, res) {
        const { id } = req.params
        if (!id) throw httpErrors[400]
        let result = await this.model.find({ userId: id }).populate([{ path: "ebookId"}])
        result = result.map(event => {
            // Assuming the image is stored in event.image.path
            if (event.ebookId.image) {
                event.ebookId.image = `${process.env.APP_URL}${event?.ebookId?.image}`; // Concatenate the base URL
            }
            return event;
        });
        if (!result && result.length === 0) throw httpErrors[404]
        return res.status(200).send({ message: httpSuccess, data: result })
    }
}

const bookController = new BookController()
module.exports = bookController