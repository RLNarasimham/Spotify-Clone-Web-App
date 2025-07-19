import React from "react";
import { useAppDispatch } from "../../hooks/useRedux";
import { toggleSidebar } from "../../store/uiSlice";
import { User, Menu } from "lucide-react";

const Header: React.FC = () => {
  const dispatch = useAppDispatch();

  return (
    <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white p-3 lg:p-4 border-b border-gray-700">
      <div className="flex items-center justify-between gap-2 lg:gap-4">
        <div className="flex items-center space-x-2 lg:space-x-4 flex-1 min-w-0">
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="p-2 hover:bg-gray-700 rounded-full transition-colors lg:hidden"
            title="Mobile Menu-H"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center space-x-2 lg:space-x-4 flex-shrink-0">
          <button
            className="hidden sm:block bg-green-600 hover:bg-green-700 text-white px-3 lg:px-6 py-1.5 lg:py-2 rounded-full font-medium transition-colors text-sm lg:text-base"
            title="Upgrade Button-H"
          >
            Upgrade
          </button>
          <div className="flex items-center space-x-1 lg:space-x-2 bg-gray-800 rounded-full px-2 lg:px-3 py-1">
            <User className="h-5 w-5 lg:h-6 lg:w-6" />
            <span className="font-medium text-sm lg:text-base hidden sm:inline">
              User
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
