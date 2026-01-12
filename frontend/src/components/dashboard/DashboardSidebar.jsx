import { useState } from "react";
import {
  PlusCircle,
  BookOpen,
  CheckCircle,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

function DashboardSidebar({
  active,
  setActive,
  sidebarOpen,
  setSidebarOpen,
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`
        fixed md:static top-16 left-0 z-50
        h-[calc(100vh-4rem)]
        bg-white border-r border-gray-200
        transform transition-all duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
        ${collapsed ? "w-20" : "w-64"}
        flex flex-col shadow-sm
      `}
    >
      {/* Desktop Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 hidden md:flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:text-gray-900 hover:bg-gray-50 shadow-sm transition-colors z-50"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-6">
        
        {/* Header / Title */}
        <div className={`flex items-center px-4 ${collapsed ? "justify-center" : "gap-3"}`}>
            <div className="p-2 bg-indigo-50 rounded-lg shrink-0">
                <LayoutDashboard className="h-6 w-6 text-indigo-600" />
            </div>
            {!collapsed && (
                <h2 className="text-lg font-bold text-slate-800 whitespace-nowrap overflow-hidden transition-all duration-200">
                    Dashboard
                </h2>
            )}
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1 px-3">
          <SidebarButton
            label="Create a Story"
            icon={<PlusCircle size={20} />}
            active={active === "create"}
            collapsed={collapsed}
            onClick={() => {
              setActive("create");
              setSidebarOpen(false);
            }}
          />

          <SidebarButton
            label="My Ongoing Stories"
            icon={<BookOpen size={20} />}
            active={active === "ongoing"}
            collapsed={collapsed}
            onClick={() => {
              setActive("ongoing");
              setSidebarOpen(false);
            }}
          />

          <SidebarButton
            label="My Published Stories"
            icon={<CheckCircle size={20} />}
            active={active === "published"}
            collapsed={collapsed}
            onClick={() => {
              setActive("published");
              setSidebarOpen(false);
            }}
          />
        </nav>
      </div>
    </aside>
  );
}

function SidebarButton({ label, icon, active, collapsed, onClick }) {
  return (
    <button
      onClick={onClick}
      title={collapsed ? label : ""}
      className={`
        group w-full flex items-center
        ${collapsed ? "justify-center px-2" : "px-3"}
        py-2.5 rounded-lg
        transition-all duration-200 ease-in-out
        ${
          active
            ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        }
      `}
    >
      <span className={`shrink-0 transition-transform duration-200 ${active ? "" : "group-hover:scale-110"}`}>
        {icon}
      </span>

      {!collapsed && (
        <span
          className={`
            ml-3 font-medium text-sm whitespace-nowrap overflow-hidden
            transition-all duration-200
          `}
        >
          {label}
        </span>
      )}
    </button>
  );
}


export default DashboardSidebar;
