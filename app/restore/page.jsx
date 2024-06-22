import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";

import RootSecondaryHeader from "#/components/root-secondary-header";
import NProgressLink from "#/components/nprogress-link";
import Iconify from "#/components/iconify";
import Form from "#/app/restore/form";

export const metadata = {
  title: "Восстановление аккаунта | Tradify",
  description: "Tradify —	восстановление аккаунта",
};

import styles from "./page.module.css";

export default function Restore() {
  return (
    <>
      <RootSecondaryHeader />
      <Container component="main">
        <Stack className={styles.main_stack}>
          <Form styles={styles} />
          <NProgressLink path="/login" className={styles.link}>
            <Iconify
              icon="eva:arrow-ios-back-fill"
              color="info.main"
              width={18}
            />
            <Typography
              variant="subtitle2"
              color="info.main"
              className={styles.hover}
            >
              вернуться на страницу входа
            </Typography>
          </NProgressLink>
        </Stack>
      </Container>
    </>
  );
}
