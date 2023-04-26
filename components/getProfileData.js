import getApi from './getApi.js';
import dotenv from 'dotenv';
import { parse } from 'node-html-parser';
dotenv.config();

const getProfileData = async (a) => {
  const searchURL = `https://www.brickplanet.com/players?search=${a}`;
  const respSearch = await fetch(searchURL);
  const respSearchBody = await respSearch.text();
  let link = respSearchBody.match(`(?<=https:\/\/www\.brickplanet\.com\/profile\/)(.+?)(?!.+?)`);

  let dataResult = [];
  let data = Object.assign({}, link);
  delete data.input;
  delete data.index;
  let dataJSON = JSON.stringify(data, null, 4);

  if (dataJSON.indexOf(a) > -1) {
    data[0] = data[0].replace(/[^a-z0-9-]/g, ' ');
    dataResult = data[0].split(' ');
    dataResult = dataResult.filter((n) => n);
  }

  let userID = dataResult[0];
  let username = dataResult[1];
  console.log(userID, username);

  const profileURL = `https://www.brickplanet.com/profile/${userID}/${username}`;
  const respProfile = await fetch(profileURL);
  const respProfileBody = await respProfile.text();

  let profileBodyParser = parse(respProfileBody);

  return [
    profileBodyParser.querySelector('.card.text-sm.card-body.mb-4').innerText.trim(),
    username
  ];
};

export default getProfileData;

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
