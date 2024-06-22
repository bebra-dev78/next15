import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";

import RootPrimaryHeader from "#/components/root-primary-header";
import RootFooter from "#/components/root-footer";

import styles from "./page.module.css";

export const metadata = {
  title: "Политика конфиденциальности | Tradify",
  description: "Tradify —	политика конфиденциальности",
};

export default function Policy() {
  return (
    <>
      <RootPrimaryHeader />
      <main className={styles.main}>
        <div className={styles.main_div}>
          <Container className={styles.main_div_container}>
            <Stack className={styles.stack}>
              <Typography
                variant="h1"
                color="text.primary"
                className={styles.hero_text}
              >
                Политика
              </Typography>
              <Typography
                variant="h1"
                color="primary.main"
                className={styles.hero_text}
              >
                конфиденциальности
              </Typography>
            </Stack>
          </Container>
          <div className={styles.overlay} />
        </div>
        <Container className={styles.main_container}>
          <Typography color="text.primary">
            Настоящая Политика конфиденциальности персональных данных (далее –
            Политика конфиденциальности) действует в отношении всей информации,
            которую сайт, может получить о Пользователе во время использования
            сайта. Используя сайт и (или) оставляя свои персональные данные на
            сайте, Пользователь выражает свое согласие на использование данных
            на условиях, изложенных в настоящей Политике конфиденциальности.
            Отношения, связанные со сбором, хранением, распространением и
            защитой информации, предоставляемой Пользователем, регулируются
            настоящей Политикой и действующим законодательством Российской
            Федерации. В случае несогласия Пользователя с условиями настоящей
            Политики использование сайта должно быть немедленно прекращено.
          </Typography>
        </Container>
      </main>
      <RootFooter />
    </>
  );
}
