"use client";

import ListItemButton from "@mui/material/ListItemButton";
import ListSubheader from "@mui/material/ListSubheader";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
import Skeleton from "@mui/material/Skeleton";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import List from "@mui/material/List";
import Box from "@mui/material/Box";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { start, done } from "nprogress";
import SimpleBar from "simplebar-react";
import Image from "next/image";
import Link from "next/link";
import crypto from "crypto";
import axios from "axios";

import IconBox from "#/components/icon-box";
import AppLogo from "#/components/app-logo";
import Iconify from "#/components/iconify";
import Convert from "#/utils/convert";

import illustration_docs from "#/public/svg/illustration_docs.svg";

import styles from "./nav-paper.module.css";

const navLinks = [
  { path: "/my/overview", label: "Главная", iconUrl: "/svg/overview.svg" },
  { path: "/my/trades", label: "Сделки", iconUrl: "/svg/trades.svg" },
  { path: "/my/analytics", label: "Аналитика", iconUrl: "/svg/analytics.svg" },
  { path: "/my/journal", label: "Журнал", iconUrl: "/svg/journal.svg" },
];

function AccountLink({ username, keys, privateMode, convertMode }) {
  const pathname = usePathname();

  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const key1 = keys.find((key) => key.exchange === 1);
    const key2 = keys.find((key) => key.exchange === 2);

    setBalance(0);

    // try {
    //   if (key1 !== undefined) {
    //     axios.get("https://fapi.binance.com/fapi/v1/time").then(({ data }) => {
    //       axios
    //         .get("https://fapi.binance.com/fapi/v2/account", {
    //           headers: {
    //             "X-MBX-APIKEY": key1.api_key,
    //           },
    //           params: {
    //             timestamp: data.serverTime,
    //             signature: crypto
    //               .createHmac("sha256", key1.secret_key)
    //               .update(`timestamp=${data.serverTime}&recvWindow=60000`)
    //               .digest("hex"),
    //             recvWindow: 60000,
    //           },
    //         })
    //         .then(({ data }) => {
    //           setBalance(
    //             (prev) => (prev += parseFloat(data?.totalWalletBalance))
    //           );
    //         });
    //     });
    //   }

    //   if (key2 !== undefined) {
    //     axios.get("https://api.bybit.com/v5/market/time").then(({ data }) => {
    //       axios
    //         .get(
    //           "https://api.bybit.com/v5/account/wallet-balance?accountType=UNIFIED",
    //           {
    //             headers: {
    //               "X-BAPI-SIGN": crypto
    //                 .createHmac("sha256", key2.secret_key)
    //                 .update(
    //                   data.time + key2.api_key + 60000 + "accountType=UNIFIED"
    //                 )
    //                 .digest("hex"),
    //               "X-BAPI-API-KEY": key2.api_key,
    //               "X-BAPI-TIMESTAMP": data.time,
    //               "X-BAPI-RECV-WINDOW": 60000,
    //             },
    //           }
    //         )
    //         .then(({ data }) => {
    //           setBalance(
    //             (prev) =>
    //               (prev += parseFloat(
    //                 data?.result?.list[0]?.totalWalletBalance
    //               ))
    //           );
    //         });
    //     });
    //   }
    // } catch (error) {
    //   console.log("error (AccountLink): ", error);
    // }
  }, [keys]);

  return (
    <Link
      href="/my/account"
      className={styles.link}
      onClick={() => pathname !== "/my/account" && start()}
    >
      <div
        className={styles.account}
        style={{
          backgroundColor:
            pathname === "/my/account"
              ? "rgba(0, 167, 111, 0.16)"
              : "rgba(145, 158, 171, 0.12)",
        }}
      >
        <Avatar>{username?.charAt(0).toUpperCase()}</Avatar>
        <div className={styles.text}>
          <Typography variant="subtitle2" color="text.primary" noWrap>
            {username ?? "."}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {privateMode ? (
              <Skeleton />
            ) : convertMode ? (
              <>
                ${balance.toFixed(2)}
                <Convert count={balance} />
              </>
            ) : (
              `$${balance.toFixed(2)}`
            )}
          </Typography>
        </div>
      </div>
    </Link>
  );
}

function InfoCollapse() {
  const pathname = usePathname();

  const [openInfo, setOpenInfo] = useState(false);

  const faq = pathname === "/my/faq";
  const news = pathname === "/my/news";
  const community = pathname === "/my/community";

  const summary = faq || news || community;

  return (
    <>
      <ListItemButton
        onClick={() => {
          setOpenInfo((prev) => !prev);
        }}
        sx={{
          color: summary
            ? (theme) =>
                theme.palette.mode === "dark"
                  ? "rgb(91, 228, 155)"
                  : "primary.main"
            : openInfo
            ? "text.primary"
            : "text.secondary",
          backgroundColor: summary
            ? "rgba(0, 167, 111, 0.08)"
            : openInfo
            ? "rgba(145, 158, 171, 0.08)"
            : "transparent",
          "&:hover": {
            backgroundColor: summary
              ? "rgba(0, 167, 111, 0.16)"
              : "rgba(145, 158, 171, 0.08)",
          },
        }}
      >
        <IconBox iconUrl="/svg/info.svg" iconMarginRight="16px" />
        <ListItemText
          primaryTypographyProps={{
            variant: "body2",
            fontWeight: summary ? 600 : 400,
          }}
        >
          Информация
        </ListItemText>
        <Iconify
          icon={
            openInfo
              ? "eva:arrow-ios-downward-fill"
              : "eva:arrow-ios-forward-fill"
          }
          width={16}
        />
      </ListItemButton>
      <Collapse in={openInfo} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <Link href="/my/faq">
            <ListItemButton
              onClick={() => {
                !faq && start();
              }}
              sx={{
                height: "36px",
                "&:hover": {
                  backgroundColor: faq
                    ? "transparent"
                    : "rgba(145, 158, 171, 0.08)",
                },
              }}
            >
              <ListItemIcon className={styles.list_item_icon}>
                <Box
                  component="span"
                  className={styles.span_box}
                  sx={{
                    transform: faq ? "scale(2)" : "none",
                    backgroundColor: faq
                      ? (theme) =>
                          theme.palette.mode === "dark"
                            ? "rgb(91, 228, 155)"
                            : "primary.main"
                      : "text.secondary",
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{
                  variant: "body2",
                  fontWeight: faq ? 600 : 400,
                  color: faq ? "text.primary" : "text.secondary",
                }}
              >
                FAQ
              </ListItemText>
            </ListItemButton>
          </Link>
        </List>
        <List component="div" disablePadding>
          <Link href="/my/news">
            <ListItemButton
              onClick={() => {
                !news && start();
              }}
              sx={{
                height: "36px",
                "&:hover": {
                  backgroundColor: news
                    ? "transparent"
                    : "rgba(145, 158, 171, 0.08)",
                },
              }}
            >
              <ListItemIcon className={styles.list_item_icon}>
                <Box
                  component="span"
                  className={styles.span_box}
                  sx={{
                    transform: news ? "scale(2)" : "none",
                    backgroundColor: news
                      ? (theme) =>
                          theme.palette.mode === "dark"
                            ? "rgb(91, 228, 155)"
                            : "primary.main"
                      : "text.secondary",
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{
                  variant: "body2",
                  fontWeight: news ? 600 : 400,
                  color: news ? "text.primary" : "text.secondary",
                }}
              >
                Новости
              </ListItemText>
            </ListItemButton>
          </Link>
        </List>
        <List component="div" disablePadding>
          <Link href="/my/community">
            <ListItemButton
              onClick={() => {
                !community && start();
              }}
              sx={{
                height: "36px",
                "&:hover": {
                  backgroundColor: community
                    ? "transparent"
                    : "rgba(145, 158, 171, 0.08)",
                },
              }}
            >
              <ListItemIcon className={styles.list_item_icon}>
                <Box
                  component="span"
                  className={styles.span_box}
                  sx={{
                    transform: community ? "scale(2)" : "none",
                    backgroundColor: community
                      ? (theme) =>
                          theme.palette.mode === "dark"
                            ? "rgb(91, 228, 155)"
                            : "primary.main"
                      : "text.secondary",
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{
                  variant: "body2",
                  fontWeight: community ? 600 : 400,
                  color: community ? "text.primary" : "text.secondary",
                }}
              >
                Сообщество
              </ListItemText>
            </ListItemButton>
          </Link>
        </List>
      </Collapse>
    </>
  );
}

function NavigationLinks() {
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  return (
    <>
      {navLinks.map(({ path, label, iconUrl }) => (
        <Link key={path} href={path}>
          <ListItemButton
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
            <IconBox iconUrl={iconUrl} iconMarginRight="16px" />
            <ListItemText
              primaryTypographyProps={{
                variant: "body2",
                fontWeight: isActive(path) ? 600 : 400,
              }}
            >
              {label}
            </ListItemText>
          </ListItemButton>
        </Link>
      ))}
      <InfoCollapse />
      <Link href="/my/profile">
        <ListItemButton
          onClick={() => {
            !isActive("/my/profile") && start();
          }}
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
          <IconBox iconUrl="/svg/profile.svg" iconMarginRight="16px" />
          <ListItemText
            primaryTypographyProps={{
              variant: "body2",
              fontWeight: isActive("/my/profile") ? 600 : 400,
            }}
          >
            Профиль
          </ListItemText>
        </ListItemButton>
      </Link>
      <a href="https://t.me/tradifyy" target="_blank">
        <ListItemButton
          sx={{
            color: "text.secondary",
            backgroundColor: "transparent",
            "&:hover": {
              backgroundColor: "rgba(145, 158, 171, 0.08)",
            },
          }}
        >
          <IconBox iconUrl="/svg/external.svg" iconMarginRight="16px" />
          <ListItemText
            primaryTypographyProps={{
              variant: "body2",
              fontWeight: 400,
            }}
          >
            Канал Telegram
          </ListItemText>
        </ListItemButton>
      </a>
    </>
  );
}

export default function NavPaper({
  keys,
  username,
  activate,
  privateMode,
  convertMode,
}) {
  return (
    <SimpleBar>
      <div className={styles.logo}>
        {activate ? (
          <Badge
            badgeContent="premium"
            color="info"
            sx={{
              "& .MuiBadge-badge": {
                top: "8px",
                right: "-32px",
                height: "22px",
                fontWeight: 700,
                minWidth: "24px",
                cursor: "default",
                padding: "4px 6px",
                userSelect: "none",
                fontSize: "0.75rem",
                borderRadius: "6px",
                alignItems: "center",
                whiteSpace: "nowrap",
                textTransform: "unset",
                display: "inline-flex",
                justifyContent: "center",
                backgroundColor: "rgba(0, 184, 217, 0.16)",
                color: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgb(97, 243, 243)"
                    : "rgb(0, 108, 156)",
              },
            }}
          >
            <AppLogo />
          </Badge>
        ) : (
          <AppLogo />
        )}
      </div>
      <AccountLink
        keys={keys}
        username={username}
        privateMode={privateMode}
        convertMode={convertMode}
      />
      <List disablePadding className={styles.list}>
        <ListSubheader disableSticky className={styles.list_sub_header}>
          НАВИГАЦИЯ
        </ListSubheader>
        <NavigationLinks />
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <div className={styles.div}>
        <Image
          src={illustration_docs}
          className={styles.img}
          alt="docs"
          priority
        />
        <Typography variant="subtitle1" color="text.primary" gutterBottom>
          Привет, {username}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Нужна помощь?
          <br />
          посмотри наш FAQ
        </Typography>
        <Link href="/my/faq">
          <Button
            variant="contained"
            color="secondary"
            size="medium"
            className={styles.button}
            onClick={() => {
              start();
              done();
            }}
          >
            FAQ
          </Button>
        </Link>
      </div>
    </SimpleBar>
  );
}
