"use client";

import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Popover from "@mui/material/Popover";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { start } from "nprogress";
import Link from "next/link";

import IconBox from "#/components/icon-box";
import AppLogo from "#/components/app-logo";
import Iconify from "#/components/iconify";

import styles from "./mini-desktop-nav.module.css";

const navLinks = [
  { path: "/my/overview", label: "Главная", iconUrl: "/svg/overview.svg" },
  { path: "/my/trades", label: "Сделки", iconUrl: "/svg/trades.svg" },
  { path: "/my/analytics", label: "Аналитика", iconUrl: "/svg/analytics.svg" },
  { path: "/my/journal", label: "Журнал", iconUrl: "/svg/journal.svg" },
];

function NavLinks() {
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  return (
    <>
      {navLinks.map(({ path, label, iconUrl }) => (
        <Link key={path} href={path}>
          <ListItemButton
            className={styles.list_item_button}
            onClick={() => {
              !isActive(path) && start();
            }}
            sx={
              isActive(path)
                ? {
                    color: (theme) =>
                      theme.palette.mode === "dark"
                        ? "rgb(91, 228, 155)"
                        : "primary.main",
                    backgroundColor: "rgba(0, 167, 111, 0.08)",
                    "&:hover": {
                      backgroundColor: "rgba(0, 167, 111, 0.16)",
                    },
                  }
                : {
                    color: "text.secondary",
                    backgroundColor: "transparent",
                    "&:hover": {
                      backgroundColor: "rgba(145, 158, 171, 0.08)",
                    },
                  }
            }
          >
            <IconBox iconUrl={iconUrl} />
            <ListItemText
              className={styles.list_item_text}
              primaryTypographyProps={{
                variant: "body2",
                fontSize: "10px",
                fontWeight: isActive("/my/profile") ? 600 : 400,
              }}
            >
              {label}
            </ListItemText>
          </ListItemButton>
        </Link>
      ))}
      <InfoPopover />
      <Link href="/my/profile">
        <ListItemButton
          onClick={() => {
            !isActive("/my/profile") && start();
          }}
          className={styles.list_item_button}
          sx={
            isActive("/my/profile")
              ? {
                  color: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgb(91, 228, 155)"
                      : "primary.main",
                  backgroundColor: "rgba(0, 167, 111, 0.08)",
                  "&:hover": {
                    backgroundColor: "rgba(0, 167, 111, 0.16)",
                  },
                }
              : {
                  color: "text.secondary",
                  backgroundColor: "transparent",
                  "&:hover": {
                    backgroundColor: "rgba(145, 158, 171, 0.08)",
                  },
                }
          }
        >
          <IconBox iconUrl="/svg/profile.svg" />
          <ListItemText
            className={styles.list_item_text}
            primaryTypographyProps={{
              variant: "body2",
              fontSize: "10px",
              fontWeight: isActive("/my/profile") ? 600 : 400,
            }}
          >
            Профиль
          </ListItemText>
        </ListItemButton>
      </Link>
      <a href="https://t.me/tradifyy" target="_blank">
        <ListItemButton
          className={styles.list_item_button}
          sx={{
            color: "text.secondary",
            backgroundColor: "transparent",
            "&:hover": {
              backgroundColor: "rgba(145, 158, 171, 0.08)",
            },
          }}
        >
          <IconBox iconUrl="/svg/external.svg" />
          <ListItemText
            className={styles.list_item_text}
            primaryTypographyProps={{
              variant: "body2",
              sx: { fontSize: "10px", fontWeight: 600 },
            }}
          >
            Telegram
          </ListItemText>
        </ListItemButton>
      </a>
    </>
  );
}

function InfoPopover() {
  const pathname = usePathname();

  const [anchorEl, setAnchorEl] = useState(null);

  const faq = pathname === "/my/faq";
  const news = pathname === "/my/news";
  const community = pathname === "/my/community";

  const open = Boolean(anchorEl);

  return (
    <>
      <ListItemButton
        onClick={(event) => {
          setAnchorEl(event.currentTarget);
        }}
        className={styles.list_item_button}
        sx={
          faq || news || community
            ? {
                color: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgb(91, 228, 155)"
                    : "primary.main",
                backgroundColor: "rgba(0, 167, 111, 0.08)",
                "&:hover": {
                  backgroundColor: "rgba(0, 167, 111, 0.16)",
                },
              }
            : {
                color: "text.secondary",
                backgroundColor: "transparent",
                "&:hover": {
                  backgroundColor: "rgba(145, 158, 171, 0.08)",
                },
              }
        }
      >
        <IconBox iconUrl="/svg/info.svg" />
        <ListItemText
          className={styles.list_item_text}
          primaryTypographyProps={{
            variant: "body2",
            sx: { fontWeight: 600, fontSize: "10px" },
          }}
        >
          Информация
        </ListItemText>
        <Iconify
          icon={open ? "eva:arrow-ios-back-fill" : "eva:arrow-ios-forward-fill"}
          width={16}
          sx={{
            top: "12px",
            right: "8px",
            position: "absolute",
          }}
        />
      </ListItemButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        disableRestoreFocus
        disableScrollLock
        anchorOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "left",
        }}
        onClose={() => {
          setAnchorEl(null);
        }}
        slotProps={{ paper: { style: { backgroundImage: "none" } } }}
      >
        <Link href="/my/faq">
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              !faq && start();
            }}
            sx={{
              fontWeight: faq ? 600 : 400,
              color: faq ? "text.primary" : "text.secondary",
            }}
          >
            FAQ
          </MenuItem>
        </Link>
        <Divider className={styles.divider} />
        <Link href="/my/news">
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              !news && start();
            }}
            sx={{
              fontWeight: news ? 600 : 400,
              color: news ? "text.primary" : "text.secondary",
            }}
          >
            Новости
          </MenuItem>
        </Link>
        <Divider className={styles.divider} />
        <Link href="/my/community">
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              !community && start();
            }}
            sx={{
              fontWeight: community ? 600 : 400,
              color: community ? "text.primary" : "text.secondary",
            }}
          >
            Сообщество
          </MenuItem>
        </Link>
      </Popover>
    </>
  );
}

export default function MiniDesktopNav({ setOpenSidebar }) {
  return (
    <>
      <IconButton
        className={styles.icon_button}
        onClick={() => {
          setOpenSidebar(true);
          localStorage.setItem("sidebar", JSON.stringify(true));
        }}
      >
        <Iconify
          icon="eva:arrow-ios-forward-fill"
          color="text.secondary"
          width={16}
        />
      </IconButton>
      <Stack className={styles.stack}>
        <div className={styles.logo}>
          <AppLogo />
        </div>
        <Stack className={styles.links_stack}>
          <NavLinks />
        </Stack>
      </Stack>
    </>
  );
}
