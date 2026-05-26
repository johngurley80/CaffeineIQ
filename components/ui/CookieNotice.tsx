"use client";

import { useEffect, useState } from "react";

const COOKIE_NOTICE_KEY = "ciq_cookie_notice_dismissed";

export function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(window.localStorage.getItem(COOKIE_NOTICE_KEY) !== "true");
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 bg-[#1c1917] px-4 py-3 font-ui text-[13px] text-[#faf7f2] shadow-card">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center">
        <span>This site uses analytics cookies to understand usage. No personal data is stored on our servers.</span>
        <button
          type="button"
          className="font-semibold text-[#c4622d] hover:text-[#dc7a3d]"
          onClick={() => {
            window.localStorage.setItem(COOKIE_NOTICE_KEY, "true");
            setVisible(false);
          }}
        >
          Got it
        </button>
      </div>
    </div>
  );
}
