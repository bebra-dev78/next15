import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";

import Image from "next/image";

import RootPrimaryHeader from "#/components/root-primary-header";
import RootFooter from "#/components/root-footer";
import Iconify from "#/components/iconify";

import woman_1 from "#/public/images/woman_1.png";

import styles from "./page.module.css";

export const metadata = {
  title: "FAQ | Tradify",
  description: "Tradify —	часто задаваемые вопросы",
};

export default function RootFAQ() {
  return (
    <>
      <RootPrimaryHeader />
      <main className={styles.main}>
        <div className={styles.main_div}>
          <Container className={styles.container}>
            <Stack className={styles.container_stack}>
              <Typography variant="h1" color="text.primary" paragraph>
                FAQ
              </Typography>
              <Typography variant="h6" fontWeight={500} color="text.secondary">
                В этом справочном разделе вы найдёте всю основную информацию
                <br />
                для понятия устройства сервиса
              </Typography>
            </Stack>
            <div className={styles.img_div}>
              <Image src={woman_1} alt="FAQ" priority />
            </div>
          </Container>
          <div className={styles.overlay} />
        </div>
        <Container className={styles.grid_container}>
          <Grid container xs={3} className={styles.grid}>
            <Grid item xs={12} md={12}>
              <Typography variant="subtitle1" color="text.secondary" paragraph>
                Термины
              </Typography>
              <Accordion>
                <AccordionSummary
                  expandIcon={
                    <Iconify icon="solar:alt-arrow-down-bold-duotone" />
                  }
                >
                  Что такое трейдинг?
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Трейдинг — это الطماطم التداول عملة معماة الموت الجنس الحصاد
                    روسيا بوتين
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={
                    <Iconify icon="solar:alt-arrow-down-bold-duotone" />
                  }
                >
                  Сделки
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Сделка - это серия покупок-продаж криптоактивов на бирже.
                    Данные любой сделки образуются из ордеров этой позиции, а
                    границы сделки (время входа и время выхода) определяются
                    открывающим и закрывающим позицию ордерами.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Grid>
            <Grid item xs={12} className={styles.grid_item}>
              <Typography variant="subtitle1" color="text.secondary" paragraph>
                Работа с сервисом
              </Typography>
              <Accordion>
                <AccordionSummary
                  expandIcon={
                    <Iconify icon="solar:alt-arrow-down-bold-duotone" />
                  }
                >
                  Как добавить API-ключ?
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Перейдите на страницу{" "}
                    <a href="/my/account" target="_blank">
                      <Typography
                        component="span"
                        color="info.main"
                        className={styles.hover}
                      >
                        Аккаунт
                      </Typography>
                    </a>{" "}
                    и во вкладке "Ключи" добавьте новый API-ключ от
                    криптовалютной биржи, заполнив поля диалоговой формы. После
                    ввода ключ добавится и начнётся загрузка сделок от выбранной
                    биржи. Ни в коем случае не перезагружайте страницу после
                    добавления ключа, иначе загрузка сделок прервётся и ключ
                    будет необходимо пересоздавать. Вам придёт уведомление после
                    успешной загрузки или ошибки, если оно не пришло - напишите
                    в поддержку.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={
                    <Iconify icon="solar:alt-arrow-down-bold-duotone" />
                  }
                >
                  Подписка
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    В сервисе аккаунты бывают обычными и с премиум-подпиской .
                    На бесплатном типе аккаунта вы имеете все функции,
                    закрывающие базовые потребности любого трейдера, а с
                    премиум-подпиской вы получаете больше удобства в работе и
                    все возможности дневника. Подробнее об этом читайте{" "}
                    <a href="/my/payment" target="_blank">
                      <Typography
                        component="span"
                        color="info.main"
                        className={styles.hover}
                      >
                        здесь
                      </Typography>
                      .
                    </a>
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>
        </Container>
      </main>
      <RootFooter />
    </>
  );
}
