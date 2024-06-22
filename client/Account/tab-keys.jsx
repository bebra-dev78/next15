"use client";

import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import ListItemIcon from "@mui/material/ListItemIcon";
import CardContent from "@mui/material/CardContent";
import DialogTitle from "@mui/material/DialogTitle";
import LoadingButton from "@mui/lab/LoadingButton";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CardHeader from "@mui/material/CardHeader";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Popover from "@mui/material/Popover";
import Divider from "@mui/material/Divider";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

import { useState, useRef, useEffect } from "react";
import { createHmac } from "crypto";
import { DateTime } from "luxon";
import Image from "next/image";
import axios from "axios";

import { useKeys, useNotifications, useUser } from "#/app/my/layout";
import AlertSnackbar from "#/components/alert-snackbar";
import CounterBox from "#/components/counter-box";
import Iconify from "#/components/iconify";

import styles from "./tab-keys.module.css";

const EXCHANGES = {
  1: "Binance Futures",
  3: "Bybit Linear Futures",
  6: "OKX Swap",
};

const exchanges_cards = [
  { id: 1, title: "Binance Futures" },
  { id: 3, title: "Bybit Linear Futures" },
  { id: 6, title: "OKX Swap" },
];

function AddKeyPanel() {
  const { setNotifications } = useNotifications();
  const { keys, setKeys } = useKeys();
  const { user } = useUser();

  const [statusSnackbar, setStatusSnackbar] = useState({});
  const [secretkeyError, setSecretkeyError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [apikeyError, setApikeyError] = useState("");
  const [titleError, setTitleError] = useState("");
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");

  const secretkeyRef = useRef("");
  const apikeyRef = useRef("");
  const phraseRef = useRef("");
  const titleRef = useRef("");

  useEffect(() => {
    setTitleError("");
    setApikeyError("");
    setSecretkeyError("");
    titleRef.current = "";
    apikeyRef.current = "";
    secretkeyRef.current = "";
  }, [value, openDialog]);

  function handleSubmit() {
    let secretkeyMessage = "";
    let apikeyMessage = "";
    let titleMessage = "";

    const secretkey = secretkeyRef.current;
    const apikey = apikeyRef.current;
    const phrase = phraseRef.current;
    const title = titleRef.current;

    switch (true) {
      case apikey.length < 10:
        apikeyMessage = "Слишком короткий ключ";
        break;
      case apikey.length > 256:
        apikeyMessage = "Слишком длинный ключ";
        break;
      case /\s/.test(apikey):
        apikeyMessage = "Ключ не должен содержать пробелы";
        break;
      default:
        break;
    }

    switch (true) {
      case secretkey.length < 10:
        secretkeyMessage = "Слишком короткий ключ";
        break;
      case secretkey.length > 256:
        secretkeyMessage = "Слишком длинный ключ";
        break;
      case /\s/.test(secretkey):
        secretkeyMessage = "Ключ не должен содержать пробелы";
        break;
      default:
        break;
    }

    switch (true) {
      case title.length < 3:
        titleMessage = "Не менее 3 символов";
        break;
      case title.length > 18:
        titleMessage = "Не более 18 символов";
        break;
      case !/^[A-Za-zА-Яа-яЁё\d\s.,!?()-]+$/.test(title):
        titleMessage = "Некорректное название";
        break;
      default:
        break;
    }

    if (apikeyMessage || secretkeyMessage || titleMessage) {
      setSecretkeyError(secretkeyMessage);
      setApikeyError(apikeyMessage);
      setTitleError(titleMessage);
      return;
    }

    setLoading(true);

    switch (value) {
      case "Binance Futures":
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/interface/keys`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-TRADIFY-UID": user.id,
          },
          body: JSON.stringify({
            api: apikey,
            secret: secretkey,
            title,
            exchange: 1,
          }),
        })
          .then((res) => res.json())
          .then((kid) => {
            setLoading(false);

            if (kid === null) {
              setApikeyError("Такой ключ уже существует");
              return;
            }

            setOpenDialog(false);
            setStatusSnackbar({ show: true, variant: "info" });
            setKeys((prev) => [
              ...prev,
              { id: kid, apikey, secretkey, title, phrase, exchange: 1 },
            ]);

            const serverTime = DateTime.now().ts;

            var promises = [];

            for (
              let start = serverTime - 2592000000 * 24;
              start < serverTime;
              start += 432000000
            ) {
              const end = Math.min(start + 432000000, serverTime);

              promises.push(
                axios
                  .get(
                    `https://fapi.binance.com/fapi/v1/userTrades?startTime=${start}&endTime=${end}&timestamp=${serverTime}&recvWindow=60000&limit=1000&signature=${createHmac(
                      "sha256",
                      secretkey
                    )
                      .update(
                        `startTime=${start}&endTime=${end}&timestamp=${serverTime}&recvWindow=60000&limit=1000`
                      )
                      .digest("hex")}`,
                    {
                      headers: { "X-MBX-APIKEY": apikey },
                    }
                  )
                  .then((res) => res.data)
              );
            }

            Promise.all(promises)
              .then((deals) => {
                var aboba = [];

                Object.values(
                  deals.flat().reduce((result, trade) => {
                    const symbol = trade.symbol;
                    if (!result[symbol]) {
                      result[symbol] = [];
                    }
                    result[symbol].push(trade);
                    return result;
                  }, {})
                ).forEach((deal) => {
                  let currentTrade = [];
                  for (let i = 0; i < deal.length; i++) {
                    var currentTradeEmpty = currentTrade.length === 0;
                    var isClosingTrade =
                      i === deal.length - 1 ||
                      (i < deal.length - 1 &&
                        parseFloat(deal[i].realizedPnl) !== 0 &&
                        parseFloat(deal[i + 1].realizedPnl) === 0);
                    var isOpeningTrade =
                      i === 0 ||
                      (i > 0 &&
                        parseFloat(deal[i].realizedPnl) === 0 &&
                        parseFloat(deal[i - 1].realizedPnl) !== 0);

                    if (currentTradeEmpty || isOpeningTrade) {
                      currentTrade.push(deal[i]);
                    } else if (isClosingTrade) {
                      currentTrade.push(deal[i]);
                      aboba.push([...currentTrade]);
                      currentTrade = [];
                    } else {
                      currentTrade.push(deal[i]);
                    }
                  }
                });

                const trades = aboba.map((trade) => {
                  var deals = [];
                  var ut = new Set();
                  var b = trade.filter((t) => t.side === "BUY");
                  var s = trade.filter((t) => t.side === "SELL");
                  var bt = b.reduce((a, c) => a + parseFloat(c.qty), 0);
                  var st = s.reduce((a, c) => a + parseFloat(c.qty), 0);
                  var bv = b.reduce((a, c) => a + parseFloat(c.quoteQty), 0);
                  var sv = s.reduce((a, c) => a + parseFloat(c.quoteQty), 0);

                  trade.forEach((t) => {
                    if (!ut.has(t.time)) {
                      ut.add(t.time);
                      deals.push({
                        time: t.time,
                        side: t.side,
                        price: parseFloat(t.price).toFixed(2),
                        income: parseFloat(t.realizedPnl).toFixed(3),
                        volume: parseFloat(t.qty + t.price).toFixed(0),
                        commission: parseFloat(t.commission).toFixed(3),
                      });
                    }
                  });

                  const income = trade.reduce(
                    (a, c) => a + parseFloat(c.realizedPnl),
                    0
                  );

                  const commission = trade.reduce(
                    (a, d) => a + parseFloat(d.commission),
                    0
                  );

                  const profit = parseFloat((income - commission).toFixed(2));

                  return {
                    uid: user.id,
                    kid: kid,
                    exchange: 1,
                    symbol: trade[0].symbol,
                    entry_time: String(trade[0].time),
                    exit_time: String(trade[trade.length - 1].time),
                    side: trade[0].side,
                    avg_entry_price: parseFloat(
                      (
                        b.reduce(
                          (a, c) => a + parseFloat(c.price) * parseFloat(c.qty),
                          0
                        ) / bt
                      ).toFixed(4)
                    ),
                    avg_exit_price: parseFloat(
                      (
                        s.reduce(
                          (a, c) => a + parseFloat(c.price) * parseFloat(c.qty),
                          0
                        ) / st
                      ).toFixed(4)
                    ),
                    duration: trade[trade.length - 1].time - trade[0].time,
                    procent: parseFloat(
                      (((sv / st - bv / bt) / (bv / bt)) * 100).toFixed(2)
                    ),
                    income: parseFloat(income.toFixed(3)),
                    profit:
                      profit >= 0
                        ? Math.max(0.01, profit)
                        : Math.min(-0.01, profit),
                    turnover: parseFloat(((bt + st) / 2).toFixed(1)),
                    max_volume: parseFloat(
                      Math.max(
                        ...trade.map(
                          (p) => (parseFloat(p.price) * parseFloat(p.qty)) / 2
                        )
                      ).toFixed(1)
                    ),
                    volume: parseFloat(
                      trade
                        .reduce(
                          (a, d) => a + parseFloat(d.price) * parseFloat(d.qty),
                          0
                        )
                        .toFixed(2)
                    ),
                    commission: parseFloat(commission.toFixed(3)),
                    deals: JSON.stringify(deals),
                    transfer: 0,
                  };
                });
                // .sort((a, b) => b.entry_time - a.exit_time);

                Promise.all([
                  fetch(
                    `https://fapi.binance.com/fapi/v2/account?timestamp=${serverTime}&recvWindow=60000&signature=${createHmac(
                      "sha256",
                      secretkey
                    )
                      .update(`timestamp=${serverTime}&recvWindow=60000`)
                      .digest("hex")}`,
                    {
                      headers: {
                        "X-MBX-APIKEY": apikey,
                      },
                    }
                  )
                    .then((res) => res.json())
                    .then((res) => res.totalWalletBalance),
                  fetch(
                    `https://fapi.binance.com/fapi/v1/income?timestamp=${serverTime}&recvWindow=60000&limit=1000&incomeType=TRANSFER&startTime=${
                      serverTime - 2592000000 * 3
                    }&endTime=${serverTime}&signature=${createHmac(
                      "sha256",
                      secretkey
                    )
                      .update(
                        `timestamp=${serverTime}&recvWindow=60000&limit=1000&incomeType=TRANSFER&startTime=${
                          serverTime - 2592000000 * 3
                        }&endTime=${serverTime}`
                      )
                      .digest("hex")}`,
                    {
                      headers: {
                        "X-MBX-APIKEY": apikey,
                      },
                    }
                  )
                    .then((res) => res.json())
                    .then((res) => res.reverse()),
                  fetch(
                    `https://fapi.binance.com/fapi/v1/income?timestamp=${serverTime}&recvWindow=60000&limit=1000&incomeType=FUNDING_FEE&startTime=${
                      serverTime - 2592000000 * 3
                    }&endTime=${serverTime}&signature=${createHmac(
                      "sha256",
                      secretkey
                    )
                      .update(
                        `timestamp=${serverTime}&recvWindow=60000&limit=1000&incomeType=FUNDING_FEE&startTime=${
                          serverTime - 2592000000 * 3
                        }&endTime=${serverTime}`
                      )
                      .digest("hex")}`,
                    {
                      headers: {
                        "X-MBX-APIKEY": apikey,
                      },
                    }
                  )
                    .then((res) => res.json())
                    .then((res) => res.reverse()),
                  fetch(
                    `https://fapi.binance.com/fapi/v1/income?timestamp=${serverTime}&recvWindow=60000&limit=1000&incomeType=INTERNAL_TRANSFER&startTime=${
                      serverTime - 2592000000 * 3
                    }&endTime=${serverTime}&signature=${createHmac(
                      "sha256",
                      secretkey
                    )
                      .update(
                        `timestamp=${serverTime}&recvWindow=60000&limit=1000&incomeType=INTERNAL_TRANSFER&startTime=${
                          serverTime - 2592000000 * 3
                        }&endTime=${serverTime}`
                      )
                      .digest("hex")}`,
                    {
                      headers: {
                        "X-MBX-APIKEY": apikey,
                      },
                    }
                  )
                    .then((res) => res.json())
                    .then((res) => res.reverse()),
                ]).then((res) => {
                  console.log("res: ", res);
                  let balance = parseFloat(res[0]);

                  [...res[1], ...res[2], ...res[3]].forEach((transaction) => {
                    const filteredTrades = trades.filter(
                      (trade) => parseInt(trade.entry_time) < transaction.time
                    );
                    const latestTrade = filteredTrades.reduce(
                      (maxTrade, currentTrade) => {
                        return parseInt(currentTrade.entry_time) >
                          parseInt(maxTrade.entry_time)
                          ? currentTrade
                          : maxTrade;
                      },
                      filteredTrades[0]
                    );

                    if (latestTrade) {
                      latestTrade.transfer += parseFloat(transaction.income);
                    }
                  });

                  fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/interface/trades`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        "X-TRADIFY-UID": user.id,
                      },
                      body: JSON.stringify(
                        trades.map((p) => {
                          balance -= p.profit + p.transfer;

                          delete p.transfer;

                          return {
                            ...p,
                            deposit: Math.max(0, parseInt(balance.toFixed())),
                          };
                        })
                      ),
                    }
                  )
                    .then((res) => res.json())
                    .then((count) => {
                      fetch(
                        `${process.env.NEXT_PUBLIC_BACKEND_URL}/interface/notifications`,
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                            "X-TRADIFY-UID": user.id,
                          },
                          body: JSON.stringify(
                            count
                              ? {
                                  title: `Binance Futures: загружены сделки (${count}) по API-ключу «${title}».`,
                                  image_url: "/svg/success_load.svg",
                                }
                              : {
                                  title: `Binance Futures: неизвестная ошибка при сохранении сделок по API-ключу «${title}». Попробуйте перезагрузить ключ или обратиться в поддержку.`,
                                  image_url: "/svg/error_load.svg",
                                }
                          ),
                        }
                      ).then((n) => {
                        setNotifications((prev) => [
                          {
                            id: n,
                            uid: user.id,
                            read: false,
                            title: count
                              ? `Binance Futures: загружены сделки (${count}) по API-ключу «${title}».`
                              : `Binance Futures: неизвестная ошибка при сохранении сделок по API-ключу «${title}». Попробуйте перезагрузить ключ или обратиться в поддержку.`,
                            image_url: count
                              ? "/svg/success_load.svg"
                              : "/svg/error_load.svg",
                            created_at: Date.now(),
                          },
                          ...prev,
                        ]);
                      });
                    });
                });
              })
              .catch((error) => {
                console.log("error: ", error);

                fetch(
                  `${process.env.NEXT_PUBLIC_BACKEND_URL}/interface/notifications`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      "X-TRADIFY-UID": user.id,
                    },
                    body: JSON.stringify({
                      title: `Binance Futures: получена ошибка при загрузке сделок: ${error?.response?.data?.msg}`,
                      imageUrl: "/svg/error_load.svg",
                    }),
                  }
                )
                  .then((res) => res.json())
                  .then((n) => {
                    setNotifications((prev) => [n, ...prev]);
                  });
              });
          });
        break;

      default:
        break;
    }
  }

  return (
    <>
      <Typography variant="h5" className={styles.h5}>
        доступно ключей
        <CounterBox
          count={3 - keys.length}
          variant="info"
          style={{ marginLeft: "8px", padding: "10px 8px", height: 24 }}
        />
      </Typography>
      <Button
        variant="contained"
        color="inherit"
        disabled={keys.length > 2}
        className={styles.new_button}
        startIcon={<Iconify icon="line-md:plus" width={20} />}
        onClick={() => {
          setOpenDialog(true);
          setValue("");
        }}
      >
        Новый ключ
      </Button>
      <Dialog
        open={openDialog}
        fullWidth
        scroll="paper"
        PaperProps={{
          className: styles.dialog_paper,
          sx: {
            backgroundColor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgb(33, 43, 54)"
                : "rgb(255, 255, 255)",
            boxShadow: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(0, 0, 0, 0.24) -40px 40px 80px -8px"
                : "rgba(145, 158, 171, 0.24) -40px 40px 80px -8px",
          },
        }}
      >
        <DialogTitle className={styles.gialog_title}>
          Новый API-ключ
        </DialogTitle>
        <DialogContent>
          <Grid container direction="column" spacing={2}>
            {exchanges_cards.map((card) => (
              <ExchangeCard
                id={card.id}
                key={card.id}
                value={value}
                title={card.title}
                setValue={setValue}
                titleRef={titleRef}
                phraseRef={phraseRef}
                apikeyRef={apikeyRef}
                titleError={titleError}
                apikeyError={apikeyError}
                secretkeyRef={secretkeyRef}
                setTitleError={setTitleError}
                secretkeyError={secretkeyError}
                setApikeyError={setApikeyError}
                setSecretkeyError={setSecretkeyError}
              />
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="inherit"
            size="medium"
            onClick={() => {
              setOpenDialog(false);
              setValue("");
            }}
          >
            Отмена
          </Button>
          <LoadingButton
            variant="contained"
            color="inherit"
            loading={loading}
            onClick={handleSubmit}
            disabled={value === ""}
          >
            Добавить
          </LoadingButton>
        </DialogActions>
      </Dialog>
      <AlertSnackbar
        statusSnackbar={statusSnackbar}
        setStatusSnackbar={setStatusSnackbar}
      />
    </>
  );
}

function ExchangeCard({
  id,
  title,
  value,
  setValue,
  titleRef,
  phraseRef,
  apikeyRef,
  titleError,
  apikeyError,
  secretkeyRef,
  setTitleError,
  setApikeyError,
  secretkeyError,
  setSecretkeyError,
}) {
  const { keys } = useKeys();

  const checked = title === value;

  return (
    keys.every((key) => key.exchange !== id) && (
      <Grid item>
        <Card
          className={styles.exchange_card}
          onClick={() => {
            setValue(title);
          }}
        >
          <CardContent>
            <Grid container>
              <Grid item>
                <Radio
                  size="small"
                  checked={checked}
                  value={title}
                  onChange={(e) => {
                    setValue(e.target.value);
                  }}
                />
              </Grid>
              <Grid item>
                <span className={styles.img_span}>
                  <Image
                    src="/images/tiktok.png"
                    className={styles.img}
                    width={48}
                    height={48}
                  />
                </span>
                <Typography
                  component="div"
                  variant="overline"
                  className={styles.title}
                >
                  {title}
                </Typography>
                {checked && (
                  <Stack className={styles.cheked}>
                    <TextField
                      label="API-ключ"
                      name="api"
                      type="text"
                      size="small"
                      variant="outlined"
                      color="warning"
                      fullWidth
                      autoFocus
                      onChange={(e) => {
                        setApikeyError("");
                        apikeyRef.current = e.target.value;
                      }}
                      error={Boolean(apikeyError)}
                      helperText={
                        apikeyError ||
                        "Ключ должен быть доступен с любого IP-адреса."
                      }
                    />
                    <TextField
                      label="Cекретный ключ"
                      name="secret"
                      type="text"
                      size="small"
                      variant="outlined"
                      color="info"
                      fullWidth
                      onChange={(e) => {
                        setSecretkeyError("");
                        secretkeyRef.current = e.target.value;
                      }}
                      error={Boolean(secretkeyError)}
                      helperText={secretkeyError}
                    />
                    <TextField
                      label="Название ключа"
                      name="title"
                      type="text"
                      size="small"
                      variant="outlined"
                      color="secondary"
                      fullWidth
                      onChange={(e) => {
                        setTitleError("");
                        titleRef.current = e.target.value;
                      }}
                      error={Boolean(titleError)}
                      helperText={titleError}
                    />
                    {(id === 6 || id === 7) && (
                      <TextField
                        label="Кодовая фраза"
                        name="phrase"
                        type="text"
                        size="small"
                        variant="outlined"
                        color="error"
                        fullWidth
                        onChange={(e) => {
                          phraseRef.current = e.target.value;
                        }}
                      />
                    )}
                  </Stack>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    )
  );
}

function CardKeys() {
  const { keys } = useKeys();

  const [statusSnackbar, setStatusSnackbar] = useState({});

  return (
    <Card className={styles.card}>
      <CardHeader
        title="Ваши API-ключи"
        className={styles.card_header}
        titleTypographyProps={{
          variant: "overline",
          color: "text.secondary",
        }}
      />
      {keys.length > 0 ? (
        <Grid container spacing={2}>
          {keys.map((k) => (
            <KeyGridItem
              key={k.id}
              apikey={k}
              setStatusSnackbar={setStatusSnackbar}
            />
          ))}
        </Grid>
      ) : (
        <Typography variant="caption" color="text.secondary">
          Нет данных
        </Typography>
      )}
      <AlertSnackbar
        statusSnackbar={statusSnackbar}
        setStatusSnackbar={setStatusSnackbar}
      />
    </Card>
  );
}

function KeyGridItem({ apikey, setStatusSnackbar }) {
  const { setKeys } = useKeys();
  const { user } = useUser();

  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [editedTitleError, setEditedTitleError] = useState("");
  const [anchorEl, setAnchorEl] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const editedTitleRef = useRef("");

  return (
    <>
      <Grid item xs={12} md={6}>
        <Paper className={styles.paper}>
          <div className={styles.actions}>
            <Image
              src="/images/tiktok.png"
              className={styles.img}
              width={48}
              height={48}
            />
            <div>
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                <Iconify
                  icon="solar:menu-dots-bold-duotone"
                  color="text.secondary"
                />
              </IconButton>
              <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <MenuItem
                  onClick={() => {
                    setAnchorEl(null);
                    setEditMode(true);
                    editedTitleRef.current = apikey.title;
                  }}
                >
                  <ListItemIcon>
                    <Iconify
                      color="text.secondary"
                      icon="solar:pen-bold"
                      width={20}
                    />
                  </ListItemIcon>
                  <Typography variant="body2" color="text.primary">
                    изменить
                  </Typography>
                </MenuItem>
                <Divider className={styles.divider} />
                <MenuItem
                  onClick={() => {
                    setAnchorEl(null);
                    setDeleteConfirmation(true);
                  }}
                  style={{ marginBottom: 0 }}
                >
                  <ListItemIcon>
                    <Iconify
                      icon="solar:trash-bin-trash-bold"
                      color="error.main"
                      width={20}
                    />
                  </ListItemIcon>
                  <Typography variant="button" color="error.main">
                    удалить
                  </Typography>
                </MenuItem>
              </Popover>
            </div>
          </div>
          <Stack>
            {editMode ? (
              <>
                <div className={styles.edit_box}>
                  <TextField
                    variant="standard"
                    size="small"
                    defaultValue={apikey.title}
                    onChange={(e) => {
                      setEditedTitleError("");
                      editedTitleRef.current = e.target.value;
                    }}
                    error={Boolean(editedTitleError)}
                    helperText={editedTitleError}
                  />
                  <IconButton
                    onClick={() => {
                      let editedTitleMessage = "";

                      const newTitle = editedTitleRef.current;

                      switch (true) {
                        case newTitle.length < 3:
                          editedTitleMessage = "Не менее 3 символов";
                          break;
                        case newTitle.length > 18:
                          editedTitleMessage = "Не более 18 символов";
                          break;
                        case !/^[A-Za-zА-Яа-яЁё\d\s.,!?()-]+$/.test(newTitle):
                          editedTitleMessage = "Некорректное название";
                          break;
                        default:
                          break;
                      }

                      if (editedTitleMessage) {
                        setEditedTitleError(editedTitleMessage);
                        return;
                      }

                      setEditMode(false);
                      setKeys((prev) =>
                        prev.map((key) =>
                          key.id === apikey.id
                            ? { ...key, title: newTitle }
                            : key
                        )
                      );
                      setStatusSnackbar({
                        show: true,
                        variant: "success",
                      });

                      editedTitleRef.current = "";

                      fetch(
                        `${process.env.NEXT_PUBLIC_BACKEND_URL}/interface/keys?id=${apikey.id}&title=${newTitle}`,
                        {
                          method: "PATCH",
                          headers: {
                            "Content-Type": "application/json",
                            "X-TRADIFY-UID": user.id,
                          },
                        }
                      );
                    }}
                  >
                    <Iconify icon="solar:sd-card-bold-duotone" width={20} />
                  </IconButton>
                </div>
              </>
            ) : (
              <Typography color="text.primary" gutterBottom>
                {apikey.title}
              </Typography>
            )}
            <Typography variant="overline" color="text.disabled">
              {EXCHANGES[apikey.exchange]}
            </Typography>
          </Stack>
        </Paper>
      </Grid>
      <Dialog
        open={deleteConfirmation}
        onClose={() => setDeleteConfirmation(false)}
      >
        <Typography variant="h6" color="text.primary" className={styles.card}>
          Подтвердите действие
        </Typography>
        <DialogContent>
          <DialogContentText>
            Вы уверены, что хотите удалить этот ключ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="inherit"
            size="medium"
            onClick={() => setDeleteConfirmation(false)}
          >
            Отмена
          </Button>
          <Button
            variant="contained"
            color="error"
            size="medium"
            autoFocus
            onClick={() => {
              setDeleteConfirmation(false);
              setKeys((prev) => prev.filter((k) => k.id !== apikey.id));
              fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/interface/trades?kid=${apikey.id}`,
                {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                    "X-TRADIFY-UID": user.id,
                  },
                }
              ).then(() => {
                fetch(
                  `${process.env.NEXT_PUBLIC_BACKEND_URL}/interface/keys?id=${apikey.id}`,
                  {
                    method: "DELETE",
                    headers: {
                      "Content-Type": "application/json",
                      "X-TRADIFY-UID": user.id,
                    },
                  }
                );
              });
            }}
          >
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default function TabKeys() {
  return (
    <Grid container spacing={5} className={styles.container}>
      <Grid item xs={12} md={8}>
        <Stack className={styles.stack}>
          <Card className={styles.add_card}>
            <Typography
              component="span"
              variant="overline"
              color="text.secondary"
            >
              Добавить API-ключ
            </Typography>
            <AddKeyPanel />
          </Card>
          <CardKeys />
        </Stack>
      </Grid>
    </Grid>
  );
}
