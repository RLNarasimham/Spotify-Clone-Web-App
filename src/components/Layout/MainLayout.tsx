import React, { useEffect } from "react";
import { useAppDispatch } from "../../hooks/useRedux";
import { setSongs, setPlaylists } from "../../store/librarySlice";
import { mockSongs, mockPlaylists } from "../../data/mockData";
import Sidebar from "./Sidebar";
import Header from "./Header";
import MainContent from "./MainContent";
import Player from "../Player/Player";

const MainLayout: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setSongs(mockSongs));
    dispatch(setPlaylists(mockPlaylists));
  }, [dispatch]);

  return (
    <div className="h-screen bg-gray-900 text-white overflow-hidden flex flex-col">
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <MainContent />
          <Player />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
