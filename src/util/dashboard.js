import URL from "./url";
import api from "./api";

export async function getDashboard(params) {
    try {
      const res = await api.post(URL.DASHBOARD, {
        ...params,
      });
      return res.data;
    } catch (err) {
      return { isError: true };
    }
}

