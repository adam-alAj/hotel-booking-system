import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Navbar from '../Navbar/Navbar';
import './Layout.css';

const Layout = ({ children, title }) => {
  return (
    <div className="layout-container">
      <Sidebar />
      <div className="main-content">
        <Navbar title={title} />
        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
