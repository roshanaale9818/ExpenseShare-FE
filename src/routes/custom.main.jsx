import React from 'react';
import { useOutlet } from 'react-router-dom';

import Navbar from 'src/layouts/shared_layout/navbar/Navbar';
import Footer from 'src/layouts/shared_layout/footer/footer';

export default function CustomMain() {
  const outlet = useOutlet();
  return (
    <div className="site-wrapper">
      <div className="top-wrap">
        <Navbar />
        <div className="main-content" id="main">
          {outlet}
        </div>
        <Footer />
      </div>
    </div>
  );
}
