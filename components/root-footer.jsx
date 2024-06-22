import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";

import Link from "next/link";

import AppLogo from "#/components/app-logo";

import styles from "./root-footer.module.css";

export default function RootFooter() {
  return (
    <footer>
      <Divider />
      <Container className={styles.container}>
        <Grid container className={styles.grid}>
          <Grid item xs={12} className={styles.grid_item}>
            <AppLogo />
          </Grid>
          <Grid item xs={8} md={3}>
            <Typography
              variant="body2"
              color="text.primary"
              className={styles.container}
            >
              Современный дневник трейдера, предназначенный для улучшения
              стратегии вашей торговли.
            </Typography>
            <Typography
              variant="body2"
              color="text.disabled"
              className={styles.container}
            >
              © 2024. Все права защищены
            </Typography>
          </Grid>
          <Grid item xs={12} md={7}>
            <div className={styles.column_div}>
              <Stack className={styles.child_stack}>
                <Typography variant="overline" color="text.primary">
                  Telegram
                </Typography>
                <a href="https://t.me/tradifyy" target="_blank">
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    className={styles.hover}
                  >
                    https://t.me/tradifyy
                  </Typography>
                </a>
              </Stack>
              <Stack className={styles.child_stack}>
                <Typography variant="overline" color="text.primary">
                  Правовая информация
                </Typography>
                <Link href="/policy">
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    className={styles.hover}
                  >
                    Политика конфиденциальности
                  </Typography>
                </Link>
              </Stack>
              <Stack className={styles.child_stack}>
                <Typography variant="overline" color="text.primary">
                  Связь с нами
                </Typography>
                <a href="mailto:support@tradify.su" target="_blank">
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    className={styles.hover}
                  >
                    support@tradify.su
                  </Typography>
                </a>
              </Stack>
            </div>
          </Grid>
        </Grid>
      </Container>
    </footer>
  );
}
