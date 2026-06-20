import { useEffect } from "react";
export function useKey(keyCode, action) {
  useEffect(
    function () {
      function callback(e) {
        if (e.code.toLowerCase().includes(keyCode)) action();
      }
      document.addEventListener("keydown", callback);
      return () => document.removeEventListener("keydown", callback);
    },
    [keyCode, action],
  );
}
