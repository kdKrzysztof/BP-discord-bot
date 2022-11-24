import {parse} from 'node-html-parser';
import dotenv from 'dotenv'
dotenv.config()
import {RareMessenger} from './messenger.js'
import getApi from './getApi.js'

const BP_API_RARES = `https://www.brickplanet.com/shop/search?featured=0&rare=1&type=0&search=&sort_by=5&page=1`
const BP_API_normals = `https://www.brickplanet.com/shop/search?featured=0&rare=0&type=1&search=&sort_by=5&page=1`
const BP_API_BUNDLES = `https://www.brickplanet.com/shop/search?featured=0&rare=0&type=6&search=&sort_by=0&page=1`
const BP_API_newShirts = `https://www.brickplanet.com/shop/search?featured=0&rare=0&type=6&search=&sort_by=5&page=1`

let start = 0
let name
let creator
let priceCredits
let priceBits
let priceFree
let stock
let category
let oldRare
let secondOldRare
let ItemLink
let itemRaresList = []
let ItemRaresImgList = []

const Rares = setInterval(async () => {
    console.log('number:' + start)
    itemRaresList = []
    ItemRaresImgList = []

    const data = await getApi(BP_API_RARES)
    
    let root = parse(data, {
        lowerCaseTagName: false,
        comment: false,
        blockTextElements: {
            script: false,
            noscript: false,
            style: false,
            pre: true,
        }
    })
    
    name = root.querySelectorAll('.d-block.truncate.text-decoration-none.fw-semibold.text-light.mb-1')[0]?.structuredText.trim()
    
    if (name === undefined) {   // checking if API is still working correctly and not sending undefined values
        console.log('error, undefined link')
        return
    }

    priceCredits = root.querySelectorAll('.d-flex.flex-column.gap-1.text-center.text-sm.my-2')[0]?.getElementsByTagName('div')[0]?.structuredText.trim()
    priceBits = root.querySelectorAll('.d-flex.flex-column.gap-1.text-center.text-sm.my-2')[0]?.getElementsByTagName('div')[1]?.structuredText.trim()
    priceFree = root.querySelectorAll('.d-flex.flex-column.gap-1.text-center.text-sm.my-2')[0]?.getElementsByTagName('span')[0]?.structuredText.trim()
    stock = root?.querySelectorAll('span.badge.bg-danger')[0]?.structuredText.trim()
    category = root.querySelectorAll('.text-xs.text-muted.fw-semibold.text-uppercase.my-2')[0]?.structuredText.trim()

    if (category !== undefined) {
        category = category.slice(0, category.length - 1)
    }
    creator = root.querySelectorAll('.text-info')[0]?.structuredText.trim()
    
    // stock = dom.window.document.querySelector('span.badge.bg-danger').textContent.trim().slice(0,2)
    root.querySelectorAll('a.d-block.position-relative').forEach(e => {
        itemRaresList.push(e.attributes['href'].trim())
    })
    
    root.querySelectorAll('img').forEach(e => {
        ItemRaresImgList.push(e.attributes['src'].trim())
    })
    
    
    if (secondOldRare === undefined) {
        secondOldRare = itemRaresList[1]
        return
    }
    
    console.log('Second old rare is:' + secondOldRare)
    
    if (oldRare === itemRaresList[0]) {return}
    oldRare = itemRaresList[0]
    
    if (oldRare === secondOldRare) {return}
    secondOldRare = itemRaresList[1]
    
    ItemLink = itemRaresList[0] 
    

    start = start + 1
    
    console.log(`${ItemLink}, \n Name: ${name} \n Creator: ${creator}, \n Credits: ${priceCredits}, \n Bits: ${priceBits}, \n URL: ${ItemRaresImgList[0]}`)
    
    if (start <= 1) {return}


    RareMessenger(category, name, priceCredits, priceBits, priceFree, ItemLink, creator, stock, ItemRaresImgList[0])

}, 3000);


export default Rares