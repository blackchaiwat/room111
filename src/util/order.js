import URL from "./url";
import api from "./api";

export async function getOrderList(params) {
    try {
      const res = await api.post(URL.ORDER_LIST, {
        ...params,
      });
      return res.data;
    } catch (err) {
      return { isError: true };
    }
}

export async function getOrderDetail(params) {
    try {
      const res = await api.post(URL.ORDER_DETAIL, {
        ...params,
      });
      return res.data;
    } catch (err) {
      return { isError: true };
    }
}

export async function getOrderMaster(params) {
    try {
      const res = await api.post(URL.ORDER_MASTER, {
        ...params,
      });
      return res.data;
    } catch (err) {
      return { isError: true };
    }
}
