import {
    Home,
    Star,
    Archive,
    Box,
    DollarSign,
    Users,
    Chrome,
    Settings,
    Airplay,
    FolderPlus,
    File,
    Command, Cloud, Book, FileText, Server, Image, Sliders, Map, GitPullRequest, Calendar, Edit, Mail, MessageSquare, UserCheck, Layers, HelpCircle, Database, Headphones, Mic, ShoppingBag, Search, AlertOctagon, Lock, Briefcase, BarChart
} from 'react-feather';

export const MENUITEMS = [
    {
        title: 'Dashboard', icon: Home, type: 'link', path: `${process.env.PUBLIC_URL}/dashboard/main`, active: false
    },
    {
        title: 'Order', icon: Home, type: 'link', path: `${process.env.PUBLIC_URL}/dashboard/order`, active: false
    },
    {
        title: 'Client', icon: Home, type: 'link', path: `${process.env.PUBLIC_URL}/dashboard/customer`, active: false
    },
    {
        title: 'Stock', icon: Home, type: 'link', path: `${process.env.PUBLIC_URL}/dashboard/shopee-order`, active: false
    },
]
