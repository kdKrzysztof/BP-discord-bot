import { default as axios } from "axios"
import cors from 'cors-anywhere'
import dotenv from 'dotenv'
import { JSDOM } from "jsdom"
dotenv.config()

var host = process.env.HOST
var port = process.env.PORT

cors.createServer({
    originWhitelist: [],
}).listen(port, host, () => {
    console.log('Running CORS Anywhere on ' + host + ':' + port)
})


const getProfileData = async (a) => {
    const searchURL = `https://www.brickplanet.com/players?search=${a}`
    const respSearch = await axios.get(`http://localhost:8080/${searchURL}`, {
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    },
    console.log("sent verification result")
    )  
    let link = respSearch.data.match(`(?<=https:\/\/www\.brickplanet\.com:8080\/profile\/)(.+?)(?!.+?)`)

    let dataResult = []
    let data = Object.assign({}, link)
    delete data.input
    delete data.index
    let dataJSON = JSON.stringify(data, null, 4)


    if(dataJSON.indexOf(a) > -1){   
        data[0] = data[0].replace(/[^a-z0-9-]/g, ' ')
        dataResult =  data[0].split(' ')
        dataResult = dataResult.filter(n => n)
    }

    const respProfile = await axios.get('http://localhost:8080/${}')
}

export default getProfileData









// dom.window.document.querySelectorAll('a').forEach(e => {
//     let re = new RegExp(`(?<=https:\/\/www\.brickplanet\.com\/profile\/)(.+?)(?=\/${a})`)
//     if (re.test(a)){
//         Links.push(re.input)
//     }
// });
// console.log(a)
// console.log(Links)

// const linkChecker = Links.forEach(e => {
//     if (e.includes(a)){
//         userFound.push(e)
//     } else {
//         return false
//     }
// })