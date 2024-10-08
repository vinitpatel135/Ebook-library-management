const { jwtDecode } = require("jwt-decode")

module.exports = {
    // baseURL : "http://localhost:5000",
    // baseURL : "http://192.168.29.33:5000",
    // baseURL : "http://api.mevadakalgitea.scriptscholer.in",
    baseURL: "http://localhost:5000",

    DB_URL: "mongodb://127.0.0.1:27017/blog-project",
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
        })()
    },
    JWT_SACRATE: "SOMTHING SECRATE",
    getUserDetails: () => {
        try {
            const token = localStorage.getItem("token")
            const userInfo = jwtDecode(token)
            return userInfo
        } catch (error) {
            return null
        }
    }
}