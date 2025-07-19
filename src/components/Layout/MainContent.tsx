import React from 'react';
import { useAppSelector } from '../../hooks/useRedux';
import HomeView from '../Views/HomeView';
import SearchView from '../Views/SearchView';
import LibraryView from '../Views/LibraryView';
import PlaylistView from '../Views/PlaylistView';

const MainContent: React.FC = () => {
  const { currentView } = useAppSelector((state) => state.ui);

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return <HomeView />;
      case 'search':
        return <SearchView />;
      case 'library':
        return <LibraryView />;
      case 'playlist':
        return <PlaylistView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-900 via-gray-800 to-black p-3 lg:p-6">
      {renderContent()}
    </main>
  );
};

export default MainContent;