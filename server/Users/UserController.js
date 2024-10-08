const { httpErrors, httpSuccess, } = require("../constents");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const UserModel = require("./UserModel");

class UserController extends UserModel {
    constructor() {
        super();
        this.createUser = this.createUser.bind(this)
        this.deleteUser = this.deleteUser.bind(this)
        this.listUser = this.listUser.bind(this)
        this.loginUser = this.loginUser.bind(this)
        this.AuthGard = this.AuthGard.bind(this)

    }
    async AuthGard(req, res, next) {
        try {
            const token = req.headers.token || req.headers.authorization?.split(" ")[1];   
            if (!token) {
                return res.status(401).send({ message: "Unauthorized. No token provided." });
            }
    
            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) {
                    return res.status(403).send({ message: "Token verification failed", error: err.message });
                }
    
                req.user = decoded;
                next();
            });
            
        } catch (error) {
            return res.status(500).send({ message: "Something went wrong", error: error.message });
        }
    }
    
    async createUser(req, res) {
        let { fullName, email, password } = req.body
        if (!fullName || !email || !password ) throw httpErrors[400]
        password = bcrypt.hashSync(password, 8)
        const reuslt = await this.model.create({ ...req.body, password })
        if (!reuslt) throw httpErrors[500]
        return res.status(200).send({ message: httpSuccess })
    }
    async deleteUser(req, res) {
        const { id } = req.params
        const reuslt = await this.model.deleteOne({ _id: id })
        if (!reuslt || reuslt.deletedCount <= 0) throw httpErrors[500]
        return res.status(200).send({ message: httpSuccess })
    }
    async listUser(req, res) {
        const result = await this.model.find({ ...req.query })
        if (!result) httpErrors[500]
        return res.status(200).send({ message: httpSuccess, data: result })
    }
    async loginUser(req, res) {
        const { email, password } = req.body
        if (!email || !password) throw httpErrors[400]
        let result = await this.model.findOne({ email: email })
        console.log(result)
        if (!result) {
            return res.status(403).send({message:"User Not Exist"})
        }
        result = result._doc
        if (!bcrypt.compareSync(password, result.password)) {
            return res.status(403).send({message:"Password And Email Are Not Match!"})
        }
        delete result.password
        const token = jwt.sign({ ...result }, process.env.JWT_SECRET, { expiresIn: "1d" })
        if (!token) throw httpErrors[500]
        return res.status(200).send({ message: httpSuccess, token: token })
    }
}

const userController = new UserController()

module.exports = userController