import request from "./request";

export const getEstateList = query => {
  let newQuery = { ...query };
  if (newQuery.Page && newQuery.Page > 0) {
    newQuery.Page--;
  }
  for (let prop in newQuery) {
    if (typeof newQuery[prop] == "object" && !newQuery[prop].length) {
      delete newQuery[prop];
    }
  }
  return request({
    baseURL:
      "http://webservices.whoman2.be/websiteservices/EstateService.svc/GetEstateList",
    method: "get",
    params: { EstateServiceGetEstateListRequest: newQuery }
  });
};

export const fetchLanguages = () => {
  return request({
    baseURL:
      "https://sbs.whise.eu/websiteservices/EstateService.svc/GetLanguageList",
    method: "get",
    params: { EstateServiceGetLanguageListRequest: { ClientID: "1" } }
  });
};

export const fetchCountries = lang => {
  return request({
    url:
      " http://webservices.whoman2.be/websiteservices/EstateService.svc/GetCountryList",
    method: "get",
    params: { EstateServiceGetCountryListRequest: { Language: lang } }
  });
};
