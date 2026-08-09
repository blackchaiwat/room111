import URL from "./url";
import api from "./api";

export async function getSkuList(params) {
    try {
      const res = await api.post(URL.SKU_LIST, {
        ...params,
      });
      return res.data;
    } catch (err) {
      return { isError: true };
    }
}

export async function getSkuAdd(params) {
    try {
      const res = await api.post(URL.SKU_ADD, {
        ...params,
      });
      return res.data;
    } catch (err) {
      return { isError: true };
    }
}

export async function getSkuExport(params) {
    try {
      const res = await api.post(URL.SKU_EXPORT, {
        ...params,
      });
      return res.data;
    } catch (err) {
      return { isError: true };
    }
}

export async function getSkuDelete(params) {
    try {
      const res = await api.post(URL.SKU_DELETE, {
        ...params,
      });
      return res.data;
    } catch (err) {
      return { isError: true };
    }
}
