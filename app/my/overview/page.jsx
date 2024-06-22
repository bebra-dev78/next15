import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";

import Image from "next/image";

import GridLayoutItems from "#/client/Overview/grid-layout-items";
import WelcomeItem from "#/client/Overview/welcome-item";
import NProgressLink from "#/components/nprogress-link";
import ElapsedTime from "#/utils/elapsed-time";
import Iconify from "#/components/iconify";

import woman_2 from "#/public/images/woman_2.png";

import styles from "./page.module.css";

export const metadata = {
  title: "Главная | Tradify",
  description: "💊",
};

export default function Overview() {
  return (
    <div className={styles.stretch}>
      <WelcomeItem />
      <Grid container spacing={3} className={styles.grid_container}>
        <GridLayoutItems />
        <Grid item xs={12} md={6} xl={6}>
          <Card>
            <CardHeader
              title="Обновление 0.4.0"
              subheader={
                <Typography
                  variant="caption"
                  color="text.secondary"
                  className={styles.caption}
                >
                  <Iconify icon="solar:clock-circle-bold" width={16} />
                  <ElapsedTime time="2024-02-25T16:49:00Z" /> назад
                </Typography>
              }
            />
            <CardContent>
              <Typography className={styles.card_content}>
                Доброго времени суток, партнёры! В этом обновлении мы немного
                поработали над улучшением UX нашего сервиса:
                <br />
                <br />• В инструментах наложений свечного графика была добавлена
                «линейка» — она позволяет узнать изменение цены в абсолютном и
                процентном соотношениях.
                <br />
                <br />• На странице аккаунта теперь срабатывает мягкая анимация
                при перемещении между вкладками.
                <br />
                <br />• Теперь большинство переиспользуемых данных кешируются
                прямо на клиенте, благодаря чему можно перемещаться по страницам
                панели управления практически без загрузок.
              </Typography>
              <NProgressLink path="/my/news">
                <Button
                  variant="outlined"
                  color="error"
                  size="medium"
                  fullWidth
                >
                  Все новости
                </Button>
              </NProgressLink>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <span className={styles.span_image}>
            <Image src={woman_2} height={202} width={140} alt="woman" />
          </span>
          <Card className={styles.payment_card}>
            <div className={styles.payment_div}>
              <Typography variant="h4" className={styles.payment_h4}>
                С ежемесячной подпиской можно пользоваться дневником без
                ограничений
              </Typography>
              <Typography variant="h2">5$</Typography>
            </div>
            <Typography variant="body2" className={styles.payment_body2}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
              harum, recusandae pariatur itaque doloribus debitis. Autem dolorem
              voluptate explicabo quaerat.
            </Typography>
            <NProgressLink path="/my/payment">
              <Button variant="contained" color="warning" size="medium">
                Подробнее
              </Button>
            </NProgressLink>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
