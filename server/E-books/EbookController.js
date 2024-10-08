const { httpErrors, httpSuccess } = require("../constents");
const EbookModel = require("./EbookModel");

class EbookController extends EbookModel {
    constructor() {
        super();
        this.addEbook = this.addEbook.bind(this);
        this.listEbooks = this.listEbooks.bind(this);
        this.getEbooksByUserId = this.getEbooksByUserId.bind(this);
        this.updateEbook = this.updateEbook.bind(this);
        this.deleteEbook = this.deleteEbook.bind(this);
    }

    async addEbook(req, res) {
        const { title, description, publishDate, author, language, createdBy } = req.body;
        const file = req.file;

        if (!title || !description || !publishDate || !author || !language || !createdBy || !file) {
            return res.status(400).send({ message: "Missing required fields" });
        }

        const imagePath = `/public/${file.filename}`;

        const result = await this.model.create({ ...req.body, image: imagePath });
        if (!result) {
            return res.status(500).send({ message: "Failed to add ebook" });
        }

        return res.status(200).send({ message: httpSuccess });
    }

    async listEbooks(req, res) {
        try {
            const events = await this.model.find().populate([{ path: "createdBy" }]);
            if (!events) throw httpErrors[404];
            const updatedEvents = events.map(event => {
                if (event.image) {
                    event.image = `${process.env.APP_URL}${event.image}`;
                }
                return event;
            });
            return res.status(200).send({ message: httpSuccess, data: updatedEvents });
        } catch (err) {
            return res.status(500).send({ message: httpErrors[500], error: err.message });
        }
    }

    async getEbooksByUserId(req, res) {
        const { id } = req.params;
        try {
            const events = await this.model.find({ createdBy: id });
            if (!events || events.length === 0) throw httpErrors[404];

            const updatedEvents = events.map(event => {
                if (event.image) {
                    event.image = `${process.env.APP_URL}${event.image}`;
                }
                return event;
            });
            return res.status(200).send({ message: httpSuccess, data: updatedEvents });
        } catch (err) {
            return res.status(500).send({ message: httpErrors[500], error: err.message });
        }
    }

    async updateEbook(req, res) {
        const { id } = req.params;
        const { title, description, publishDate, author, language, createdBy } = req.body;
        const file = req.file; // Get the uploaded file

        if (!title || !description || !publishDate || !author || !language || !createdBy) {
            return res.status(400).send({ message: "Missing required fields" });
        }

        let updateData = { ...req.body };
        if (file) {
            const imagePath = `/public/${file.filename}`; // Use the filename generated by Multer
            updateData = { ...updateData, image: imagePath };
        }

        try {
            const updatedEvent = await this.model.findOneAndUpdate({ _id: id }, { ...updateData }, { new: true });
            if (!updatedEvent) throw httpErrors[404];
            return res.status(200).send({ message: httpSuccess, event: updatedEvent });
        } catch (err) {
            return res.status(500).send({ message: httpErrors[500], error: err.message });
        }
    }

    async deleteEbook(req, res) {
        const { id } = req.params;
        try {
            const deletedEvent = await this.model.deleteOne({ _id: id });
            if (!deletedEvent || deletedEvent.deletedCount === 0) throw httpErrors[500];
            return res.status(200).send({ message: httpSuccess });
        } catch (err) {
            return res.status(500).send({ message: httpErrors[500], error: err.message });
        }
    }

    async findOneEbook(id) {
        const result = await this.model.findOne({ _id: id });
        if (!result) throw httpErrors[404];
        return result;
    }
}

const ebookController = new EbookController();
module.exports = ebookController;
