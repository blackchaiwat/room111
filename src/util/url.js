export const URL_ENDPOINT = "https://developers.promptkai.com";

const URL = {
    LOGIN: `${URL_ENDPOINT}/commercedev/api/admin/loginwithuser`,
    PROFILE: `${URL_ENDPOINT}/commercedev/api/admin/getinfo`,

    DASHBOARD: `${URL_ENDPOINT}/commercedev/api/cms/dashboard/commerce`,
    ORDER_LIST: `${URL_ENDPOINT}/commercedev/api/cms/order/list`,
    ORDER_DETAIL: `${URL_ENDPOINT}/commercedev/api/cms/order/detail`,
    ORDER_MASTER: `${URL_ENDPOINT}/commercedev/api/cms/order/masterdata`,

    PRODUCT_LIST: `${URL_ENDPOINT}/commercedev/api/cms/zortproduct/list`,
    PRODUCT_MASTER: `${URL_ENDPOINT}/commercedev/api/cms/product/masterdata`,

    CUSTOMER_LIST: `${URL_ENDPOINT}/commercedev/api/cms/customer/list`,

    SKU_LIST: `${URL_ENDPOINT}/commercedev/api/product/list`,
    SKU_ADD: `${URL_ENDPOINT}/commercedev/api/product/add`,
    SKU_EXPORT: `${URL_ENDPOINT}/commercedev/api/product/export`,
};

export default URL;
