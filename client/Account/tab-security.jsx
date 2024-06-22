"use client";

import InputAdornment from "@mui/material/InputAdornment";
import LoadingButton from "@mui/lab/LoadingButton";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import { useState, useRef } from "react";

import AlertSnackbar from "#/components/alert-snackbar";
import Iconify from "#/components/iconify";
import { useUser } from "#/app/my/layout";

import styles from "./tab-security.module.css";

function Form() {
  const { user, setUser } = useUser();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [repeatPasswordError, setRepeatPasswordError] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [newPasswordError, setNewPasswordError] = useState("");
  const [statusSnackbar, setStatusSnackbar] = useState({});
  const [loading, setLoading] = useState(false);

  const currentPasswordRef = useRef(null);
  const newPasswordRef = useRef(null);
  const repeatPasswordRef = useRef(null);

  function handleSubmit() {
    let currentPasswordMessage = "";
    let repeatPasswordMessage = "";
    let newPasswordMessage = "";

    const currentPassword = currentPasswordRef.current.value;
    const newPassword = newPasswordRef.current.value;
    const repeatPassword = repeatPasswordRef.current.value;

    switch (true) {
      case newPassword.length < 8:
        newPasswordMessage = "Не менее 8 символов";
        break;
      case newPassword.length > 24:
        newPasswordMessage = "Не более 24 символов";
        break;
      case /\s/.test(newPassword):
        newPasswordMessage = "Пароль не должен содержать пробелы";
        break;
      case !/^[A-Za-zА-Яа-яЁё\d\s.,!?()-]+$/.test(newPassword):
        newPasswordMessage = "Некорректный пароль";
        break;
      case repeatPassword.trim() !== newPassword.trim():
        repeatPasswordMessage = "Пароли не совпадают";
        newPasswordMessage = "Пароли не совпадают";
        break;
      case currentPassword.trim() === newPassword.trim():
        currentPasswordMessage = "Пароли должны отличаться";
        newPasswordMessage = "Пароли должны отличаться";
        break;
      default:
        break;
    }

    if (currentPasswordMessage || newPasswordMessage) {
      setCurrentPasswordError(currentPasswordMessage);
      setRepeatPasswordError(repeatPasswordMessage);
      setNewPasswordError(newPasswordMessage);
      return;
    }

    setLoading(true);

    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/interface/users?section=password&v=${newPassword}&password=${currentPassword}`,
      {
        method: "PATCH",
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
          setStatusSnackbar({ show: true, variant: "success" });
          setUser((prev) => ({ ...prev, password: newPassword }));
          setCurrentPasswordError("");
          setRepeatPasswordError("");
          setNewPasswordError("");

          currentPasswordRef.current.value = newPassword;
          repeatPasswordRef.current.value = "";
          newPasswordRef.current.value = "";

          setShowCurrentPassword(false);
          setShowNewPassword(false);
        } else if (res === 403) {
          setCurrentPasswordError("Неверный пароль");
        } else {
          setStatusSnackbar({ show: true, variant: "error" });
        }
      });
  }

  return (
    <>
      <TextField
        label="Текущий пароль"
        name="currentPassword"
        type={showCurrentPassword ? "text" : "password"}
        fullWidth
        inputRef={currentPasswordRef}
        onChange={() => {
          setCurrentPasswordError("");
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end" sx={{ paddingRight: 1 }}>
              <IconButton
                onClick={() => setShowCurrentPassword((prev) => !prev)}
                edge="end"
              >
                <Iconify
                  icon={
                    showCurrentPassword
                      ? "solar:eye-bold"
                      : "solar:eye-closed-bold-duotone"
                  }
                  color="text.disabled"
                />
              </IconButton>
            </InputAdornment>
          ),
        }}
        error={Boolean(currentPasswordError)}
        helperText={currentPasswordError}
      />
      <TextField
        label="Новый пароль"
        name="newPassword"
        type={showNewPassword ? "text" : "password"}
        fullWidth
        autoComplete="new-password"
        inputRef={newPasswordRef}
        onChange={() => {
          setNewPasswordError("");
          setRepeatPasswordError("");
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end" sx={{ paddingRight: 1 }}>
              <IconButton
                onClick={() => setShowNewPassword((prev) => !prev)}
                edge="end"
              >
                <Iconify
                  icon={
                    showNewPassword
                      ? "solar:eye-bold"
                      : "solar:eye-closed-bold-duotone"
                  }
                  color="text.disabled"
                />
              </IconButton>
            </InputAdornment>
          ),
        }}
        error={Boolean(newPasswordError)}
        helperText={newPasswordError}
      />
      <TextField
        label="Повторите новый пароль"
        name="repeatPassword"
        type={showNewPassword ? "text" : "password"}
        fullWidth
        autoComplete="off"
        inputRef={repeatPasswordRef}
        onChange={() => {
          setNewPasswordError("");
          setRepeatPasswordError("");
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end" sx={{ paddingRight: 1 }}>
              <IconButton
                onClick={() => setShowNewPassword((prev) => !prev)}
                edge="end"
              >
                <Iconify
                  icon={
                    showNewPassword
                      ? "solar:eye-bold"
                      : "solar:eye-closed-bold-duotone"
                  }
                  color="text.disabled"
                />
              </IconButton>
            </InputAdornment>
          ),
        }}
        error={Boolean(repeatPasswordError)}
        helperText={repeatPasswordError}
      />
      <LoadingButton
        variant="contained"
        color="inherit"
        size="medium"
        loading={loading}
        className={styles.button}
        onClick={handleSubmit}
      >
        Сохранить
      </LoadingButton>
      <AlertSnackbar
        statusSnackbar={statusSnackbar}
        setStatusSnackbar={setStatusSnackbar}
      />
    </>
  );
}

export default function TabSecurity() {
  return (
    <Grid container spacing={3} className={styles.container}>
      <Grid item xs={12} md={8}>
        <Card className={styles.card}>
          <Typography variant="h6" paragraph>
            Изменить пароль
          </Typography>
          <Stack className={styles.stack}>
            <Form />
          </Stack>
        </Card>
      </Grid>
    </Grid>
  );
}
