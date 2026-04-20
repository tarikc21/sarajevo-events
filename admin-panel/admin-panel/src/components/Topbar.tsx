import type { ReactNode } from "react";

type TopbarProps = {
  title: string;
  right?: ReactNode;
};

export function Topbar({ title, right }: TopbarProps) {
  return (
    <header className="topbar">
      <div className="topbar__title">{title}</div>
      <div className="topbar__right">{right}</div>
    </header>
  );
}
