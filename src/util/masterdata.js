import URL from "./url";
import api from "./api";

export async function getMasterProductType(params) {
    try {
      const res = await api.post(URL.MASTER_PRODUCT_TYPE, {
        ...params,
      });
      return res.data;
    } catch (err) {
      return { isError: true };
    }
}

export async function getMasterModel(params) {
    try {
      const res = await api.post(URL.MASTER_MODEL, {
        ...params,
      });
      return res.data;
    } catch (err) {
      return { isError: true };
    }
}

export async function getMasterCategory(params) {
    try {
      const res = await api.post(URL.MASTER_CATEGORY, {
        ...params,
      });
      return res.data;
    } catch (err) {
      return { isError: true };
    }
}

export async function getMasterSellingUnit(params) {
    try {
      const res = await api.post(URL.MASTER_SELLING_UNIT, {
        ...params,
      });
      return res.data;
    } catch (err) {
      return { isError: true };
    }
}

export async function getMasterSaleType(params) {
    try {
      const res = await api.post(URL.MASTER_SALE_TYPE, {
        ...params,
      });
      return res.data;
    } catch (err) {
      return { isError: true };
    }
}
