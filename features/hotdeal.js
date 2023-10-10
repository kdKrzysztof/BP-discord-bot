import getApi from '../components/getApi.js';
import { parse } from 'node-html-parser';
import dotenv from 'dotenv';
import { DealMessenger } from '../components/messenger.js';
import DiscordJS, { Intents } from 'discord.js';
dotenv.config();

let oldPrice = 0;
let oldStuff = [];
let alreadyDetected = '';
let alreadyDetectedStacked = '';
let number = 0;

const hotdeal = async (data) => {
  console.log(
    `Old price: ${oldPrice}, already detected: ${alreadyDetected}, specialHotdealsNumber: ${number}`
  );
  try {
    let root = parse(data, {
      lowerCaseTagName: false,
      comment: false,
      blockTextElements: {
        script: false,
        noscript: false,
        style: false,
        pre: true
      }
    });

    root.querySelectorAll('.card.position-relative.h-100').forEach((e) => {
      let price = e.querySelector('.text-credits').innerText.trim().replace(/,/, '') ?? undefined;
      let url = e.childNodes[1].attributes['href'];
      let snipeName = e.childNodes[3].childNodes[1].childNodes[3].childNodes[1].innerText.trim();
      let dealImage = e.childNodes[1].getElementsByTagName('img')[0].attributes['src'];
      let stackedName = (price + snipeName.replaceAll(' ', '')).trim();

      if (snipeName === 'Christmas Unique Crate #1') {
        return;
      }

      if (price === undefined || url === undefined) {
        return;
      }

      if (snipeName === alreadyDetected && price !== oldPrice && oldPrice !== 0) {
        oldPrice = 0;
        return;
      }

      if (price <= 1200 && price !== oldPrice) {
        if (snipeName === alreadyDetected) {
          if (price !== oldPrice) {
            oldPrice = price;
            alreadyDetected = snipeName;
            DealMessenger(snipeName, price, dealImage, url);
            console.log(`Snipe: ${snipeName}, \n url: ${url}, \n price: ${price}`);
          } else {
            return;
          }
        } else if (stackedName !== alreadyDetectedStacked) {
          number = number + 1;
          oldPrice = price;
          alreadyDetected = snipeName;
          alreadyDetectedStacked = stackedName;
          DealMessenger(snipeName, price, dealImage, url);
          console.log(`Snipe: ${snipeName}, \n url: ${url}, \n price: ${price}`);
        }
      }
    });
  } catch (err) {
    console.log(err);
  }
};

export default hotdeal;
