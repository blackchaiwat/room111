import URL from "./url";
import api from "./api";

export async function getModelList(params) {
    try {
      const res = await api.post(URL.MODEL_LIST, {
        ...params,
      });
      return res.data;
    } catch (err) {
      return { isError: true };
    }
}

export async function getModelAdd(params) {
    try {
      const res = await api.post(URL.MODEL_ADD, {
        ...params,
      });
      return res.data;
    } catch (err) {
      return { isError: true };
    }
}

export async function getModelEdit(params) {
    try {
      const res = await api.post(URL.MODEL_EDIT, {
        ...params,
      });
      return res.data;
    } catch (err) {
      return { isError: true };
    }
}

export async function getModelDelete(params) {
    try {
      const res = await api.post(URL.MODEL_DELETE, {
        ...params,
      });
      return res.data;
    } catch (err) {
      return { isError: true };
    }
}

export async function getModelStatus(params) {
    try {
      const res = await api.post(URL.MODEL_STATUS, {
        ...params,
      });
      return res.data;
    } catch (err) {
      return { isError: true };
    }
}

