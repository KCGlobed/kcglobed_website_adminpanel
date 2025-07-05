import { FaHome, FaUsers, FaBook, FaBlogger } from 'react-icons/fa';
export const menuItems = [
  // {
  //   name: 'Dashboard',
  //   icon: <FaHome className="mr-2" />,
  //   path: '/dashboard',
  // },
  // {
  //   name: 'Users',
  //   icon: <FaUsers className="mr-2" />,
  //   path: '/dashboard/user',
  // },
  {
    name: 'Dynamic Pages',
    icon: <FaUsers className="mr-2" />,
    path: '/dashboard/dynamic-pages',
  },
  {
    name: 'Blog',
    icon: <FaBlogger className="mr-2" />,
    submenu: [
      { name: 'Posts', path: '/dashboard/blog' },
      { name: 'Comments', path: '/dashboard/blog/comments' }
    ],

  },
  {
    name: 'Partner with us',
    icon: <FaUsers className="mr-2" />,
    path: '/dashboard/partner-with-us',
  },
  {
    name: 'Contact us',
    icon: <FaUsers className="mr-2" />,
    path: '/dashboard/contact-us',
  },
  {
    name: 'Quick contact',
    icon: <FaUsers className="mr-2" />,
    path: '/dashboard/quick-contact',
  },
  {
    name: 'Placement support',
    icon: <FaUsers className="mr-2" />,
    path: '/dashboard/placement-support',
  },
  {
    name: 'Books Reports',
    icon: <FaBook className="mr-2" />,
    submenu: [
      { name: 'Success order report', path: '/dashboard/book-order-report' },
      { name: 'Failed order report', path: '/dashboard/failed-order-report' },
      { name: 'Cart pending ordered report', path: '/dashboard/cart-pending-order-report' },
    ],
  },
];