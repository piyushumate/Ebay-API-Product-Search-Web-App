const constants = require('./constants')
const _ = require('underscore')
const request = require('request')

module.exports = {

    array_mapper: function(array) {
        return Object.entries(array)
            .filter(([k,v]) => v)
            .map(ar => ar.join("="))
            .join("&");
    },


    construct_base_url: function(url, params) {
        return url + '?' + this.array_mapper(params);
    },

    construct_query_array: function (json) {
        query_array = {
            keywords : encodeURI(json.keyword)
        };



        query_array.buyerPostalCode = json.zip_code;


        if(json.category != "all") {
            query_array.categoryId = constants.CATEGORY_ID_MAP[json.category];
        }

        index = 0;
        query_array["itemFilter(" + index + ").name"] = "HideDuplicateItems";
        query_array["itemFilter(" + index + ").value"] = "true";
        index += 1;


        query_array["itemFilter(" + index + ").name"] = "MaxDistance";
        query_array["itemFilter(" + index + ").value"] = json.distance;
        index += 1;



        if(!_.isEmpty(json.condition)) {
            query_array["itemFilter(" + index + ").name"] = "Condition";
            condition_index = 0;
            _.each(json.condition, function(condition) {
                query_array["itemFilter(" + index + ").value(" + condition_index +")"] = condition;
                condition_index += 1;
            });
            index += 1;
        }


        _.each(json.shipping_options, function(value, key) {
            //check value as boolean
            if(value == true) {
                query_array["itemFilter(" + index + ").name"] = key;
                query_array["itemFilter(" + index + ").value"] = value;
                index += 1;
            }
        })

        return query_array;
    },

    parse_product: function(products) {
        parsed_items = [];
        index = 1;

        _.each(products, function (product) {
            let parsed_product = {
                "Index"     : "N/A",
                "Photo"     : "N/A",
                "Name"      : "N/A",
                "Price"     : "N/A",
                "Shipping"  : "N/A",
                "zip_code"  : "N/A",
                "Seller"    : "N/A",
                "Item ID"   : "N/A",
                "Condition" : "N/A"
            }

            parsed_product.Index = index;
            if (_.has(product,"itemId") && !_.isEmpty(product.itemId)) {
                parsed_product["Item ID"] = product["itemId"][0];
            }
            //change this
            if (_.has(product,"galleryURL") && !_.isEmpty(product["galleryURL"])) {
                parsed_product["Photo"] = product["galleryURL"][0];
            }
            if (_.has(product,"title") && !_.isEmpty(product["title"])) {
                parsed_product["Name"] = product["title"][0];
            }

            if (_.has(product,"sellingStatus") && !_.isEmpty(product["sellingStatus"]) &&
                _.has(product["sellingStatus"][0],"currentPrice")) {
                if(!_.isEmpty(product["sellingStatus"][0]["currentPrice"])) {
                    parsed_product["Price"] = product["sellingStatus"][0]["currentPrice"][0];
                }
            }
            if (_.has(product,"postalCode") && !_.isEmpty(product["postalCode"])) {
                parsed_product["zip_code"] = product["postalCode"][0];
            }
            if (_.has(product,"condition") && !_.isEmpty(product["condition"])) {
                parsed_product["Condition"] = product["condition"][0];
            }
            if (_.has(product,"shippingInfo") && !_.isEmpty(product["shippingInfo"])) {
                parsed_product["Shipping"] = product["shippingInfo"][0]
            }

            if(_.has(product, "sellerInfo") && !_.isEmpty(product["sellerInfo"])) {
                parsed_product["Seller"] = product["sellerInfo"][0];
            }
            index += 1;
            parsed_items.push(parsed_product);
        })
        return parsed_items;
    },

    parse_products_response: function(response) {
        parsed_response = {}
        if (!_.has(response,'findItemsAdvancedResponse')) {
            parsed_response.error = "Invalid response from Ebay API. Missing key findItemsAdvancedResponse";
        } else {
            if(_.isEmpty(response['findItemsAdvancedResponse'])) {
                parsed_response.error = "Invalid response from Ebay API. Empty findItemsAdvancedResponse";
            } else {
                if(!_.has(response['findItemsAdvancedResponse'][0], 'ack')) {
                    parsed_response.error = "Invalid response from Ebay API. Missing key ack";
                } else {
                    if (!_.contains(response['findItemsAdvancedResponse'][0]['ack'], 'Success')) {
                        parsed_response.error = "Invalid Ebay API Query";
                    } else {
                        if(!_.has(response['findItemsAdvancedResponse'][0],'searchResult')) {
                            parsed_response.error = "Invalid response from Ebay API. Missing key searchResult";
                        } else {
                            if(!_.has(response['findItemsAdvancedResponse'][0]['searchResult'][0],"item")) {
                                parsed_response.error = "No Records.";
                            } else {
                                let items = response['findItemsAdvancedResponse'][0]['searchResult'][0]['item'];
                                parsed_response.data = this.parse_product(items);
                            }
                        }
                    }
                }
            }
        }
        return parsed_response;
    },

    http_request_wrapper: function(url) {
        // Setting URL and headers for request
        var options = {
            url: url,
            headers: {
                'User-Agent': 'request'
            }
        };

        // Return new promise
        return new Promise(function(resolve, reject) {
            // Do async job
            request.get(options, function(err, resp, body) {
                if (err) {
                    console.log("error flag");
                    reject(err);
                } else {
                    resolve(JSON.parse(body));
                }
            })
        })
    },

    parse_product_response: function(response) {
        parsed_response = {}
        if (!_.has(response,"Ack")) {
            parsed_response.error = "Invalid response from Ebay API. Missing key Ack";
        } else {
            if (response["Ack"] != "Success") {
                parsed_response.error = "Invalid Ebay API Query";
            } else {
                if (!_.has(response,"Item")) {
                    parsed_response.error = "Item key doesnt exist in Ebay API response";
                } else {
                    parsed_response.data = {}
                    item = response["Item"];
                    if(_.has(item,"PictureURL") && !_.isEmpty(item["PictureURL"])) {
                        parsed_response.data["Product Images"] = item["PictureURL"];
                    }

                    if(_.has(item,"Title")) {
                        parsed_response.data.Title = item["Title"];
                    }

                    if(_.has(item,"Subtitle")) {
                        parsed_response.data["Subtitle"] = item["Subtitle"];
                    }

                    if(_.has(item,"CurrentPrice")) {
                        parsed_response.data["Price"] = {
                            "@currencyId"   :  item["CurrentPrice"]["CurrencyID"],
                            "__value__"     :  item["CurrentPrice"]["Value"]
                        }
                    }

                    if(_.has(item,"Location")) {
                        parsed_response.data["Location"] = item["Location"];
                    }


                    if(_.has(item,"ReturnPolicy") &&
                        _.has(item["ReturnPolicy"],"ReturnsWithin") &&
                        _.has(item["ReturnPolicy"], "ReturnsAccepted")) {
                        returnPolicy = item["ReturnPolicy"];
                        parsed_response.data["Return_Policy_(US)"] = returnPolicy["ReturnsAccepted"] + " within "  + returnPolicy["ReturnsWithin"];
                        parsed_response.data["Returns_Accepted"] = returnPolicy["ReturnsAccepted"]
                    }

                    if(_.has(item, "Seller")) {
                        parsed_response.data["Seller"] = item["Seller"]
                    }

                    if(_.has(item,  "Storefront")) {
                        parsed_response.data["Storefront"] = item["Storefront"]
                    }

                    if(_.has(item, "ViewItemURLForNaturalSearch")) {
                        parsed_response.data["item_url"] = item["ViewItemURLForNaturalSearch"]
                    }

                    if(_.has(item,"ItemSpecifics") &&
                        _.has(item["ItemSpecifics"],"NameValueList")) {
                        nameValueList = item["ItemSpecifics"]["NameValueList"];
                        _.each(nameValueList, function(nameValue) {
                            //index check
                            if (!_.isEmpty(nameValue["Value"])) {
                                parsed_response.data[nameValue["Name"]] = nameValue["Value"][0];
                            }
                        })
                    }


                }
            }
        }
        return parsed_response;
    },


    parse_similar_items_response: function(response) {
        get_days = function(string) {
            return string.substring(
                string.lastIndexOf("P") + 1,
                string.lastIndexOf("D")
            );
        }

        parsed_response = {};
        if(!_.has(response,"getSimilarItemsResponse")) {
                parsed_response.error = "Invalid response from Ebay API. Missing key getSimilarItemsResponse";
        } else {
            if(!_.has(response["getSimilarItemsResponse"],"ack")) {
                parsed_response.error = "Invalid response from Ebay API. Missing key ack";
            } else {
                if(response["getSimilarItemsResponse"]["ack"] != "Success") {
                    parsed_response.error = "Invalid response from Ebay API. ack returning failure";
                } else {
                    if(!_.has(response["getSimilarItemsResponse"], "itemRecommendations")) {
                        parsed_response.error = "Invalid response from Ebay API. itemRecommendations key missing";
                    } else {
                        if(!_.has(response["getSimilarItemsResponse"]["itemRecommendations"],"item")) {
                            parsed_response.error = "Invalid response from Ebay API. item key missing";
                        } else {
                            parsed_items = [];
                            items = response["getSimilarItemsResponse"]["itemRecommendations"]["item"];
                            _.each(items, function (item) {
                                parsed_item = {
                                    "itemId"         : _.has(item,"itemId")         ? item["itemId"]: null,
                                    "title"          : _.has(item,"title")          ? item["title"]: "",
                                    "image_url"      : _.has(item,"imageURL")       ? item["imageURL"]: "",
                                    "price"          : _.has(item, "buyItNowPrice") ? item["buyItNowPrice"]: {},
                                    "shipping_price" : _.has(item, "shippingCost")  ? item["shippingCost"]: {},
                                    "days_left"      : _.has(item, "timeLeft")      ? get_days(item["timeLeft"]): null,
                                    "item_url"       : _.has(item,  "viewItemURL") ? item["viewItemURL"]: null
                                };
                                parsed_items.push(parsed_item);
                            })
                            parsed_response.data = parsed_items;
                        }
                    }
                }
            }
        }
        return parsed_response;
    },

    parse_google_image_result: function (response) {
        parsed_response = []

        if(_.has(response, "items")) {
            _.each(response["items"], function (item) {
                if(_.has(item, "link"))
                    parsed_response.push(item["link"])
            })
        }
        return parsed_response
    },

    parse_zip_code: function(response) {
        parsed_response = {}

        if(_.has(response, "postalCodes")) {
            postalCodes = []
            _.each(response["postalCodes"], function (postalCodeObj) {
                if(_.has(postalCodeObj, "postalCode")) {
                    postalCodes.push(postalCodeObj["postalCode"]);
                }
            })
            parsed_response.data = postalCodes;
            return parsed_response;
        } else {
            return {"error": "Failed to retrieve zip codes"}
        }
    }
}

