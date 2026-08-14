import {
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

import {
  Eye,
  MoreVertical,
  Pencil,
} from "lucide-react";

import type { Attendance } from "../../Attendance.types";
import type { AttendanceActionsMenuProps } from "./AttendanceActionsMenu.types";


export default function AttendanceActionsMenu({
  attendance,
  onView,
  onCorrect,
}: AttendanceActionsMenuProps) {
  const [isOpen, setIsOpen] =
    useState(false);

  const triggerRef =
    useRef<HTMLButtonElement>(null);

  const menuRef =
    useRef<HTMLDivElement>(null);

  const [position, setPosition] =
    useState({
      top: 0,
      left: 0,
    });


  const updatePosition = () => {
    if (!triggerRef.current) {
      return;
    }

    const rect =
      triggerRef.current.getBoundingClientRect();

    const menuHeight = onCorrect ? 100 : 55;
    const menuWidth = 192;
    const spacing = 8;

    const spaceBelow =
      window.innerHeight - rect.bottom;

    const spaceAbove = rect.top;

    const openUpward =
      spaceBelow < menuHeight &&
      spaceAbove > menuHeight;

    const top = openUpward
      ? rect.top -
        menuHeight -
        spacing
      : rect.bottom +
        spacing;

    const left = Math.min(
      rect.right - menuWidth,
      window.innerWidth -
        menuWidth -
        8,
    );

    setPosition({
      top,
      left: Math.max(8, left),
    });
  };


  useEffect(() => {
    if (!isOpen) {
      return;
    }

    updatePosition();


    const handleOutsideClick = (
      event: MouseEvent,
    ) => {
      const target =
        event.target as Node;

      const clickedTrigger =
        triggerRef.current?.contains(
          target,
        );

      const clickedMenu =
        menuRef.current?.contains(
          target,
        );

      if (
        !clickedTrigger &&
        !clickedMenu
      ) {
        setIsOpen(false);
      }
    };


    const handleEscape = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };


    const handleReposition = () => {
      updatePosition();
    };


    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    document.addEventListener(
      "keydown",
      handleEscape,
    );

    window.addEventListener(
      "resize",
      handleReposition,
    );

    window.addEventListener(
      "scroll",
      handleReposition,
      true,
    );


    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );

      document.removeEventListener(
        "keydown",
        handleEscape,
      );

      window.removeEventListener(
        "resize",
        handleReposition,
      );

      window.removeEventListener(
        "scroll",
        handleReposition,
        true,
      );
    };
  }, [
    isOpen,
    onCorrect,
  ]);


  const handleAction = (
    action?:
      (attendance: Attendance) => void,
  ) => {
    setIsOpen(false);
    action?.(attendance);
  };


  return (
    <>
      {/* Trigger */}

      <button
        ref={triggerRef}
        type="button"
        aria-label="Attendance actions"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => {
          if (!isOpen) {
            updatePosition();
          }

          setIsOpen(
            (previous) => !previous,
          );
        }}
        className="
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-lg
          text-slate-400
          transition-colors
          hover:bg-slate-100
          hover:text-slate-700
          focus:outline-none
          focus:ring-2
          focus:ring-blue-600/20
        "
      >
        <MoreVertical size={18} />
      </button>


      {/* Portal Menu */}

      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            className="
              fixed
              z-100
              w-48
              rounded-xl
              border
              border-slate-200
              bg-white
              p-1.5
              shadow-lg
            "
            style={{
              top: position.top,
              left: position.left,
            }}
          >

            {/* View */}

            <button
              type="button"
              role="menuitem"
              onClick={() =>
                handleAction(onView)
              }
              className="
                flex
                w-full
                items-center
                gap-3
                rounded-lg
                px-3
                py-2.5
                text-sm
                text-slate-700
                transition-colors
                hover:bg-slate-50
              "
            >
              <Eye
                size={16}
                className="shrink-0"
              />

              View Details
            </button>


            {/* Correct */}

            {onCorrect && (
              <button
                type="button"
                role="menuitem"
                onClick={() =>
                  handleAction(onCorrect)
                }
                className="
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-lg
                  px-3
                  py-2.5
                  text-sm
                  text-slate-700
                  transition-colors
                  hover:bg-slate-50
                "
              >
                <Pencil
                  size={16}
                  className="shrink-0"
                />

                Correct Attendance
              </button>
            )}

          </div>,
          document.body,
        )}
    </>
  );
}