"use client";

import InputAdornment from "@mui/material/InputAdornment";
import LoadingButton from "@mui/lab/LoadingButton";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Switch from "@mui/material/Switch";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import { useState, useRef } from "react";
import Image from "next/image";

import AlertSnackbar from "#/components/alert-snackbar";
import Iconify from "#/components/iconify";
import { useUser } from "#/app/my/layout";

import en from "#/public/svg/en.svg";
import ru from "#/public/svg/ru.svg";

import styles from "./tab-user.module.css";

function AvatarItem() {
  const { user } = useUser();

  return (
    <>
      <Avatar className={styles.avatar}>
        {user.name?.charAt(0).toUpperCase()}
      </Avatar>
      <Typography
        variant="body2"
        color="text.secondary"
        className={styles.avatar_body2}
        gutterBottom
        noWrap
      >
        UID: {user.id ?? "."}
      </Typography>
      <Typography variant="subtitle1">
        {user.name ?? "."} {user.surname}
      </Typography>
    </>
  );
}

function PrivateItem() {
  const { user, setUser } = useUser();

  const [privateMode, setPrivateMode] = useState(user.private);

  return (
    <div
      className={styles.item}
      onClick={() => {
        const n = !privateMode;
        setPrivateMode(n);
        setUser((prev) => ({ ...prev, private: n }));
        fetch(
          `${
            process.env.NEXT_PUBLIC_BACKEND_URL
          }/interface/users?section=private&v=${n ? 1 : 0}`,
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
      <Switch checked={privateMode} />
      <Typography variant="body2" className={styles.select}>
        Скрыть приватные данные
      </Typography>
    </div>
  );
}

function ConvertItem() {
  const { user, setUser } = useUser();

  const [convertMode, setConvertMode] = useState(user.convert);

  return (
    <div
      className={styles.item}
      onClick={() => {
        const n = !convertMode;
        setConvertMode(n);
        setUser((prev) => ({ ...prev, convert: n }));
        fetch(
          `${
            process.env.NEXT_PUBLIC_BACKEND_URL
          }/interface/users?section=convert?v=${n ? 1 : 0}`,
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
      <Switch checked={convertMode} />
      <Typography variant="body2" className={styles.select}>
        Примерная сумма в рублях
      </Typography>
    </div>
  );
}

function LanguageItem() {
  const [language, setLanguage] = useState("ru");

  return (
    <>
      <Button
        className={styles.lang_button}
        onClick={() => {
          setLanguage("ru");
        }}
        style={{
          border:
            language === "ru"
              ? "1px solid rgb(0, 120, 103)"
              : "1px solid transparent",
        }}
      >
        <Image src={ru} width={40} style={{ borderRadius: "4px" }} alt="ru" />
      </Button>
      <Button
        className={styles.lang_button}
        onClick={() => {
          setLanguage("en");
        }}
        sx={{
          border:
            language === "en"
              ? "1px solid rgb(0, 120, 103)"
              : "1px solid transparent",
        }}
      >
        <Image src={en} width={40} style={{ borderRadius: "4px" }} alt="en" />
      </Button>
    </>
  );
}

function EditItem() {
  const { user, setUser } = useUser();

  const [publicNameError, setPublicNameError] = useState("");
  const [statusSnackbar, setStatusSnackbar] = useState({});
  const [surnameError, setSurnameError] = useState("");
  const [nameError, setNameError] = useState("");
  const [loading, setLoading] = useState(false);

  const nameRef = useRef(null);
  const suranameRef = useRef(null);
  const publicNameRef = useRef(null);

  function handleSubmit() {
    let nameMessage = "";
    let surnameMessage = "";
    let publicNameMessage = "";

    const name = nameRef.current.value;
    const surname = suranameRef.current.value;
    const publicName = publicNameRef.current.value;

    switch (true) {
      case name.length < 3:
        nameMessage = "Не менее 3 символов";
        break;
      case name.length > 16:
        nameMessage = "Не более 16 символов";
        break;
      case /\s/.test(name):
        nameMessage = "Имя не должно содержать пробелы";
        break;
      default:
        break;
    }

    switch (true) {
      case surname.length > 20:
        surnameMessage = "Не более 20 символов";
        break;
      case /\s/.test(surname):
        surnameMessage = "Фамилия не должна содержать пробелы";
        break;
      default:
        break;
    }

    switch (true) {
      case publicName.length > 30:
        publicNameMessage = "Не более 30 символов";
        break;
      case /\s/.test(publicName):
        publicNameMessage = "Публичное имя не должно содержать пробелы";
        break;
      case publicName.length > 0 &&
        !/^[a-zA-Z0-9\s~`!@#$%^&*()-_+=\\|{}[\]:;"'<>,.?/]+$/.test(publicName):
        publicNameMessage =
          "Публичное имя должно содержать только латинские буквы";
        break;
      default:
        break;
    }

    if (nameMessage || surnameMessage || publicNameMessage) {
      setNameError(nameMessage);
      setSurnameError(surnameMessage);
      setPublicNameError(publicNameMessage);
      return;
    }

    setLoading(true);

    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/interface/users?name=${name}&surname=${surname}&public=${publicName}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-TRADIFY-UID": user.id,
        },
      }
    )
      .then((res) => res.json())
      .then((res) => {
        setLoading(false);
        if (res === 200) {
          setUser((prev) => ({ ...prev, name, surname, public: publicName }));
          setStatusSnackbar({
            show: true,
            variant: "success",
          });
        } else if (res === 409) {
          setPublicNameError("Такое публичное имя уже существует");
        } else {
          setStatusSnackbar({ show: true, variant: "error" });
        }
      });
  }

  return (
    <>
      <div className={styles.form}>
        <TextField
          label="Имя"
          name="firstName"
          type="text"
          variant="outlined"
          defaultValue={user.name}
          inputRef={nameRef}
          onChange={() => {
            setNameError("");
          }}
          error={Boolean(nameError)}
          helperText={nameError}
        />
        <TextField
          label="Фамилия"
          name="lastName"
          type="text"
          variant="outlined"
          defaultValue={user.surname}
          inputRef={suranameRef}
          onChange={() => {
            setSurnameError("");
          }}
          error={Boolean(surnameError)}
          helperText={surnameError}
        />
        <TextField
          label="Публичное имя"
          name="publicName"
          type="text"
          variant="outlined"
          autoComplete="off"
          defaultValue={user.public}
          inputRef={publicNameRef}
          onChange={() => {
            setPublicNameError("");
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment>https://tradify.su/u/</InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end" sx={{ paddingRight: 1 }}>
                <IconButton
                  onClick={() => {
                    navigator.clippanel
                      .writeText(
                        "https://tradify.su/u/" + publicNameRef.current.value
                      )
                      .then(() => {
                        setStatusSnackbar({
                          show: true,
                          variant: "info",
                          text: "Ссылка скопирована",
                        });
                      });
                  }}
                  edge="end"
                >
                  <Iconify
                    icon="solar:copy-bold-duotone"
                    color="text.disabled"
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
          error={Boolean(publicNameError)}
          helperText={publicNameError}
        />
        <TextField
          label="Эл. почта"
          name="email"
          type="text"
          variant="outlined"
          disabled
          defaultValue={user.email}
        />
      </div>
      <Typography
        variant="caption"
        color="text.secondary"
        className={styles.caption}
      >
        При необходимости сменить почту, обратитесь в службу поддержки.
      </Typography>
      <div className={styles.save_button}>
        <LoadingButton
          variant="contained"
          color="inherit"
          size="medium"
          loading={loading}
          onClick={handleSubmit}
        >
          Сохранить
        </LoadingButton>
      </div>
      <AlertSnackbar
        statusSnackbar={statusSnackbar}
        setStatusSnackbar={setStatusSnackbar}
      />
    </>
  );
}

export default function TabUser() {
  return (
    <Grid container spacing={3} className={styles.container}>
      <Grid item xs={12} md={4}>
        <Card>
          <Stack className={styles.avatar_stack}>
            <AvatarItem />
          </Stack>
        </Card>
      </Grid>
      <Grid item xs={12} md={8}>
        <Card className={styles.card}>
          <EditItem />
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card className={styles.mini_card}>
          <Stack className={styles.stack}>
            <Typography variant="subtitle2">Язык</Typography>
            <div className={styles.div}>
              <LanguageItem />
            </div>
          </Stack>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card className={styles.mini_card}>
          <Stack className={styles.stack}>
            <Typography variant="subtitle2">Приватность</Typography>
            <PrivateItem />
            <Typography variant="caption" color="text.secondary">
              Значения баланса, прибыли и т.п. будут заменены заглушкой на всех
              страницах (кроме страницы «Сделки»)
            </Typography>
          </Stack>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card className={styles.mini_card}>
          <Stack className={styles.stack}>
            <Typography variant="subtitle2">Валюта</Typography>
            <ConvertItem />
            <Typography variant="caption" color="text.secondary">
              Показывает рядом с $ показаниями сконвертированную по курсу валют
              сумму в ₽
            </Typography>
          </Stack>
        </Card>
      </Grid>
    </Grid>
  );
}
