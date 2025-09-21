// Room111
import DashboardMain from "../components/ant-army/dashboard/Dashboard";
import OrderResult from "../components/ant-army/order/OrderResult";
import OrderShopeeResult from "../components/ant-army/order-shopee/OrderShopeeResult";
import CustomerResult from "../components/ant-army/customer/CustomerResult";

export const routes = [
  { path: `${process.env.PUBLIC_URL}/dashboard/main`, component: <DashboardMain /> },
  { path: `${process.env.PUBLIC_URL}/dashboard/order`, component: <OrderResult /> },
  { path: `${process.env.PUBLIC_URL}/dashboard/shopee-order`, component: <OrderShopeeResult /> },
  { path: `${process.env.PUBLIC_URL}/dashboard/customer`, component: <CustomerResult /> },
];
