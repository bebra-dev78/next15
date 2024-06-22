"use client";

import { useState, useEffect, useRef } from "react";

import Window from "#/client/Analytics/window";
import Store from "#/client/Analytics/store";
import { useUser } from "#/app/my/layout";

export default function Index() {
  const { user } = useUser();

  const [panels, setPanels] = useState({});
  const [value, setValue] = useState("");

  const panelsDataRef = useRef([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/resourses/panels`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-TRADIFY-UID": user.id,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        const n = {};
        res.forEach((b) => {
          n[b.title] = b.widgets;
        });
        setPanels(n);
        setValue(Object.keys(n)[0]);
        panelsDataRef.current = res;
      });
  }, []);

  return (
    <>
      <Store
        value={value}
        panels={panels}
        setPanels={setPanels}
        panelsDataRef={panelsDataRef}
      />
      <Window
        value={value}
        panels={panels}
        setValue={setValue}
        setPanels={setPanels}
        panelsDataRef={panelsDataRef}
      />
    </>
  );
}
