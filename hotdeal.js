import { default as axios } from "axios"
import { JSDOM } from "jsdom"
import dotenv from 'dotenv'
dotenv.config()

var host = process.env.HOST
var port = process.env.PORT



const getApi = async (a) => {
    const resp = await axios.get(`http://localhost:8080/${a}`, {
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    },
    console.log("sent resp")
    )
    return resp.data
}

const BP_API_RARES = `https://www.brickplanet.com/shop/search?featured=0&rare=1&type=0&search=&sort_by=5&page=1`



export default hotdeal