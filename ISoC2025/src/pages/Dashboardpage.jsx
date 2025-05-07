import React, { useState } from 'react';
import Sidebar from '../components/dashboardcomp/Sidebar';
import Overview from '../components/dashboardcomp/Overview';
import Repositories from '../components/dashboardcomp/Repositories';
import Activity from '../components/dashboardcomp/Activity';
import Performance from '../components/dashboardcomp/Performance';
import Commits from '../components/dashboardcomp/Commits';
import Profile from '../components/dashboardcomp/Profile';

const Dashboardpage = () => {
  const [open, setOpen] = useState(true);
  const [activeItem, setActiveItem] = useState('overview');

  const renderContent = () => {
    switch (activeItem) {
      case 'overview':
        return <Overview />;
      case 'repositories':
        return <Repositories />;
      case 'activity':
        return <Activity />;
      case 'performance':
        return <Performance />;
      case 'commits':
        return <Commits />;
      case 'profile':
        return <Profile />;
      default:
        return <Overview />;
    }
  };

  return (
    <section className="flex w-full font-sans bg-[#1c2230]">
      <Sidebar
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
      />

      <main
        className={`transition-all duration-300 ease-in-out w-full ${open ? 'md:ml-[17%]' : 'md:ml-17'} md:pb-0 pb-14`}
      >
        {renderContent()}
      </main>
    </section>
  );
};

export default Dashboardpage;
