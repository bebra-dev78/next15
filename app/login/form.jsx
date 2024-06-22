"use client";

import InputAdornment from "@mui/material/InputAdornment";
import LoadingButton from "@mui/lab/LoadingButton";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { start } from "nprogress";

import NProgressLink from "#/components/nprogress-link";
import Iconify from "#/components/iconify";

import styles from "./form.module.css";

export default function Form() {
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/my/overview");
    fetch("/api/check")
      .then((res) => res.json())
      .then((res) => {
        if (res === 200) {
          start();
          router.push("/my/overview");
        }
      });
  }, []);

  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState(false);
  const [show, setShow] = useState(false);

  const passwordRef = useRef(null);
  const emailRef = useRef(null);

  useEffect(() => {
    function handleKeyPress(event) {
      if (event.key === "Enter" || event.key === " ") {
        handleSubmit();
      }
    }

    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  function handleSubmit() {
    let emailErrorMessage = "";
    let passwordErrorMessage = "";

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    switch (true) {
      case !email:
        emailErrorMessage = "Эл. почта не указана";
        break;
      case email.length > 255:
        passwordErrorMessage = "Не более 255 символов";
        break;
      case !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email):
        emailErrorMessage = "Некорректная эл. почта";
        break;
      default:
        break;
    }

    switch (true) {
      case password.length < 8:
        passwordErrorMessage = "Не менее 8 символов";
        break;
      case password.length > 24:
        passwordErrorMessage = "Не более 24 символов";
        break;
      case /\s/.test(password):
        passwordErrorMessage = "Пароль не должен содержать пробелы";
        break;
      default:
        break;
    }

    if (emailErrorMessage || passwordErrorMessage) {
      setEmailError(emailErrorMessage);
      setPasswordError(passwordErrorMessage);
      return;
    }

    setLoading(true);
    setAction(false);

    signIn("credentials", {
      email,
      password,
      redirect: false,
    }).then((res) => {
      setLoading(false);
      if (res.status === 200) {
        start();
        router.push("/my/overview");
      } else {
        setAction(true);
      }
    });
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        handleSubmit();
      }}
    >
      <Stack className={styles.stack}>
        {action && (
          <Alert
            severity="error"
            icon={
              <Iconify
                icon="solar:danger-bold"
                sx={{
                  color: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgb(255, 172, 130)"
                      : "rgb(255, 86, 48)",
                }}
              />
            }
          >
            Неверные данные. Проверьте правильность введённых данных.
          </Alert>
        )}
        <TextField
          label="Эл. почта"
          name="email"
          type="email"
          variant="outlined"
          inputRef={emailRef}
          onChange={() => {
            setEmailError("");
          }}
          error={Boolean(emailError)}
          helperText={emailError}
        />
        <TextField
          label="Пароль"
          name="password"
          type={show ? "text" : "password"}
          variant="outlined"
          autoComplete="current-password"
          inputRef={passwordRef}
          onChange={() => {
            setPasswordError("");
          }}
          error={Boolean(passwordError)}
          helperText={passwordError}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end" sx={{ marginRight: 1 }}>
                <IconButton
                  aria-label="Скрыть/Показать пароль"
                  edge="end"
                  onClick={() => {
                    setShow((prev) => !prev);
                  }}
                >
                  <Iconify
                    icon={
                      show ? "solar:eye-bold" : "solar:eye-closed-bold-duotone"
                    }
                    color="text.disabled"
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>
      <div className={styles.div}>
        <NProgressLink path="/restore">
          <Typography
            variant="body2"
            color="info.main"
            className={styles.hover}
          >
            Забыли пароль?
          </Typography>
        </NProgressLink>
      </div>
      <LoadingButton
        variant="contained"
        color="inherit"
        size="large"
        type="submit"
        fullWidth
        loading={loading}
        className={styles.button}
      >
        Войти
      </LoadingButton>
    </form>
  );
}
