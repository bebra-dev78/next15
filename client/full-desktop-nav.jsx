"use client";

import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";

import NavPaper from "#/client/nav-paper";
import Iconify from "#/components/iconify";

import styles from "./full-desktop-nav.module.css";

export default function FullDesktopNav({
  setOpenSidebar,
  privateMode,
  convertMode,
  username,
  activate,
  keys,
}) {
  return (
    <>
      <IconButton
        className={styles.icon_button}
        onClick={() => {
          setOpenSidebar(false);
          localStorage.setItem("sidebar", JSON.stringify(false));
        }}
      >
        <Iconify
          icon="eva:arrow-ios-back-fill"
          color="text.secondary"
          width={15}
        />
      </IconButton>
      <Drawer
        open
        variant="permanent"
        PaperProps={{ className: styles.drawer }}
      >
        <NavPaper
          keys={keys}
          username={username}
          activate={activate}
          privateMode={privateMode}
          convertMode={convertMode}
        />
      </Drawer>
    </>
  );
}
