const { jwtDecode } = require("jwt-decode")
const randomstring = require('randomstring')

module.exports = {
    // baseURL : "http://localhost:5000",
    // baseURL : "http://192.168.29.33:5000",
    // baseURL : "http://api.mevadakalgitea.scriptscholer.in",

    httpSuccess: "Success",
    httpErrors: {
        500: (() => {
            const err = new Error("Somthing went wrong")
            err.status = 500
            return err
        })(),
        400: (() => {
            const err = new Error("Missing dependency")
            err.status = 400
            return err
        })(),
        401: (() => {
            const err = new Error("unAuthorized")
            err.status = 401
            return err
        })(),
        404: (() => {
            const err = new Error("Data Not Found")
            err.status = 401
            return err
        })()
    },
    getUserDetails: () => {
        try {
            const token = localStorage.getItem("token")
            const userInfo = jwtDecode(token)
            return userInfo
        } catch (error) {
            return null
        }
    },
    uploadMedia: async (file) => {
        // const {file} = req.files
        let fileExt = file.name
        let fileName = randomstring.generate({
            length: 12,
            charset: 'alphabetic'
        });

        let ext = fileExt.split(".");
        ext = ext[ext.length - 1];
        fileName = fileName + "." + ext;
        let filePath = "./public/" + fileName;
        await file.mv(filePath, (err) => {
            if (err) {
                console.error("Error moving file: ", err);
                throw new Error("File move failed");
            }
        });
        return { name: fileName, path: filePath }

        // let result = await this.model.create({name: fileName, path: filePath})
        // if(!result) throw httpErrors[500]
        // result = result?._doc
        // return res.status(200).send({message: httpSuccess, data:{source:baseURL + result.path}})
    }
}