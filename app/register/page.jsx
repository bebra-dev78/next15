import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import Image from "next/image";

import NProgressLink from "#/components/nprogress-link";
import AppLogo from "#/components/app-logo";
import Form from "#/app//register/form";

import auth_illustration from "#/public/images/auth_illustration.png";

import styles from "./page.module.css";

export const metadata = {
  title: "Регистрация | Tradify",
  description: "Tradify —	регистрация аккаунта",
};

export default function Register() {
  return (
    <main className={styles.main}>
      <div className={styles.logo}>
        <AppLogo />
      </div>
      <div className={styles.main_div}>
        <Typography variant="h3" color="text.primary" className={styles.h3}>
          Начните управлять своими сделками
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
            Регистрация в Tradify
          </Typography>
          <div className={styles.hero_stack_div}>
            <Typography variant="body2" color="text.primary">
              Уже есть аккаунт?
            </Typography>
            <NProgressLink path="/login">
              <Typography
                variant="subtitle2"
                color="primary.main"
                className={styles.hover}
              >
                Войти
              </Typography>
            </NProgressLink>
          </div>
        </Stack>
        <Form />
        <Typography
          variant="caption"
          color="text.secondary"
          className={styles.caption}
        >
          Создавая аккаунт, вы соглашаетесь с нашей{" "}
          <NProgressLink path="/policy">
            <Typography
              variant="caption"
              color="info.main"
              className={styles.hover}
            >
              политикой конфиденциальности
            </Typography>
          </NProgressLink>
          .
        </Typography>
      </Stack>
    </main>
  );
}
