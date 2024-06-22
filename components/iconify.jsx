"use client";

import Box from "@mui/material/Box";

import { Icon } from "@iconify/react";

export default function Iconify({ icon, width = 24, sx, color }) {
  return (
    <Box
      component={Icon}
      className="component-iconify"
      height={width}
      width={width}
      color={color}
      icon={icon}
      sx={sx}
    />
  );
}
