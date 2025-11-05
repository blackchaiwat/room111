export const URL_ENDPOINT = "https://developers.promptkai.com";

const URL = {
    LOGIN: `${URL_ENDPOINT}/commercedev/api/admin/loginwithuser`,
    PROFILE: `${URL_ENDPOINT}/commercedev/api/admin/getinfo`,

    PROVINCE: `${URL_ENDPOINT}/commercedev/api/general/province`,
    PRODUCT_TYPE: `${URL_ENDPOINT}/commercedev/api/general/producttype`,
    BANK: `${URL_ENDPOINT}/commercedev/api/general/bank`,

    AUDIENCE_LIST: `${URL_ENDPOINT}/commercedev/api/cms/manage/broadcastaudience/list`,
    AUDIENCE_ADD: `${URL_ENDPOINT}/commercedev/api/cms/manage/broadcastaudience/add`,
    AUDIENCE_EDIT: `${URL_ENDPOINT}/commercedev/api/cms/manage/broadcastaudience/edit`,

    JOB_LIST: `${URL_ENDPOINT}/commercedev/api/cms/manage/job/list`,
    JOB_ADD: `${URL_ENDPOINT}/commercedev/api/cms/manage/job/add`,
    JOB_EDIT: `${URL_ENDPOINT}/commercedev/api/cms/manage/job/edit`,
    JOB_APPROVE: `${URL_ENDPOINT}/commercedev/api/cms/manage/job/approve`,

    INFLU_LIST: `${URL_ENDPOINT}/commercedev/api/cms/manage/influencer/list`,
    INFLU_DETAIL: `${URL_ENDPOINT}/commercedev/api/cms/manage/influencer/detail`,

    SKU_LIST: `${URL_ENDPOINT}/commercedev/api/product/list`,
    SKU_ADD: `${URL_ENDPOINT}/commercedev/api/product/add`,
    SKU_EXPORT: `${URL_ENDPOINT}/commercedev/api/product/export`,
};

export default URL;
