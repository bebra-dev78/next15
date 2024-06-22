"use client";

import { useEffect, useState } from "react";

import useFormat from "#/utils/format-thousands";

export default function Convert({ count }) {
  const [rate, setRate] = useState(1);

  useEffect(() => {
    setRate(90.44);
  }, []);

  return ` ~${useFormat((count * rate).toFixed())}₽`;
}
