const { config } = require("process");

const axios = require("axios").default;


const SERVER_URL_PRODUCT = "https://bnbplus.jp";
const BNBP_LOGIN_USER = "admin@bnbplus.jp";
const BNBP_LOGIN_PWD = "bnbp2018";

const LOGIN_API_URL = "/api/bnb-admin-login";
const USER_INFO = "/api/users/info/";

async function postRequest({ url, token, params }){
  const fullLink = SERVER_URL_PRODUCT + url;
  const headerConfig = token ? { headers: { "X-Auth-Token": token } } : null;

  const requestParam = {
    appData: params,
  };
  const res = await axios.post(fullLink, requestParam, headerConfig);
  return res.data;
};

async function getRequest({ url, token, params }){
  const fullLink = SERVER_URL_PRODUCT + url + params;
  const headerConfig = token ? { headers: { "X-Auth-Token": token } } : null;
  const res = await axios.get(fullLink, headerConfig);
  return res.data;
};

async function login(){
  const usr = { username: BNBP_LOGIN_USER, password: BNBP_LOGIN_PWD };
  const res = await postRequest({
    url: LOGIN_API_URL,
    token: null,
    params: usr,
  });
  if (res && !res.hasError) {
    return res.appData.token;
  }
};

async function getUserInfo({ sub, token }){
  const res = await getRequest({ url: USER_INFO, token: token, params: sub });
  if (res && !res.hasError) {
    return res.appData;
  }
};

module.exports = {
  login,
  getUserInfo,
};
