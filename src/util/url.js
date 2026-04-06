export const URL_ENDPOINT = "https://developers.promptkai.com";

const path = 'commerce' // commercedev, commerce

const URL = {
    LOGIN: `${URL_ENDPOINT}/${path}/api/admin/loginwithuser`,
    PROFILE: `${URL_ENDPOINT}/${path}/api/admin/getinfo`,

    DASHBOARD: `${URL_ENDPOINT}/${path}/api/cms/dashboard/commerce`,
    ORDER_LIST: `${URL_ENDPOINT}/${path}/api/cms/order/list`,
    ORDER_DETAIL: `${URL_ENDPOINT}/${path}/api/cms/order/detail`,
    ORDER_MASTER: `${URL_ENDPOINT}/${path}/api/cms/order/masterdata`,

    PRODUCT_LIST: `${URL_ENDPOINT}/${path}/api/cms/zortproduct/list`,
    PRODUCT_MASTER: `${URL_ENDPOINT}/${path}/api/cms/product/masterdata`,

    CUSTOMER_LIST: `${URL_ENDPOINT}/${path}/api/cms/customer/list`,

    SKU_LIST: `${URL_ENDPOINT}/${path}/api/product/list`,
    SKU_ADD: `${URL_ENDPOINT}/${path}/api/product/add`,
    SKU_EXPORT: `${URL_ENDPOINT}/${path}/api/product/export`,
};

export default URL;
