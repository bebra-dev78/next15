"use client";

import InputAdornment from "@mui/material/InputAdornment";
import LoadingButton from "@mui/lab/LoadingButton";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { start } from "nprogress";

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
  const [nameError, setNameError] = useState("");
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState(false);
  const [show, setShow] = useState(false);

  const passwordRef = useRef(null);
  const emailRef = useRef(null);
  const nameRef = useRef(null);

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
    let nameErrorMessage = "";
    let emailErrorMessage = "";
    let passwordErrorMessage = "";

    const name = nameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    switch (true) {
      case name.length < 3:
        nameErrorMessage = "Не менее 3 символов";
        break;
      case name.length > 16:
        nameErrorMessage = "Не более 16 символов";
        break;
      case /\s/.test(name):
        nameErrorMessage = "Имя не должно содержать пробелы";
        break;
      case !/^[A-Za-zА-Яа-яЁё\d\s.,!?()-]+$/.test(name):
        nameErrorMessage = "Некорректное имя";
        break;
      default:
        break;
    }

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

    if (nameErrorMessage || emailErrorMessage || passwordErrorMessage) {
      setNameError(nameErrorMessage);
      setEmailError(emailErrorMessage);
      setPasswordError(passwordErrorMessage);
      return;
    }

    setLoading(true);
    setAction(false);

    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register?name=${name}&email=${email}&password=${password}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((res) => {
        setLoading(false);
        if (res === 200) {
          start();
          signIn("credentials", {
            email,
            password,
            redirect: false,
          }).finally(() => {
            router.push("/my/overview");
          });
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
            Пользователь с такой почтой уже существует.
          </Alert>
        )}
        <TextField
          label="Имя пользователя"
          name="firstName"
          type="text"
          variant="outlined"
          inputRef={nameRef}
          onChange={() => {
            setNameError("");
          }}
          error={Boolean(nameError)}
          helperText={nameError}
        />
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
          autoComplete="new-password"
          inputRef={passwordRef}
          onChange={() => {
            setPasswordError("");
          }}
          error={Boolean(passwordError)}
          helperText={passwordError || "В пароле должно быть 8+ символов"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end" sx={{ marginRight: 1 }}>
                <IconButton
                  aria-label={show ? "Скрыть пароль" : "Показать пароль"}
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
      <LoadingButton
        variant="contained"
        color="inherit"
        size="large"
        type="submit"
        fullWidth
        loading={loading}
        className={styles.button}
      >
        Создать аккаунт
      </LoadingButton>
    </form>
  );
}
