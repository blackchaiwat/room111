import {
    Home,
} from 'react-feather';

export const MENUITEMS = [
    {
        title: 'Dashboard', img: 'home.png', icon: Home, type: 'link', path: `${process.env.PUBLIC_URL}/dashboard/main`, active: false
    },
    {
        title: 'Order', img: 'order.png', icon: Home, type: 'link', path: `${process.env.PUBLIC_URL}/dashboard/order`, active: false
    },
    {
        title: 'Client', img: 'client.png', icon: Home, type: 'link', path: `${process.env.PUBLIC_URL}/dashboard/customer`, active: false
    },
    {
        title: 'Stock', img: 'stock.png', icon: Home, type: 'link', path: `${process.env.PUBLIC_URL}/dashboard/shopee-order`, active: false
    },
    {
        title: 'SKU', img: 'sku.png', icon: Home, type: 'link', path: `${process.env.PUBLIC_URL}/dashboard/sku`, active: false
    },
]
