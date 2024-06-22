import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import Image from "next/image";

import NProgressLink from "#/components/nprogress-link";
import AppLogo from "#/components/app-logo";
import Form from "#/app/login/form";

import auth_illustration from "#/public/images/auth_illustration.png";

import styles from "./page.module.css";

export const metadata = {
  title: "Вход | Tradify",
  description: "Tradify —	вход в аккаунт",
};

export default function Login() {
  return (
    <main className={styles.main}>
      <div className={styles.logo}>
        <AppLogo />
      </div>
      <div className={styles.main_div}>
        <Typography variant="h3" color="text.primary" className={styles.h3}>
          Привет, с возвращением
        </Typography>
        <Image
          src={auth_illustration}
          alt="docs"
          priority
          style={{ zIndex: 1 }}
        />
        <div className={styles.overlay} />
      </div>
      <Stack className={styles.main_stack}>
        <Stack className={styles.hero_stack}>
          <Typography variant="h4" color="text.primary">
            Вход в аккаунт
          </Typography>
          <div className={styles.hero_stack_div}>
            <Typography variant="body2" color="text.primary">
              Новый пользователь?
            </Typography>
            <NProgressLink path="/register">
              <Typography
                variant="subtitle2"
                color="primary.main"
                className={styles.hover}
              >
                Создайте аккаунт
              </Typography>
            </NProgressLink>
          </div>
        </Stack>
        <Form />
      </Stack>
    </main>
  );
}
