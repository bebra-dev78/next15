import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";

import Iconify from "#/components/iconify";

import styles from "./page.module.css";

export const metadata = {
  title: "Новости | Tradify",
  description: "💊",
};

const news = [
  {
    id: 2,
    md: 6,
    title: "Обновление 0.4.0",
    content:
      "Доброго времени суток, партнёры! В этом обновлении мы немного поработали над улучшением UX нашего сервиса:\n\n• В инструментах наложений свечного графика была добавлена «линейка» — она позволяет узнать изменение цены в абсолютном и процентном соотношениях.\n\n• На странице аккаунта теперь срабатывает мягкая анимация при перемещении между вкладками.\n\n• Теперь большинство переиспользуемых данных кешируются прямо на клиенте, благодаря чему можно перемещаться по страницам панели управления практически без загрузок.",
    date: "25 февраля 2024",
  },
  {
    id: 2,
    md: 6,
    title: "Обновление 0.3.0",
    content:
      "Доброго времени суток, партнёры!\n\nСервис был полноценно адаптирован к бирже Bybit, а именно — к linear фьючерсам. Теперь можно загрузить историю этих сделок за последний месяц и посмотреть их на свечном графике. В будущем мы планируем добавить больше бирж и их типы торговли.\n\nТакже была улучшена адаптивность таблицы сделок и свечного графика на мобильных устройствах.",
    date: "21 февраля 2024",
  },
  {
    id: 1,
    md: 6,
    title: "Обновление 0.2.0",
    content:
      "Доброго времени суток, партнёры! За эту неделю мы провели множество изменений в основных страницах панели управления.\n\nГлавная:\n\n• Подкорректированы значения показателей прибыли, комиссии и объёма за последние 24 часа.\n• Добавлен график, отображающий основные показатели сделок за каждый день в течение недели и их суммарные значения.\n\nСделки:\n\n• В таблицу сделок была добавлена функция настройки высоты, сама по себе таблица технически не может адаптироваться по разный размер экрана и поэтому регулировать её высоту необходимо самостоятельно. Также были добавлены различные опции над выбранными сделками в таблице.\n• Был практически полностью переделан свечной график, в результате чего он стал намного оптимизированнее и удобнее.\n\nАналитика:\n\n• Были значительно изменены структура и дизайн страницы, а также добавлена возможность создавать несколько досок и виджетов.",
    date: "14 февраля 2024",
  },
];

export default function News() {
  return (
    <div className={styles.stretch}>
      <Typography variant="h4" color="text.primary" paragraph>
        Новости
      </Typography>
      <Alert
        severity="info"
        className={styles.alert}
        icon={
          <Iconify icon="solar:info-square-bold" sx={{ marginTop: "3px" }} />
        }
      >
        Также все новости и информация о последних событиях сервиса есть в нашем{" "}
        <a href="https://t.me/tradifyy" target="_blank">
          <Typography
            variant="subtitle2"
            color="error.main"
            component="span"
            className={styles.hover}
          >
            Telegram-канале
          </Typography>
        </a>
      </Alert>
      <Grid container spacing={3}>
        {news.map((item) => (
          <Grid key={item.id} item xs={12} md={item.md}>
            <Card>
              <CardHeader
                title={item.title}
                subheader={
                  <Typography variant="caption" className={styles.caption}>
                    <Iconify
                      icon="solar:calendar-date-bold-duotone"
                      width={16}
                      sx={{ marginTop: "-2.5px" }}
                    />
                    {item.date}
                  </Typography>
                }
              />
              <CardContent>
                <Typography className={styles.card_content}>
                  {item.content}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
