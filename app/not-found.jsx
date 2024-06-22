import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import Script from "next/script";

import RootSecondaryHeader from "#/components/root-secondary-header";
import NProgressLink from "#/components/nprogress-link";

import styles from "./not-found.module.css";

export const metadata = {
  title: "Страница не найдена | Tradify",
  description: "Tradify — страница не найдена",
};

export default function NotFound() {
  return (
    <>
      <RootSecondaryHeader />
      <Container component="main">
        <Stack className={styles.stack}>
          <Typography variant="h3" color="text.primary" paragraph>
            Извините, страница не найдена!
          </Typography>
          <Typography color="text.secondary">
            Извините, нам не удалось найти страницу, которую вы ищете. Возможно,
            вы неправильно ввели URL-адрес?
          </Typography>
          <tgs-player
            autoplay
            loop
            mode="normal"
            src="/video/duck_not_found.tgs"
            className={styles.tgs_player}
          />
          <div>
            <NProgressLink path="/">
              <Button variant="contained" color="inherit" size="large">
                Вернуться на главную
              </Button>
            </NProgressLink>
          </div>
        </Stack>
      </Container>
      <Script src="https://unpkg.com/@lottiefiles/lottie-player@2.0.3/dist/tgs-player.js" />
    </>
  );
}
