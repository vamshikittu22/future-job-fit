import { useEffect, useState } from "react";

const STORAGE_KEY = "job-optimizer-layout";

type PanelLayout = {
  horizontal: [number, number];
  vertical: [number, number];
};

const DEFAULT_LAYOUT: PanelLayout = {
  horizontal: [35, 65],
  vertical: [50, 50],
};

function isValidLayout(value: unknown): value is PanelLayout {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<PanelLayout>;

  if (!Array.isArray(candidate.horizontal) || !Array.isArray(candidate.vertical)) {
    return false;
  }

  const [h1, h2] = candidate.horizontal;
  const [v1, v2] = candidate.vertical;

  return (
    typeof h1 === "number" &&
    typeof h2 === "number" &&
    typeof v1 === "number" &&
    typeof v2 === "number"
  );
}

export function usePanelLayout() {
  const [layout, setLayout] = useState<PanelLayout>(DEFAULT_LAYOUT);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const savedLayout = localStorage.getItem(STORAGE_KEY);
      if (!savedLayout) {
        return;
      }

      const parsedLayout: unknown = JSON.parse(savedLayout);
      if (isValidLayout(parsedLayout)) {
        setLayout(parsedLayout);
      }
    } catch {
      setLayout(DEFAULT_LAYOUT);
    }
  }, []);

  const updateHorizontal = (sizes: number[]) => {
    const horizontal: [number, number] = [
      sizes[0] ?? DEFAULT_LAYOUT.horizontal[0],
      sizes[1] ?? DEFAULT_LAYOUT.horizontal[1],
    ];

    setLayout((previous) => {
      const nextLayout: PanelLayout = {
        ...previous,
        horizontal,
      };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextLayout));
      } catch {
        return nextLayout;
      }

      return nextLayout;
    });
  };

  const updateVertical = (sizes: number[]) => {
    const vertical: [number, number] = [
      sizes[0] ?? DEFAULT_LAYOUT.vertical[0],
      sizes[1] ?? DEFAULT_LAYOUT.vertical[1],
    ];

    setLayout((previous) => {
      const nextLayout: PanelLayout = {
        ...previous,
        vertical,
      };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextLayout));
      } catch {
        return nextLayout;
      }

      return nextLayout;
    });
  };

  return {
    layout,
    updateHorizontal,
    updateVertical,
  };
}
