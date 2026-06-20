import { useState, useEffect } from "react";

export function useFetchData(url, stateSetter) {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState("");

  useEffect(
    function () {
      if (!url) return;
      // if (!url) throw new Error("No URL given to function useFetchData(URL)");
      const controller = new AbortController();

      async function fetchData() {
        try {
          setIsLoading(true);
          setIsError("");

          const res = await fetch(url, { signal: controller.signal });

          if (!res.ok) throw new Error("Something went wrong with fetching.");

          const resData = await res.json();

          // 1. Check for specific API errors first
          if (resData.Response === "False") throw new Error(resData.Error);

          console.log(resData);
          // 2. Set the data only if everything was successful
          stateSetter(resData);

          setIsError("");
        } catch (error) {
          if (error.name !== "AbortError") {
            setIsError(error.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      fetchData();
      return () => controller.abort();
    },
    [url, stateSetter],
  );

  return { isLoading, isError };
}
