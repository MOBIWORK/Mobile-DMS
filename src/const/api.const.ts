

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
// const URL_DECODE = `latlng=${37.785834},${-122.406417}&key=${API_KEY}`

//POST
export const POST_USER_LOGIN ='/api/method/mbw_service_v2.api.auth.login';
export const POST_USER_LOGOUT ='/api/method/mbw_service_v2.api.auth.logout';
export const POST_USER_ORGANIZATION =
  '/api/method/mbw_ess_registration.api.ess.organization.get_info_organization';
export const POST_RESET_PASSWORD = URL_PREFIX + '.auth.reset_password';

export const PUT_USER_PROFILE = URL_PREFIX + '.user.update_profile';


// Product
export const GET_PRODUCT = URL_PREFIX +  ".api.selling.product.list_product";
export const GET_BRAND_PRODUCT = URL_PREFIX +  "..api.selling.product.list_brand";
export const GET_INDUSTRY_PRODUCT = URL_PREFIX +  ".api.selling.product.list_industry";
export const GET_GROUP_PRODUCT = URL_PREFIX +  ".api.selling.product.list_item_group";
export const POST_CHECKIN = URL + '.mbw_dms.api.checkin.create_checkin'