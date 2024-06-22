"use client";

import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";

import { useEffect, useState } from "react";

import NProgressLink from "#/components/nprogress-link";
import Settings from "#/components/settings";
import AppLogo from "#/components/app-logo";

import styles from "./root-secondary-header.module.css";

export default function RootSecondaryHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <AppBar>
      <Toolbar
        className={styles.toolbar}
        sx={{
          backgroundColor: (theme) =>
            scrolled
              ? theme.palette.mode === "dark"
                ? "rgba(22, 28, 36, 0.72)"
                : "rgba(249, 250, 251, 0.72)"
              : "transparent",
        }}
        style={{
          height: scrolled ? "60px" : "74px",
          backdropFilter: scrolled ? "blur(6px)" : "none",
        }}
      >
        <AppLogo />
        <div className={styles.toolbar}>
          <Settings style={{ marginRight: 4 }} />
          <NProgressLink path="/faq">
            <Typography
              variant="subtitle2"
              color="info.main"
              className={styles.hover}
            >
              Нужна помощь?
            </Typography>
          </NProgressLink>
        </div>
      </Toolbar>
      <Divider
        style={{ display: scrolled ? "block" : "none", borderStyle: "solid" }}
      />
    </AppBar>
  );
}
