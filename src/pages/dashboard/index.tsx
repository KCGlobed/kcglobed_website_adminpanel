import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';
import { FaChevronDown, FaChevronUp, FaSignOutAlt, FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import logo from '../../assets/logo_kcglobed.svg';
import smallLogo from '../../assets/smallLogo.png';
import { menuItems } from './menuItem';
const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const onLogoutClick = () => {
    dispatch(logout());
    navigate('/login');
  };

  const toggleSubmenu = (menu: string) => {
    setOpenSubmenu(openSubmenu === menu ? null : menu);
  };

  return (
    <div className="flex bg-gray-100">
      {/* Sidebar - Fixed height */}
      <aside className={`bg-white shadow-md flex flex-col fixed z-40 h-full transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
        <div className="p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <img
              src={isSidebarCollapsed ? smallLogo : logo}
              alt="Logo"
              className={`mx-auto mb-4 transition-all duration-300 ${isSidebarCollapsed ? 'w-10' : 'w-52'}`}
            />
            <button
              onClick={() => setIsSidebarCollapsed((prev) => !prev)}
              className="ml-2 p-2 rounded hover:bg-gray-200 hover:text-blue-700 focus:outline-none"
              title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isSidebarCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
            </button>
          </div>
          <nav className="flex flex-col space-y-1">
            {menuItems?.map((item) => (
              <div key={item.name} className="relative group">
                {item && item.submenu && item.submenu ? (
                  <>
                    <button
                      onClick={() => !isSidebarCollapsed && toggleSubmenu(item.name)}
                      className={`flex items-center justify-between w-full p-3 text-gray-700 hover:text-blue-700 rounded hover:bg-gray-100 ${isSidebarCollapsed ? 'justify-center' : ''}`}
                      disabled={isSidebarCollapsed}
                    >
                      <div className="flex items-center w-full">
                        {item.icon}
                        {!isSidebarCollapsed && <span>{item.name}</span>}
                      </div>
                      {!isSidebarCollapsed && (openSubmenu === item.name ? (
                        <FaChevronUp className="w-3 h-3" />
                      ) : (
                        <FaChevronDown className="w-3 h-3" />
                      ))}
                    </button>
                    {/* Submenu for expanded sidebar */}
                    {!isSidebarCollapsed && openSubmenu === item.name && (
                      <div className="ml-6 mt-1 mb-2 flex flex-col space-y-1">
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.path}
                            className="p-2 text-sm text-gray-600 hover:text-blue-600 rounded hover:bg-gray-50"
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                    {/* Submenu for collapsed sidebar: show on hover */}
                    {isSidebarCollapsed && (
                      <div
                        className="absolute z-50 hidden group-hover:flex flex-col bg-[#9810FA] text-white shadow-2xl rounded-lg min-w-[200px] py-2 left-12 top-1"
                        style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}
                      >
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.path}
                            className="p-2 text-sm hover:text-white hover:text-blue-600 rounded transition whitespace-nowrap"
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center p-3 text-gray-700 hover:text-blue-600 rounded hover:bg-gray-100 ${isSidebarCollapsed ? 'justify-center' : ''}`}
                    {...(isSidebarCollapsed ? { 'data-tooltip': item.name } : {})}
                  >
                    {item.icon}
                    {!isSidebarCollapsed && <span>{item.name}</span>}
                  </Link>
                )}
                {/* Tooltip for collapsed sidebar, only for items without submenu */}
                {isSidebarCollapsed && !item.submenu && (
                  <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-[#9810FA] text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-80 transition-opacity duration-200">
                    {item.name}
                  </span>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* User dropdown at bottom */}
        <div className="mt-auto p-4 border-t border-gray-200">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`flex items-center justify-between w-full p-2 text-gray-700 hover:text-blue-600 rounded hover:bg-gray-100 ${isSidebarCollapsed ? 'justify-center' : ''}`}
          >
            <div className="flex items-center justify-center w-full">
              <div className={`rounded-full bg-gray-300 flex items-center justify-center mr-2 ${isSidebarCollapsed ? 'w-8 h-8' : 'w-8 h-8'}`}>
                <span className="text-sm font-medium">AD</span>
              </div>
              {!isSidebarCollapsed && <span>Admin</span>}
            </div>
            {!isSidebarCollapsed && (isDropdownOpen ? (
              <FaChevronUp className="w-4 h-4" />
            ) : (
              <FaChevronDown className="w-4 h-4" />
            ))}
          </button>

          {/* Dropdown menu */}
          {!isSidebarCollapsed && isDropdownOpen && (
            <div className="mt-2 py-2 bg-white rounded-md shadow-lg">
              <button
                onClick={onLogoutClick}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <FaSignOutAlt className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main content - Scrollable */}
      <main className={`flex-1 p-6 bg-[var(--color-background)] text-[var(--color-text)] transition-all duration-300 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'} min-h-screen overflow-x-hidden`}>
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;