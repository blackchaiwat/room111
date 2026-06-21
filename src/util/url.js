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

    CATEGORY_LIST: `${URL_ENDPOINT}/${path}/api/cms/category/list`,
    CATEGORY_ADD: `${URL_ENDPOINT}/${path}/api/cms/category/add`,
    CATEGORY_EDIT: `${URL_ENDPOINT}/${path}/api/cms/category/edit`,
    CATEGORY_DELETE: `${URL_ENDPOINT}/${path}/api/cms/category/delete`,
    CATEGORY_STATUS: `${URL_ENDPOINT}/${path}/api/cms/category/setstatus`,

    MODEL_LIST: `${URL_ENDPOINT}/${path}/api/cms/model/list`,
    MODEL_ADD: `${URL_ENDPOINT}/${path}/api/cms/model/add`,
    MODEL_EDIT: `${URL_ENDPOINT}/${path}/api/cms/model/edit`,
    MODEL_DELETE: `${URL_ENDPOINT}/${path}/api/cms/model/delete`,
    MODEL_STATUS: `${URL_ENDPOINT}/${path}/api/cms/model/setstatus`,

    MASTER_PRODUCT_TYPE: `${URL_ENDPOINT}/${path}/api/masterdata/producttype`,
    MASTER_MODEL: `${URL_ENDPOINT}/${path}/api/masterdata/model`,
    MASTER_CATEGORY: `${URL_ENDPOINT}/${path}/api/masterdata/category`,
    MASTER_SELLING_UNIT: `${URL_ENDPOINT}/${path}/api/masterdata/sellingunit`,
    MASTER_SALE_TYPE: `${URL_ENDPOINT}/${path}/api/masterdata/saletype`,

};

export default URL;
