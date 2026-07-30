"use client";

import { useEffect } from "react";

/**
 * useSpatialNavigation
 * 
 * Provides D-pad / Arrow Key spatial navigation for TV remotes and keyboard users.
 * Automatically finds the visually closest focusable element in the direction
 * of the arrow key pressed and moves focus to it.
 */
export function useSpatialNavigation() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const { key } = e;
      if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)) return;

      const active = document.activeElement as HTMLElement | null;

      // Allow default behavior inside text inputs/textareas to let users move the cursor
      if (active && (
        active.tagName === "INPUT" ||
        active.tagName === "TEXTAREA" ||
        (active.tagName === "SELECT" && key !== "Enter")
      )) {
        // If it's a checkbox/radio, we can still allow spatial navigation
        if (active.tagName === "INPUT") {
          const type = (active as HTMLInputElement).type;
          if (type !== "radio" && type !== "checkbox") {
            return; 
          }
        } else {
          return;
        }
      }

      // Select all focusable elements
      const focusableSelector = 'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])';
      const elements = Array.from(document.querySelectorAll(focusableSelector)) as HTMLElement[];

      const visibleElements = elements.filter(el => {
        if ((el as any).disabled) return false;
        const rect = el.getBoundingClientRect();
        return (
          rect.width > 0 &&
          rect.height > 0 &&
          window.getComputedStyle(el).visibility !== "hidden" &&
          window.getComputedStyle(el).display !== "none"
        );
      });

      if (visibleElements.length === 0) return;

      // If nothing is focused, focus the first visible element
      if (!active || !visibleElements.includes(active)) {
        e.preventDefault();
        visibleElements[0]?.focus();
        return;
      }

      const activeRect = active.getBoundingClientRect();
      const x = activeRect.left + activeRect.width / 2;
      const y = activeRect.top + activeRect.height / 2;

      let bestCandidate: HTMLElement | null = null;
      let minScore = Infinity;

      for (const el of visibleElements) {
        if (el === active) continue;

        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        const dx = cx - x;
        const dy = cy - y;

        // Check if element is in the requested direction
        let isDirectionMatch = false;
        let primaryDist = 0;
        let secondaryDist = 0;

        if (key === "ArrowUp" && dy < 0) {
          isDirectionMatch = true;
          primaryDist = Math.abs(dy);
          secondaryDist = Math.abs(dx);
        } else if (key === "ArrowDown" && dy > 0) {
          isDirectionMatch = true;
          primaryDist = Math.abs(dy);
          secondaryDist = Math.abs(dx);
        } else if (key === "ArrowLeft" && dx < 0) {
          isDirectionMatch = true;
          primaryDist = Math.abs(dx);
          secondaryDist = Math.abs(dy);
        } else if (key === "ArrowRight" && dx > 0) {
          isDirectionMatch = true;
          primaryDist = Math.abs(dx);
          secondaryDist = Math.abs(dy);
        }

        if (isDirectionMatch) {
          // Score formula: heavily penalize distance in the off-axis (secondaryDist)
          // so that we prefer items directly in the path.
          const score = primaryDist + secondaryDist * 4;
          if (score < minScore) {
            minScore = score;
            bestCandidate = el;
          }
        }
      }

      if (bestCandidate) {
        e.preventDefault();
        bestCandidate.focus({ preventScroll: false });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
}
