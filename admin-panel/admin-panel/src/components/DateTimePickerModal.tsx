import { useEffect } from "react";
import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  setHours,
  setMinutes,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";

type DateTimePickerModalProps = {
  open: boolean;
  draftDate: Date;
  viewMonth: Date;
  onDraftChange: (value: Date) => void;
  onMonthChange: (value: Date) => void;
  onConfirm: () => void;
  onCancel: () => void;
};

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TIME_SLOTS = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? 0 : 30;
  return { hour, minute, label: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}` };
});

export function DateTimePickerModal({
  open,
  draftDate,
  viewMonth,
  onDraftChange,
  onMonthChange,
  onConfirm,
  onCancel,
}: DateTimePickerModalProps) {
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  const monthStart = startOfMonth(viewMonth);
  const monthEnd = endOfMonth(viewMonth);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days: Date[] = [];
  let cursor = gridStart;
  while (cursor <= gridEnd) {
    days.push(cursor);
    cursor = addDays(cursor, 1);
  }

  const chooseDay = (day: Date) => {
    const next = new Date(draftDate);
    next.setFullYear(day.getFullYear(), day.getMonth(), day.getDate());
    onDraftChange(next);
  };

  const chooseTime = (hour: number, minute: number) => {
    onDraftChange(setMinutes(setHours(new Date(draftDate), hour), minute));
  };

  return (
    <div className="dtOverlay" role="presentation">
      <div
        className="dtModal"
        role="dialog"
        aria-modal="true"
        aria-label="Pick date and time"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="dtHeader">
          <button type="button" className="dtNavBtn" onClick={() => onMonthChange(subMonths(viewMonth, 1))}>
            Prev
          </button>
          <div className="dtTitle">{format(viewMonth, "MMMM yyyy")}</div>
          <button type="button" className="dtNavBtn" onClick={() => onMonthChange(addMonths(viewMonth, 1))}>
            Next
          </button>
        </div>

        <div className="dtBody">
          <div className="dtCalendar">
            <div className="dtWeekRow">
              {WEEK_DAYS.map((d) => (
                <div key={d} className="dtWeekday">
                  {d}
                </div>
              ))}
            </div>

            <div className="dtGrid">
              {days.map((day) => {
                const isActive = isSameDay(day, draftDate);
                const outside = !isSameMonth(day, viewMonth);
                return (
                  <button
                    key={day.toISOString()}
                    type="button"
                    className={`dtDay ${isActive ? "dtDay--active" : ""} ${outside ? "dtDay--outside" : ""}`}
                    onClick={() => chooseDay(day)}
                  >
                    {format(day, "d")}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="dtTimePane">
            <div className="dtTimePaneTitle">Select time</div>
            <div className="dtTimeList">
              {TIME_SLOTS.map((slot) => {
                const selected =
                  draftDate.getHours() === slot.hour && draftDate.getMinutes() === slot.minute;
                return (
                  <button
                    key={slot.label}
                    type="button"
                    className={`dtTimeBtn ${selected ? "dtTimeBtn--active" : ""}`}
                    onClick={() => chooseTime(slot.hour, slot.minute)}
                  >
                    {slot.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="dtFooter">
          <div className="dtSelectionPreview">{format(draftDate, "EEEE, MMM d • HH:mm")}</div>
          <div className="dtFooterActions">
            <button type="button" className="btn btn--ghost" onClick={onCancel}>
              Cancel
            </button>
            <button
              type="button"
              className="btn btn--primary"
              onClick={onConfirm}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

