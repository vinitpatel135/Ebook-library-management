import axios from "axios"

class Api{
    constructor(){
        this.baseUrl = "https://ebook-library-management.onrender.com"
        // this.baseUrl = "http://localhost:5050"
    }
    getToken(){
        return localStorage.getItem("token")
    }
    signup(data){
        return axios.post(`${this.baseUrl}/user/create`, data)
    }
    singin(data){
        return axios.post(`${this.baseUrl}/user/login`, data)
    }
    addEbook(data){
        const token = this.getToken()
        return axios.post(`${this.baseUrl}/ebook/add`, data, { headers: { token: token } })
    }
    listAllEbooks(){
        return axios.get(`${this.baseUrl}/ebook/`)
    }
    listUserEbooks(id){
        const token = this.getToken()
        return axios.get(`${this.baseUrl}/ebook/userebook/${id}`, { headers: { token: token } })
    }
    editEbook(id, data){
        const token = this.getToken()
        return axios.put(`${this.baseUrl}/ebook/edit/${id}`, data, { headers: { token: token } })
    }
    deleteEbook(id){
        const token = this.getToken()
        return axios.delete(`${this.baseUrl}/ebook/delete/${id}` , { headers: { token: token } })
    }
    borrowEbook(data){
        const token = this.getToken()
        return axios.post(`${this.baseUrl}/borrow/add`, data , { headers: { token: token } })
    }
    returnBook(id){
        const token = this.getToken()
        return axios.delete(`${this.baseUrl}/borrow/${id}` , { headers: { token: token } })
    }
    userBorrowBook(id){
        const token = this.getToken()
        return axios.get(`${this.baseUrl}/borrow/${id}` , { headers: { token: token } })
    }
}

const api = new Api()
export default api