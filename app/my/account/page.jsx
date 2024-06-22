import Typography from "@mui/material/Typography";

import TabsWrapper from "#/client/Account/tabs-wrapper";

import styles from "./page.module.css";

export const metadata = {
  title: "Аккаунт | Tradify",
  description: "💊",
};

export default function Account() {
  return (
    <div className={styles.stretch}>
      <Typography variant="h4" color="text.primary" paragraph>
        Аккаунт
      </Typography>
      <TabsWrapper />
    </div>
  );
}
