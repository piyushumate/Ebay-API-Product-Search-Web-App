'use strict';

let constants = {
    EBAY_FINDING_API_URL        : "http://svcs.ebay.com/services/search/FindingService/v1",
    EBAY_SHOPPING_API_URL       : "http://open.api.ebay.com/shopping",
    EBAY_MERCHANDISING_API_URL  : "http://svcs.ebay.com/MerchandisingService",
    EBAY_ID                     : "PiyushUm-csci571-PRD-016e08212-b20ee7dd",
    RESPONSE_DATA_FORMAT        : "JSON",
    GOOGLE_API_URL              : "https://www.googleapis.com/customsearch/v1",
    GEONAME_API_URL             : "http://api.geonames.org/postalCodeSearchJSON"
};

constants.EBAY_FINDING_API_CONSTANTS  =  {
        "OPERATION-NAME"                    :   "findItemsAdvanced",
        "SERVICE-VERSION"                   :   "1.0.0",
        "SECURITY-APPNAME"                  :   constants.EBAY_ID,
        "RESPONSE-DATA-FORMAT"              :   constants.RESPONSE_DATA_FORMAT,
        "REST-PAYLOAD"                      :   null,
        "paginationInput.entriesPerPage"    :   "50",
        "outputSelector(0)"                 :   "SellerInfo",
        "outputSelector(1)"                 :   "StoreInfo"
};


constants.EBAY_SHOPPING_API_CONSTANTS =  {
        "callname"                          :   "GetSingleItem",
        "responseencoding"                  :   constants.RESPONSE_DATA_FORMAT,
        "appid"                             :   constants.EBAY_ID,
        "siteid"                            :   "0",
        "version"                           :   "967",
        "IncludeSelector"                   :   "Description,Details,ItemSpecifics"
};

constants.EBAY_MERCHANDISING_API_CONSTANTS =  {
        "OPERATION-NAME"                    :   "getSimilarItems",
        "SERVICE-NAME"                      :   "MerchandisingService",
        "SERVICE-VERSION"                   :   "1.1.0",
        "CONSUMER-ID"                       :   constants.EBAY_ID,
        "RESPONSE-DATA-FORMAT"              :   constants.RESPONSE_DATA_FORMAT,
        "REST-PAYLOAD"                      :   null,
        "maxResults"                        :   20
};

constants.GOOGLE_API_CONSTANTS = {
        "cx"           :     "007269891257124559722:aujvomfdute",
        "key"          :     "AIzaSyBqxlf1BoiaXbsO-I_bcCANEXAT-h3j9hQ",
        "imgSize"      :     "huge",
        "num"          :     8,
        "imgType"      :     "news",
        "searchType"   :     "image"
};

constants.GEONAME_API_CONSTANTS = {
        "username"  :   "piyushumate",
        "country"   :   "US",
        "maxRows"   :   "5"
};

constants.CATEGORY_ID_MAP = {
    art       : 550,
    baby      : 2984,
    books     : 267,
    clothing  : 11450,
    computers : 58058,
    health    : 26395,
    music     : 11233,
    games     : 1249
};


module.exports = Object.freeze(constants);