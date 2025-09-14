export const URL_ENDPOINT = "https://developers.promptkai.com";

const URL = {
    LOGIN: `${URL_ENDPOINT}/antarmy/api/admin/loginwithuser`,
    PROFILE: `${URL_ENDPOINT}/antarmy/api/admin/getinfo`,

    PROVINCE: `${URL_ENDPOINT}/antarmy/api/general/province`,
    PRODUCT_TYPE: `${URL_ENDPOINT}/antarmy/api/general/producttype`,
    BANK: `${URL_ENDPOINT}/antarmy/api/general/bank`,

    AUDIENCE_LIST: `${URL_ENDPOINT}/antarmy/api/cms/manage/broadcastaudience/list`,
    AUDIENCE_ADD: `${URL_ENDPOINT}/antarmy/api/cms/manage/broadcastaudience/add`,
    AUDIENCE_EDIT: `${URL_ENDPOINT}/antarmy/api/cms/manage/broadcastaudience/edit`,

    JOB_LIST: `${URL_ENDPOINT}/antarmy/api/cms/manage/job/list`,
    JOB_ADD: `${URL_ENDPOINT}/antarmy/api/cms/manage/job/add`,
    JOB_EDIT: `${URL_ENDPOINT}/antarmy/api/cms/manage/job/edit`,
    JOB_APPROVE: `${URL_ENDPOINT}/antarmy/api/cms/manage/job/approve`,

    INFLU_LIST: `${URL_ENDPOINT}/antarmy/api/cms/manage/influencer/list`,
    INFLU_DETAIL: `${URL_ENDPOINT}/antarmy/api/cms/manage/influencer/detail`,
};

export default URL;
