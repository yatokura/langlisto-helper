(() => {
  "use strict";

  const BOX_SELECTOR = ".ll-dwg-entry-box";
  const ENTRY_SELECTOR = "textarea.ll-dwg-entry, input.ll-dwg-entry";
  const handledState = new WeakMap();

  function getBoxes() {
    return Array.from(document.querySelectorAll(BOX_SELECTOR));
  }

  function getEntry(box) {
    return box ? box.querySelector(ENTRY_SELECTOR) : null;
  }

  function getState(box) {
    if (!box) return null;

    if (
      box.classList.contains("is-correct") ||
      box.querySelector(".ll-dwg-entry.is-correct")
    ) {
      return "correct";
    }

    if (
      box.classList.contains("is-incorrect") ||
      box.querySelector(".ll-dwg-entry.is-incorrect")
    ) {
      return "incorrect";
    }

    return null;
  }

  function focusEntry(entry) {
    if (!entry || !entry.isConnected || entry.disabled) return;

    entry.focus({ preventScroll: false });

    if (typeof entry.setSelectionRange === "function") {
      const end = entry.value.length;
      entry.setSelectionRange(end, end);
    }
  }

  function focusNextBox(currentBox) {
    const boxes = getBoxes();
    const currentIndex = boxes.indexOf(currentBox);
    if (currentIndex < 0) return;

    for (let i = currentIndex + 1; i < boxes.length; i += 1) {
      const nextEntry = getEntry(boxes[i]);

      if (nextEntry && !nextEntry.disabled) {
        focusEntry(nextEntry);
        return;
      }
    }
  }

  function handleBox(box) {
    if (!box || !box.isConnected) return;

    const state = getState(box);

    if (!state) {
      handledState.delete(box);
      return;
    }

    if (handledState.get(box) === state) return;
    handledState.set(box, state);

    window.setTimeout(() => {
      if (!box.isConnected || getState(box) !== state) return;

      if (state === "correct") {
        focusNextBox(box);
      } else {
        focusEntry(getEntry(box));
      }
    }, 40);
  }

  function findContainingBox(node) {
    if (!(node instanceof Element)) {
      node = node && node.parentElement;
    }

    return node && node.closest ? node.closest(BOX_SELECTOR) : null;
  }

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;

    const entry = event.target instanceof Element
      ? event.target.closest(ENTRY_SELECTOR)
      : null;

    if (!entry || entry.value.trim() !== "") return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
  }, true);

  const observer = new MutationObserver((records) => {
    const affectedBoxes = new Set();

    for (const record of records) {
      const box = findContainingBox(record.target);
      if (box) affectedBoxes.add(box);

      for (const node of record.addedNodes) {
        if (!(node instanceof Element)) continue;

        if (node.matches(BOX_SELECTOR)) {
          affectedBoxes.add(node);
        }

        node.querySelectorAll?.(BOX_SELECTOR).forEach((nestedBox) => {
          affectedBoxes.add(nestedBox);
        });
      }
    }

    affectedBoxes.forEach(handleBox);
  });

  observer.observe(document.documentElement, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ["class"]
  });
})();
