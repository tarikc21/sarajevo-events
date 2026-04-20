import type { Dispatch, SetStateAction } from "react";

type SidebarProps = {
  active: "events";
  setActive: Dispatch<SetStateAction<"events">>;
};

export function Sidebar({ active, setActive }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__logo" />
        <div>
          <div className="sidebar__title">Sarajevo Events</div>
          <div className="sidebar__subtitle">Admin Dashboard</div>
        </div>
      </div>

      <nav className="sidebar__nav">
        <button
          className={`navItem ${active === "events" ? "navItem--active" : ""}`}
          onClick={() => setActive("events")}
        >
          Events
        </button>
      </nav>

      <div className="sidebar__footer">
        <div className="pill">Firestore</div>
        <div className="pill pill--muted">Dark</div>
      </div>
    </aside>
  );
}
