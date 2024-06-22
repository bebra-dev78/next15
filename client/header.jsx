"use client";

import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Popover from "@mui/material/Popover";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Badge from "@mui/material/Badge";
import List from "@mui/material/List";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import SimpleBar from "simplebar-react";
import dynamic from "next/dynamic";
import { start } from "nprogress";
import Image from "next/image";
import Link from "next/link";

import CounterBox from "#/components/counter-box";
import Settings from "#/components/settings";
import Iconify from "#/components/iconify";

import styles from "./header.module.css";

const MobileMenu = dynamic(() => import("#/client/mobile-menu"));

function HeaderAction({ username, email }) {
  const router = useRouter();

  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton
        className={styles.icon_button}
        onClick={(e) => {
          setAnchorEl(e.currentTarget);
        }}
        style={{
          background: open
            ? "linear-gradient(135deg, rgb(91, 228, 155) 0%, rgb(0, 167, 111) 100%)"
            : "rgba(145, 158, 171, 0.08)",
        }}
      >
        <Avatar className={styles.avatar}>
          {username?.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        disableScrollLock
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        onClose={() => {
          setAnchorEl(null);
        }}
        slotProps={{
          paper: {
            style: {
              width: 200,
              padding: 0,
            },
          },
        }}
      >
        <div className={styles.user}>
          <Typography variant="subtitle2" color="text.primary" noWrap>
            {username}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {email}
          </Typography>
        </div>
        <Divider />
        <Stack className={styles.links_stack}>
          <Link href="/my/trades">
            <MenuItem onClick={() => setAnchorEl(null)}>Сделки</MenuItem>
          </Link>
          <Link href="/my/journal">
            <MenuItem onClick={() => setAnchorEl(null)}>Журнал</MenuItem>
          </Link>
          <Link href="/my/analytics">
            <MenuItem onClick={() => setAnchorEl(null)}>Аналитика</MenuItem>
          </Link>
        </Stack>
        <Divider />
        <MenuItem
          className={styles.menu_item}
          onClick={() => {
            router.prefetch("/login");
            setAnchorEl(null);
            signOut({ redirect: false }).then(() => {
              start();
              router.push("/login");
            });
          }}
          sx={{ color: "error.main" }}
        >
          <ListItemIcon>
            <Iconify
              icon="line-md:logout"
              color="error.main"
              width={20}
              sx={{ transform: "scaleX(-1)" }}
            />
          </ListItemIcon>
          Выйти
        </MenuItem>
      </Popover>
    </>
  );
}

function Notifications({ id, notifications, setNotifications }) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [unread, setUnread] = useState([]);
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (notifications) {
      setUnread(notifications.filter((i) => i.read === false));
    }
  }, [notifications]);

  return (
    <>
      <IconButton
        onClick={() => {
          setOpenDrawer(true);
        }}
      >
        <Badge badgeContent={unread.length} color="error">
          <Iconify icon="solar:bell-bing-bold-duotone" color="text.secondary" />
        </Badge>
      </IconButton>
      <Drawer
        open={openDrawer}
        anchor="right"
        onClose={() => {
          setOpenDrawer(false);
        }}
        PaperProps={{
          className: styles.drawer,
          sx: {
            backgroundColor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(33, 43, 54, 0.7)"
                : "rgba(255, 255, 255, 0.7)",
          },
        }}
      >
        <div className={styles.hero}>
          <Typography variant="h6">Уведомления</Typography>
          <IconButton
            onClick={() => {
              setOpenDrawer(false);
            }}
          >
            <Iconify
              icon="mingcute:close-line"
              color="text.secondary"
              width={20}
            />
          </IconButton>
        </div>
        <Divider className={styles.divider} />
        <Stack className={styles.tabs_stack}>
          <Tabs value={value} onChange={(e, n) => setValue(n)}>
            <Tab
              label="Все"
              disableTouchRipple
              iconPosition="end"
              icon={
                <CounterBox
                  count={notifications?.length}
                  style={{ marginLeft: "8px" }}
                />
              }
              className={styles.tab}
              style={{ marginRight: 24 }}
            />
            <Tab
              label="Непрочитанные"
              disableTouchRipple
              iconPosition="end"
              icon={
                <CounterBox
                  count={unread.length}
                  variant="info"
                  style={{ marginLeft: "8px" }}
                />
              }
              className={styles.tab}
            />
          </Tabs>
        </Stack>
        <Divider className={styles.divider} />
        <div className={styles.content}>
          <SimpleBar>
            <List disablePadding>
              {(value === 0 ? notifications : unread)?.map((n) => (
                <ListItemButton
                  key={n.id}
                  disableTouchRipple
                  className={styles.list_item_button}
                  onClick={() => {
                    setNotifications((prev) =>
                      prev.filter((p) => p.id !== n.id)
                    );
                    fetch(
                      `${process.env.NEXT_PUBLIC_BACKEND_URL}/interface/notifications?id=${n.id}`,
                      {
                        method: "DELETE",
                        headers: {
                          "Content-Type": "application/json",
                          "X-TRADIFY-UID": id,
                        },
                      }
                    );
                  }}
                >
                  <ListItemAvatar>
                    <div className={styles.list_img}>
                      <Image src={n.image_url} height={24} width={24} />
                    </div>
                  </ListItemAvatar>
                  <Box className={styles.list_text} sx={{ flexGrow: 1 }}>
                    <ListItemText>
                      <Typography variant="subtitle2" gutterBottom>
                        {n.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(n.created_at).toLocaleString()}
                      </Typography>
                    </ListItemText>
                  </Box>
                </ListItemButton>
              ))}
            </List>
          </SimpleBar>
        </div>
        <Divider className={styles.divider} />
        <div className={styles.read_button}>
          <Button
            color="inherit"
            size="large"
            fullWidth
            onClick={() => {
              setOpenDrawer(false);
              setNotifications((prev) =>
                prev.map((n) => ({ ...n, read: true }))
              );
              fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/interface/notifications`,
                {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                    "X-TRADIFY-UID": id,
                  },
                }
              );
            }}
          >
            Прочитать всё
          </Button>
        </div>
      </Drawer>
    </>
  );
}

export default function Header({
  id,
  keys,
  email,
  unread,
  stretch,
  username,
  setStretch,
  openSidebar,
  privateMode,
  convertMode,
  notifications,
  setNotifications,
}) {
  const isSmallScreen = useMediaQuery("(max-width: 1260px)");

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
    <AppBar
      style={{
        width: isSmallScreen
          ? "100%"
          : `calc(100% - ${openSidebar ? 281.9 : 97.9}px)`,
      }}
    >
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
        {isSmallScreen && (
          <MobileMenu
            keys={keys}
            username={username}
            privateMode={privateMode}
            convertMode={convertMode}
          />
        )}
        <div className={styles.actions}>
          <Notifications
            id={id}
            unread={unread}
            notifications={notifications}
            setNotifications={setNotifications}
          />
          <Settings stretch={stretch} setStretch={setStretch} />
          <HeaderAction username={username} email={email} />
        </div>
      </Toolbar>
    </AppBar>
  );
}
