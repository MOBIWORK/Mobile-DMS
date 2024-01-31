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
const URL = '/api/method';
// const URL_PREFIX = '/api/method/mbw_dms';
// const URL_DECODE = `latlng=${37.785834},${-122.406417}&key=${API_KEY}`

// Authentication
export const POST_USER_LOGIN = '/api/method/mbw_service_v2.api.auth.login';
export const POST_USER_LOGOUT = '/api/method/mbw_service_v2.api.auth.logout';
export const POST_USER_ORGANIZATION =
  '/api/method/mbw_ess_registration.api.ess.organization.get_info_organization';
export const POST_RESET_PASSWORD = URL_PREFIX + '.auth.reset_password';

// Profile
export const PUT_USER_PROFILE = URL_PREFIX + '.user.update_profile';
export const POST_CHECKIN = '/api/method/mbw_dms.api.checkin.create_checkin';

// Product
export const GET_PRODUCT = URL_PREFIX + '.api.selling.product.list_product';
export const GET_BRAND_PRODUCT =
  URL_PREFIX + '..api.selling.product.list_brand';
export const GET_INDUSTRY_PRODUCT =
  URL_PREFIX + '.api.selling.product.list_industry';
export const GET_GROUP_PRODUCT =
  URL_PREFIX + '.api.selling.product.list_item_group';
export const GET_PRICE_PRODUCT = URL_PREFIX + '.api.selling.order.price_list';
export const GET_PRODUCT_PROMOTION =
  URL_PREFIX + '.api.selling.order.pricing_rule';

// Customer

export const GET_CUSTOMER =
  '/api/method/mbw_dms.api.selling.customer.list_customer';
export const GET_TYPE_CUSTOMER =
  '/api/method/mbw_dms.api.selling.customer.list_customer_type';
export const GET_SYSTEM_CONFIG =
  '/api/method/mbw_dms.api.config_mobile.get_list_config_mobile';
export const GET_CUSTOMER_VISIT =
  '/api/method/mbw_dms.api.router.get_customer_router';
export const UPDATE_CUSTOMER_ADDRESS =
  '/api/method/mbw_dms.api.checkin.update_address_customer';
export const CHECK_FAKE_GPS =
  '/api/method/mbw_dms.api.blacklist.insert_fake_gps';

// Order
export const GET_ORDER = URL_PREFIX + '.api.selling.order.get_list_sales_order';
export const GET_ORDER_DETAIL =
  URL_PREFIX + '.api.selling.order.get_sale_order';
export const GET_VATS = URL_PREFIX + '.api.selling.product.list_vat';
export const POST_ORDER = URL_PREFIX + '.api.selling.order.create_sale_order';
export const POST_RETuRN_ORDER = URL_PREFIX + '.api.selling.order.create_return_order';
export const GET_WAREHOUSES =
  URL_PREFIX + '.api.selling.product.list_warehouse';

//Address
export const GET_LIST_CITY = '/mbw_dms.api.location.list_province';
export const GET_LIST_DISTRICT = '/mbw_dms.api.location.list_district?ma_tinh=';
export const GET_LIST_WARD = '/mbw_dms.api.location.list_ward?ma_quan_huyen=';

// Inventory
export const POST_CHECKIN_INVENTORY =
  URL_PREFIX + '.api.checkin.create_checkin_inventory';

export const POST_NOTE_CHECKIN = URL_PREFIX + ".api.note.create_note";
export const GET_LIST_STAFF = URL_PREFIX + ".api.note.list_email";
// NOTE
export const POST_NEW_NOTE_CHECKIN = '/mbw_dms.api.note.create_note';
export const GET_NOTE_USER_RECEIVED = '/mbw_dms.api.note.list_email';
export const GET_LIST_NOTE_API = '/mbw_dms.api.note.list_note'

// IMAGE_CHECKIN
export const PUT_IMAGE_CHECKIN = '/mbw_dms.api.checkin.add_checkin_image'
export const POST_NOTE_CHECKIN = URL_PREFIX + ".api.note.create_note";
export const GET_LIST_STAFF = URL_PREFIX + ".api.note.list_email";
