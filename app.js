const express = require('express')
const app = express()
const port = 8081
const constants = require('./constants')
const helpers = require('./helpers')
const bodyParser = require('body-parser')
const _ = require('underscore')
const path = require('path');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('public'))


app.get('/', (req, res) => res.sendFile(path.join(__dirname+'/index.html')))

app.post('/products', function (req, res) {

    base_url = helpers.construct_base_url(
        constants.EBAY_FINDING_API_URL,
        constants.EBAY_FINDING_API_CONSTANTS
    )
    console.log(req.body);
    request_url = base_url + '&' + helpers.array_mapper(helpers.construct_query_array(req.body))
    console.log(request_url);
    request_promise = helpers.http_request_wrapper(request_url)

    request_promise.then(function(result) {
        //helpers.parse_products_response(result)
        let parsed_response = helpers.parse_products_response(result);

        if (_.has(parsed_response,"error")) {
            res.status(500).json(parsed_response)
        } else {
            res.json(parsed_response);
        }

    }, function(err) {
        console.log(err);
    })
})


app.get('/product/:id', function (req, res) {
    base_url = helpers.construct_base_url(
        constants.EBAY_SHOPPING_API_URL,
        constants.EBAY_SHOPPING_API_CONSTANTS
    )
    console.log(req.params)
    request_url = base_url + '&ItemId=' + req.params.id;
    console.log(request_url);
    request_promise = helpers.http_request_wrapper(request_url)

    request_promise.then(function(result) {
        let parsed_response = helpers.parse_product_response(result)
       if(_.has(parsed_response,"error")) {
           res.status(500).json(parsed_response)
       } else {
           //helpers.parse_product_response(result)
           res.json(parsed_response);
       }

    }, function(err) {
        console.log(err);
    })
})

app.get('/similar_items/:product_id', function (req, res) {
    base_url = helpers.construct_base_url(
        constants.EBAY_MERCHANDISING_API_URL,
        constants.EBAY_MERCHANDISING_API_CONSTANTS
    )

    request_url = base_url + '&itemId=' + req.params.product_id;
    request_promise = helpers.http_request_wrapper(request_url)

    request_promise.then(function(result) {
        res.json(helpers.parse_similar_items_response(result));
    }, function(err) {
        console.log(err);
    })
})


app.post('/product_images' , function(req, res) {
    base_url = helpers.construct_base_url(
        constants.GOOGLE_API_URL,
        constants.GOOGLE_API_CONSTANTS
    )

    request_url = base_url + '&q=' + encodeURI(req.body.search_query);
    console.log(req.body);
    console.log(request_url);
    request_promise = helpers.http_request_wrapper(request_url)
    request_promise.then(function(result) {
        res.json(helpers.parse_google_image_result(result));
    }, function(err) {
        console.log(err);
    })
})

app.get('/get_zip', function(req, res) {
    base_url = helpers.construct_base_url(
        constants.GEONAME_API_URL,
        constants.GEONAME_API_CONSTANTS
    )

    request_url = base_url + "&postalcode_startsWith=" + req.query["zip-code"]
    console.log(request_url);
    request_promise = helpers.http_request_wrapper(request_url)
    request_promise.then(function(result) {
        res.json(helpers.parse_zip_code(result));
    }, function(err) {
        res.json(err);
    })
})



app.listen(port, () => console.log(`Example app listening on port ${port}!`))