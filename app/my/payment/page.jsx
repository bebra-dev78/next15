import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

import Iconify from "#/components/iconify";

import styles from "./page.module.css";

export const metadata = {
  title: "Подписка | Tradify",
  description: "💊",
};

export default function Payment() {
  return (
    <Container>
      <Stack className={styles.stack}>
        <Typography variant="h2" color="text.primary" className={styles.h2}>
          Лучший выбор
          <br />
          для вашей торговли
        </Typography>
        <Typography color="text.secondary">
          С премиальной подпиской вы сможете открыть все возможности дневника
        </Typography>
      </Stack>
      <div className={styles.div}>
        <Stack className={styles.child_stack}>
          <Typography variant="overline" color="text.disabled" paragraph>
            Навсегда
          </Typography>
          <Typography
            variant="h4"
            color="text.primary"
            className={styles.h4}
            paragraph
          >
            Бесплатно
            <Box
              className={styles.underline}
              sx={{
                backgroundColor: "primary.main",
              }}
            />
          </Typography>
          <Stack className={styles.checkmarks_stack}>
            <Box className={styles.checkmark} sx={{ color: "text.primary" }}>
              <Iconify icon="eva:checkmark-fill" width={18} />
              <Typography variant="body2">
                Без ограничений на кол-во API-ключей
              </Typography>
            </Box>
            <Box className={styles.checkmark} sx={{ color: "text.primary" }}>
              <Iconify icon="eva:checkmark-fill" width={18} />
              <Typography variant="body2">
                Без ограничений на кол-во виджетов
              </Typography>
            </Box>
            <Box className={styles.checkmark} sx={{ color: "text.primary" }}>
              <Iconify icon="eva:checkmark-fill" width={18} />
              <Typography variant="body2">
                Без ограничений на историю сделок
              </Typography>
            </Box>
            <Divider />
            <Box className={styles.checkmark} sx={{ color: "text.disabled" }}>
              <Iconify icon="eva:close-fill" width={18} />
              <Typography variant="body2">
                Доступна всего 1 доска в «Аналитике»
              </Typography>
            </Box>
            <Box className={styles.checkmark} sx={{ color: "text.disabled" }}>
              <Iconify icon="eva:close-fill" width={30} />
              <Typography variant="body2">
                В «Журнале» можно посмотреть данные только за текущий месяц
              </Typography>
            </Box>
            <Box className={styles.checkmark} sx={{ color: "text.disabled" }}>
              <Iconify icon="eva:close-fill" width={18} />
              <Typography variant="body2">
                Ограничения на публичный профиль
              </Typography>
            </Box>
          </Stack>
        </Stack>
        <Stack className={styles.child_stack}>
          <Typography variant="overline" color="text.disabled" paragraph>
            Ежемесячно
          </Typography>
          <Typography
            variant="h4"
            color="text.primary"
            paragraph
            className={styles.h4}
          >
            Премиум
            <Box
              className={styles.underline}
              sx={{
                backgroundColor: "info.main",
              }}
            />
          </Typography>
          <Stack className={styles.checkmarks_stack}>
            <Box className={styles.checkmark} sx={{ color: "text.primary" }}>
              <Iconify icon="eva:checkmark-fill" width={18} />
              <Typography variant="body2">
                Без ограничений на кол-во API-ключей
              </Typography>
            </Box>
            <Box className={styles.checkmark} sx={{ color: "text.primary" }}>
              <Iconify icon="eva:checkmark-fill" width={18} />
              <Typography variant="body2">
                Без ограничений на кол-во виджетов
              </Typography>
            </Box>
            <Box className={styles.checkmark} sx={{ color: "text.primary" }}>
              <Iconify icon="eva:checkmark-fill" width={18} />
              <Typography variant="body2">
                Без ограничений на историю сделок
              </Typography>
            </Box>
            <Divider />
            <Box className={styles.checkmark} sx={{ color: "info.main" }}>
              <Iconify icon="eva:checkmark-fill" width={18} />
              <Typography variant="body2">
                Доступно неограниченное кол-во досок
              </Typography>
            </Box>
            <Box className={styles.checkmark} sx={{ color: "info.main" }}>
              <Iconify icon="eva:checkmark-fill" width={26} />
              <Typography variant="body2">
                В «Журнале» можно посмотреть данные за любое время
              </Typography>
            </Box>
            <Box className={styles.checkmark} sx={{ color: "info.main" }}>
              <Iconify icon="eva:checkmark-fill" width={18} />
              <Typography variant="body2">
                Без ограничений на публичный профиль
              </Typography>
            </Box>
          </Stack>
          <Button
            variant="contained"
            color="inherit"
            size="large"
            className={styles.button}
          >
            Перейти к оплате
          </Button>
        </Stack>
      </div>
    </Container>
  );
}
