import URL from "./url";
import api from "./api";

export async function getProductList(params) {
    try {
      const res = await api.post(URL.PRODUCT_LIST, {
        ...params,
      });
      return res.data;
    } catch (err) {
      return { isError: true };
    }
}

export async function getProductMaster(params) {
    try {
      const res = await api.post(URL.PRODUCT_MASTER, {
        ...params,
      });
      return res.data;
    } catch (err) {
      return { isError: true };
    }
}
