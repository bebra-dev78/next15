"use client";

import LoadingButton from "@mui/lab/LoadingButton";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { start } from "nprogress";
import Script from "next/script";

import Iconify from "#/components/iconify";

export default function Form({ styles }) {
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

  const [showError, setShowError] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState(false);
  const [email, setEmail] = useState("");

  function handleSubmit() {
    let emailErrorMessage = "";

    switch (true) {
      case !email:
        emailErrorMessage = "Эл. почта не указана";
        break;
      case !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email):
        emailErrorMessage = "Некорректная эл. почта";
        break;
      default:
        break;
    }

    if (emailErrorMessage) {
      setEmailError(emailErrorMessage);
      return;
    }

    setLoading(true);
    setShowError(false);
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        handleSubmit();
      }}
    >
      <Stack className={styles.form_stack}>
        {action ? (
          <>
            <tgs-player
              autoplay
              loop
              mode="normal"
              src="/video/duck_send_message.tgs"
              class={styles.tgs_player}
            />
            <Typography variant="h3" color="text.primary" paragraph>
              Запрос успешно отправлен!
            </Typography>
            <Typography color="text.secondary" paragraph>
              Мы отправили письмо с подтверждением на <br />
              <a href="https://mail.google.com/" target="_blank">
                <Typography
                  component="strong"
                  color="warning.main"
                  className={styles.hover}
                >
                  {email}
                </Typography>
              </a>
              <br />
              Пожалуйста, проверьте свою электронную почту.
            </Typography>
          </>
        ) : (
          <>
            <div>
              <tgs-player
                autoplay
                loop
                mode="normal"
                src="/video/duck_secret.tgs"
                class={styles.tgs_player}
                style={{ marginLeft: 50 }}
              />
            </div>
            <Typography variant="h3" color="text.primary">
              Забыли свой пароль?
            </Typography>
            <Typography color="text.secondary">
              Пожалуйста, введите адрес электронной почты, связанный с вашим
              аккаунтом, и мы отправим вам ссылку для сброса пароля.
            </Typography>
            {showError && (
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
                Произошла ошибка. Либо аккаунта с данной почтой не существует
                или он не активирован, либо недавно уже был создан запрос на
                восстановление аккаунта.
              </Alert>
            )}
            <TextField
              label="Эл. почта"
              name="email"
              type="email"
              variant="outlined"
              onChange={(e) => {
                setEmailError("");
                setEmail(e.target.value);
              }}
              error={Boolean(emailError)}
              helperText={emailError}
            />
            <LoadingButton
              variant="contained"
              color="inherit"
              size="large"
              fullWidth
              type="submit"
              loading={loading}
            >
              Сбросить пароль
            </LoadingButton>
          </>
        )}
      </Stack>
      <Script src="https://unpkg.com/@lottiefiles/lottie-player@2.0.3/dist/tgs-player.js" />
    </form>
  );
}
