import URL from "./url";
import api from "./api";

export async function getCustomerList(params) {
    try {
      const res = await api.post(URL.CUSTOMER_LIST, {
        ...params,
      });
      return res.data;
    } catch (err) {
      return { isError: true };
    }
}