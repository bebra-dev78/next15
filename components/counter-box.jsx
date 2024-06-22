"use client";

import Box from "@mui/material/Box";

import styles from "./counter-box.module.css";

export default function CounterBox({ count, variant, style }) {
  return (
    <Box
      component="span"
      className={styles.index}
      sx={
        variant === "info"
          ? {
              backgroundColor: "rgba(0, 184, 217, 0.16)",
              color: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgb(97, 243, 243)"
                  : "rgb(0, 108, 156)",
            }
          : {
              backgroundColor: "text.primary",
              color: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgb(33, 43, 54)"
                  : "rgb(255, 255, 255)",
            }
      }
      style={style}
    >
      {count}
    </Box>
  );
}
