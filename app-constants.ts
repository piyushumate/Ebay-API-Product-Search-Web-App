export class AppConstants {
    public static getCategories(): any {
        return [
            {
                key: "all",
                value: "All Categories"
            },
            {
                key: "art",
                value: "Art"
            },
            {
                key: "baby",
                value: "Baby"
            },
            {
                key: "books",
                value: "Books"
            },
            {
                key: "clothing",
                value: "Clothing, Shoes & Accessories"
            },
            {
                key: "computers",
                value: "Computers/Tablets & Networking"
            },
            {
                key: "health",
                value: "Health & Beauty"
            },
            {
                key: "music",
                value: "Music"
            },
            {
                key: "games",
                value: "Video Games & Consoles"
            }
        ];
    }

    public static getGeoURL(): string {
        return "http://ip-api.com/json"
    }

    public static getSortParams(): any {
        return [
            {
                key  : "default",
                value: "Default"
            },
            {
                key  : "name",
                value: "Product Name"
            },
            {
                key : "days_left",
                value: "Days Left"
            },
            {
                key: "price",
                value: "Price"
            },
            {
                key: "shipping_cost",
                value: "Shipping Cost"
            }
        ];
    }
}
