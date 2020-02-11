import Cookies from 'js-cookie';

enum RequestType {
    GET = "get", 
    POST = "post"
}

class EndpointsItem {
    url: string;
    method: RequestType;
    requireAuth: boolean;

    constructor(url: string, method: RequestType, requireAuth: boolean) {
        this.url = url;
        this.method = method;
        this.requireAuth = requireAuth;
    }
}

export class Endpoints {
    public static login = new EndpointsItem("accounts/login/", RequestType.POST, false);
    public static logout = new EndpointsItem("accounts/logout/", RequestType.GET, true);
    public static ownerRegister = new EndpointsItem("accounts/register/owner/", RequestType.POST, false);
    public static getRestaurant = new EndpointsItem("restaurant_owner/restaurant/get_own", RequestType.GET, true);
    public static editRestaurant = new EndpointsItem("restaurant_owner/restaurant/edit", RequestType.POST, true);
    public static setRestaurantLogo = new EndpointsItem("restaurant_owner/restaurant/logo/set", RequestType.POST, true);
    public static removeRestaurantLogo = new EndpointsItem("restaurant_owner/restaurant/logo/remove", RequestType.POST, true);
    public static getOpeningHours = new EndpointsItem("restaurant_owner/restaurant/opening_hour/get", RequestType.GET, true);
    public static setOpeningHours = new EndpointsItem("restaurant_owner/restaurant/opening_hour/set", RequestType.POST, true);

    public static emergencyAdd = new EndpointsItem("restaurant_owner/restaurant/emergency/add", RequestType.POST, true);
    public static emergencyGetList = new EndpointsItem("restaurant_owner/restaurant/emergency/getAll", RequestType.GET, true);
    public static emergencyRemoveItem = new EndpointsItem("restaurant_owner/restaurant/emergency/remove", RequestType.POST, true);
    public static emergencyEditItem = new EndpointsItem("restaurant_owner/restaurant/emergency/edit", RequestType.POST, true);

    public static getOwnRestaurantMenu = new EndpointsItem("restaurant_owner/restaurant/menu/get", RequestType.GET, true);
    public static menuAddCategory = new EndpointsItem("restaurant_owner/restaurant/menu/category/add", RequestType.POST, true);
    public static menuRemoveCategory = new EndpointsItem("restaurant_owner/restaurant/menu/category/remove", RequestType.POST, true);
    public static menuEditCategory = new EndpointsItem("restaurant_owner/restaurant/menu/category/edit", RequestType.POST, true);
    public static menuEditCategoryUpdateOrder = new EndpointsItem("restaurant_owner/restaurant/menu/category/update_order", RequestType.POST, true);
    
    public static addDish = new EndpointsItem("restaurant_owner/restaurant/menu/item/add", RequestType.POST, true);
    public static addPhotoToMenuItem = new EndpointsItem("restaurant_owner/restaurant/menu/photo/add", RequestType.POST, true);
    public static removePhotoMenu = new EndpointsItem("restaurant_owner/restaurant/menu/photo/remove", RequestType.POST, true);
}

export class QueryManager {
    // private static baseURL = "https://lotino-dev.herokuapp.com/api/v1/";
    private static baseURL = "http://127.0.0.1:8000/api/v1/";
    private static token = "";

    static getQueryExecutor(endpoint: EndpointsItem, dataToSend: any, propHistoryManager: any, config: any,  notifyManager: any) {
        let headersSet = new Map();
        headersSet.set("Authorization", "");

        if(config != null && 'raw' in config){
            // headersSet.set("Content-type", "application/x-www-form-urlencoded");
        }
        else {
            headersSet.set("Content-type", "application/json; charset=UTF-8");
        }

        let queryParameters = {};
        
        if(endpoint.requireAuth) {
            if(QueryManager.token === "") {
                QueryManager.token = "Token " + Cookies.get('csrftoken');
            }

            headersSet.set("Authorization", QueryManager.token);
        }

        if(dataToSend === null) {
            queryParameters = {
                method: endpoint.method,
                headers: headersSet
            };
        }
        else {
            if(config != null && 'raw' in config){
                console.log("aaaa");
                queryParameters = {
                    method: endpoint.method,
                    headers: headersSet,
                    body: dataToSend
                }
            }
            else {
                queryParameters = {
                    method: endpoint.method,
                    headers: headersSet,
                    body: JSON.stringify(dataToSend)
                }
            }
        }
        
        if(endpoint.requireAuth) {
            return fetch(
                this.baseURL + endpoint.url, 
                queryParameters
            )
            .then(response => response.json())
            .then(data => {
                if(typeof data.detail !== undefined && data.detail === "Invalid token.") {
                    propHistoryManager.push('/login');
                }
                return data;
            });
        }
        else {
            return fetch(
                this.baseURL + endpoint.url, 
                queryParameters
            ).then(response => response.json());
        }

    }
}