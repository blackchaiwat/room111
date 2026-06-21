import URL from "./url";
import api from "./api";

export async function getCategoryList(params) {
    try {
      const res = await api.post(URL.CATEGORY_LIST, {
        ...params,
      });
      return res.data;
    } catch (err) {
      return { isError: true };
    }
}

export async function getCategoryAdd(params) {
    try {
      const res = await api.post(URL.CATEGORY_ADD, {
        ...params,
      });
      return res.data;
    } catch (err) {
      return { isError: true };
    }
}

export async function getCategoryEdit(params) {
    try {
      const res = await api.post(URL.CATEGORY_EDIT, {
        ...params,
      });
      return res.data;
    } catch (err) {
      return { isError: true };
    }
}

export async function getCategoryDelete(params) {
    try {
      const res = await api.post(URL.CATEGORY_DELETE, {
        ...params,
      });
      return res.data;
    } catch (err) {
      return { isError: true };
    }
}

export async function getCategoryStatus(params) {
    try {
      const res = await api.post(URL.CATEGORY_STATUS, {
        ...params,
      });
      return res.data;
    } catch (err) {
      return { isError: true };
    }
}

