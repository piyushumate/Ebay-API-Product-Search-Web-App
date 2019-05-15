export class ProductSearch {
    constructor(
        public keyword   : string,
        public category  : object,
        public condition : {"New": false, "Used": false, "Unspecified": false},
        public shipping_options  : {'LocalPickupOnly': false, 'FreeShippingOnly': false},
        public distance  : string,
        public zip_code  : string,
        public location  : string
    ){}
}


