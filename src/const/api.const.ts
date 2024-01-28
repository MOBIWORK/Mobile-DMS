


export const HEADER_DEFAULT = {
  'Content-Type': 'application/json',
};
export const TIMEOUT = 30000;

// HTTP Status
export const STT_OK = 200;
export const STT_CREATED = 201;
export const STT_BAD_REQUEST = 400;
export const STT_UNAUTHORIZED = 401;
export const STT_FORBIDDEN = 403;
export const STT_NOT_FOUND = 404;
export const STT_REQUEST_TIME_OUT = 408;
export const STT_INTERNAL_SERVER = 500;
export const STT_NOT_MODIFIED = 304;

const URL_PREFIX = '/api/method/mbw_dms';
const URL = '/api/method'
// const URL_PREFIX = '/api/method/mbw_dms';
// const URL_DECODE = `latlng=${37.785834},${-122.406417}&key=${API_KEY}`

// Authentication
export const POST_USER_LOGIN ='/api/method/mbw_service_v2.api.auth.login';
export const POST_USER_LOGOUT ='/api/method/mbw_service_v2.api.auth.logout';
export const POST_USER_ORGANIZATION =
  '/api/method/mbw_ess_registration.api.ess.organization.get_info_organization';
export const POST_RESET_PASSWORD = URL_PREFIX + '.auth.reset_password';

// Profile
export const PUT_USER_PROFILE = URL_PREFIX + '.user.update_profile';
export const POST_CHECKIN =  '/api/method/mbw_dms.api.checkin.create_checkin'


// Product
export const GET_PRODUCT = URL_PREFIX +  ".api.selling.product.list_product";
export const GET_BRAND_PRODUCT = URL_PREFIX +  "..api.selling.product.list_brand";
export const GET_INDUSTRY_PRODUCT = URL_PREFIX +  ".api.selling.product.list_industry";
export const GET_GROUP_PRODUCT = URL_PREFIX +  ".api.selling.product.list_item_group";
export const GET_PRICE_PRODUCT = URL_PREFIX +  ".api.selling.order.price_list";
export const GET_PRODUCT_PROMOTION = URL_PREFIX +  ".api.selling.order.pricing_rule";


// Customer

export const GET_CUSTOMER = '/api/method/mbw_dms.api.selling.customer.list_customer'
export const GET_TYPE_CUSTOMER = '/api/method/mbw_dms.api.selling.customer.list_customer_type'
export const GET_SYSTEM_CONFIG ='/api/method/mbw_dms.api.config_mobile.get_list_config_mobile'
export const GET_CUSTOMER_VISIT = '/api/method/mbw_dms.api.router.get_customer_router'



// Order
export const GET_ORDER = URL_PREFIX +  ".api.selling.order.get_list_sales_order";
export const GET_ORDER_DETAIL = URL_PREFIX +  ".api.selling.order.get_sale_order";
export const GET_WAREHOUSES = URL_PREFIX + ".api.selling.product.list_warehouse";
export const GET_VATS = URL_PREFIX + ".api.selling.product.list_vat";
export const POST_ORDER = URL_PREFIX + ".api.selling.order.create_sale_order";

// Inventory
export const POST_CHECKIN_INVENTORY = URL_PREFIX + ".api.checkin.create_checkin_inventory"; 