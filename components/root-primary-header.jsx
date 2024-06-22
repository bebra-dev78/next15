"use client";

import ListItemButton from "@mui/material/ListItemButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import AppBar from "@mui/material/AppBar";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import List from "@mui/material/List";
import Box from "@mui/material/Box";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { start } from "nprogress";
import Image from "next/image";
import Link from "next/link";

import NProgressLink from "#/components/nprogress-link";
import Settings from "#/components/settings";
import AppLogo from "#/components/app-logo";
import Iconify from "#/components/iconify";

import styles from "./root-primary-header.module.css";

function MobileMenu() {
  const pathname = usePathname();

  const [openDrawer, setOpenDrawer] = useState(false);

  var root = pathname === "/";
  var faq = pathname === "/faq";

  return (
    <>
      <IconButton
        onClick={() => {
          setOpenDrawer(true);
        }}
        style={{ marginLeft: 8 }}
      >
        <Image src="/svg/menu.svg" width={20} height={20} alt="Меню" />
      </IconButton>
      <Drawer
        open={openDrawer}
        anchor="left"
        onClose={() => {
          setOpenDrawer(false);
        }}
      >
        <div className={styles.logo}>
          <AppLogo />
        </div>
        <Stack>
          <List disablePadding style={{ padding: 8 }}>
            <Link href="/">
              <ListItemButton
                onClick={() => {
                  !root && start();
                }}
                sx={{
                  color: root
                    ? (theme) =>
                        theme.palette.mode === "dark"
                          ? "rgb(91, 228, 155)"
                          : "primary.main"
                    : "text.secondary",
                  "&:hover": {
                    backgroundColor: root
                      ? "rgba(0, 167, 111, 0.16)"
                      : "rgba(145, 158, 171, 0.08)",
                  },
                }}
                style={{
                  backgroundColor: root
                    ? "rgba(0, 167, 111, 0.08)"
                    : "transparent",
                }}
              >
                <Iconify
                  icon="solar:home-2-bold-duotone"
                  sx={{ marginRight: "16px" }}
                />
                <ListItemText
                  primaryTypographyProps={{
                    variant: "body2",
                    fontWeight: root ? 600 : 400,
                  }}
                >
                  Главная
                </ListItemText>
              </ListItemButton>
            </Link>
            <Link href="/faq">
              <ListItemButton
                onClick={() => {
                  !faq && start();
                }}
                sx={{
                  color: faq
                    ? (theme) =>
                        theme.palette.mode === "dark"
                          ? "rgb(91, 228, 155)"
                          : "primary.main"
                    : "text.secondary",
                  "&:hover": {
                    backgroundColor: faq
                      ? "rgba(0, 167, 111, 0.16)"
                      : "rgba(145, 158, 171, 0.08)",
                  },
                }}
                style={{
                  backgroundColor: faq
                    ? "rgba(0, 167, 111, 0.08)"
                    : "transparent",
                }}
              >
                <Iconify
                  icon="solar:notebook-bold-duotone"
                  sx={{ marginRight: "16px" }}
                />
                <ListItemText
                  primaryTypographyProps={{
                    variant: "body2",
                    fontWeight: root ? 600 : 400,
                  }}
                >
                  FAQ
                </ListItemText>
              </ListItemButton>
            </Link>
          </List>
        </Stack>
      </Drawer>
    </>
  );
}

function HeaderLinks() {
  const pathname = usePathname();

  var root = pathname === "/";
  var faq = pathname === "/faq";

  return (
    <>
      <Link
        href="/"
        onClick={() => {
          !root && start();
        }}
      >
        <ListItemButton
          disableRipple
          className={styles.link}
          sx={{
            color: root ? "primary.main" : "text.primary",
            "&::before": {
              backgroundColor: root ? "primary.main" : "transparent",
            },
            "&:hover": {
              color: (theme) =>
                root
                  ? "rgba(0, 167, 111, 0.7)"
                  : theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.7)"
                  : "rgba(33, 43, 54, 0.7)",
              "&::before": {
                backgroundColor: (theme) =>
                  root
                    ? "rgba(0, 167, 111, 0.7)"
                    : theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.7)"
                    : "rgba(33, 43, 54, 0.7)",
              },
            },
          }}
        >
          Главная
        </ListItemButton>
      </Link>
      <Link
        href="/faq"
        onClick={() => {
          !faq && start();
        }}
      >
        <ListItemButton
          disableRipple
          className={styles.link}
          sx={{
            color: faq ? "primary.main" : "text.primary",
            "&::before": {
              backgroundColor: faq ? "primary.main" : "transparent",
            },
            "&:hover": {
              color: (theme) =>
                faq
                  ? "rgba(0, 167, 111, 0.7)"
                  : theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.7)"
                  : "rgba(33, 43, 54, 0.7)",
              "&::before": {
                backgroundColor: (theme) =>
                  faq
                    ? "rgba(0, 167, 111, 0.7)"
                    : theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.7)"
                    : "rgba(33, 43, 54, 0.7)",
              },
            },
          }}
        >
          FAQ
        </ListItemButton>
      </Link>
    </>
  );
}

export default function RootPrimaryHeader() {
  const isSmallScreen = useMediaQuery("(width < 640px)");

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
          backdropFilter: scrolled ? "blur(6px)" : "none",
          height: scrolled ? "56px" : "70px",
        }}
      >
        <Container className={styles.container}>
          <AppLogo />
          <Box sx={{ flexGrow: 1 }} />
          {!isSmallScreen ? (
            <>
              <nav className={styles.nav}>
                <HeaderLinks scrolled={scrolled} />
              </nav>
              {!scrolled && <Settings style={{ marginLeft: "40px" }} />}
              <Box sx={{ flexGrow: 1 }} />
              <div className={styles.links}>
                <NProgressLink path="/login">
                  <Button variant="outlined" color="inherit" size="medium">
                    Войти
                  </Button>
                </NProgressLink>
                <NProgressLink path="/register">
                  <Button variant="contained" color="inherit" size="medium">
                    Создать аккаунт
                  </Button>
                </NProgressLink>
              </div>
            </>
          ) : (
            <>
              <Settings
                style={{ marginRight: "8px", display: "inline-flex" }}
              />
              <NProgressLink path="/register">
                <Button variant="contained" color="inherit" size="medium">
                  Создать аккаунт
                </Button>
              </NProgressLink>
              <MobileMenu />
            </>
          )}
        </Container>
      </Toolbar>
      <Divider
        style={{ display: scrolled ? "block" : "none", borderStyle: "solid" }}
      />
    </AppBar>
  );
}
