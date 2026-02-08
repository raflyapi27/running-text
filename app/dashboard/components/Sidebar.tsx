"use client";

import { useState } from "react";

type SidebarProps = {
  currentMenu: string;
  onMenuClick: (menu: string) => void;
  onLogout: () => void;
};

export function Sidebar({ currentMenu, onMenuClick, onLogout }: SidebarProps) {
  const [open, setOpen] = useState(false);

  const menus = [
    { id: "running-text", label: "Running Text" },
    { id: "automation", label: "Text Terjadwal" },
    { id: "status", label: "Status Panel" },
  ];

  return (
    <>
      {/* Tombol Hamburger (mobile) */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="md:hidden fixed top-4 right-4 z-50 cursor-pointer bg-zinc-700 text-white px-3 py-1 rounded"
        >
          ☰
        </button>
      )}

      {/* Overlay (mobile) */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`
  fixed md:static
  top-0 bottom-0 left-0 z-50
  w-64
  bg-zinc-900 text-zinc-50
  flex flex-col
  border-r border-zinc-800
  font-sans
  transform transition-transform duration-300
  ${open ? "translate-x-0" : "-translate-x-full"}
  md:translate-x-0
`}
      >
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-orange-500">YPPK</h2>

          {/* Close button (mobile) */}
          <button
            onClick={() => setOpen(false)}
            className="md:hidden text-zinc-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-2 overflow-y-auto">
          <ul>
            {menus.map((menu) => (
              <li key={menu.id}>
                <a
                  href={`#${menu.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onMenuClick(menu.id);
                    setOpen(false); // auto close di mobile
                  }}
                  className={`block p-4 rounded-lg transition-colors font-medium ${
                    currentMenu === menu.id
                      ? "bg-orange-500 text-white"
                      : "hover:bg-zinc-800"
                  }`}
                >
                  {menu.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800">
          <button
            onClick={onLogout}
            className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
