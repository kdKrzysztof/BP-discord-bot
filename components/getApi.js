const getApi = async (a) => {
  try {
    const resp = await fetch(a);
    const respText = await resp.text();
    console.log('received data');
    return respText;
  } catch (err) {
    console.log(err);
  }
};

export default getApi;
