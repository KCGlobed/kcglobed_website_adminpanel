import { FaUsers, FaBook, FaBlogger } from 'react-icons/fa';
export const menuItems = [
  {
    name: 'Dynamic Pages',
    icon: <FaUsers className="mr-2" />,
    submenu: [
      { name: 'Home Page', path: '/dashboard/dynamic-pages' },
      { name: "Course Page", path: '/dashboard/dynamic-pages' },
      { name: "Pages", path: '/dashboard/dynamic-pages/names' }

    ]
  },
  {
    name: 'Books & Bundles',
    icon: <FaUsers className="mr-2" />,
    submenu: [
      { name: 'Books', path: '/dashboard/books' },
      { name: 'Book in bundle', path: '/dashboard/book-bundle' }

    ]
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
  {
    name: 'Testimonial',
    icon: <FaBook className="mr-2" />,
    path: "/dashboard/testimonial"
  },
];