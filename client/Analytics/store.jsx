"use client";

import ListItemText from "@mui/material/ListItemText";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";

import SimpleBar from "simplebar-react";
import { useState } from "react";

import Iconify from "#/components/iconify";
import { useUser } from "#/app/my/layout";

import styles from "./store.module.css";

const widgets_cards = [
  {
    id: 1,
    icon_url: "solar:pie-chart-2-bold-duotone",
    title: "Распределение по LONG/SHORT",
    type: "Круговой",
  },
  {
    id: 2,
    icon_url: "solar:pie-chart-2-bold-duotone",
    title: "Распределение по монетам",
    type: "Круговой",
  },
  {
    id: 3,
    icon_url: "solar:chart-square-bold-duotone",
    title: "Объём по монете",
    type: "Столбчатый",
  },
];

export default function Store({ value, panels, setPanels, panelsDataRef }) {
  const { user } = useUser();

  const [open, setOpen] = useState(false);

  const current = panels[value] ?? [];

  return (
    <>
      <div className={styles.div}>
        <Typography variant="h4" color="text.primary">
          Аналитика
        </Typography>
        <Button
          color="inherit"
          variant={open ? "contained" : "text"}
          startIcon={<Iconify icon="solar:widget-add-bold" />}
          className={styles.button}
          disabled={Object.keys(panels).length === 0 || current.length >= 3}
          onClick={() => setOpen((prev) => !prev)}
        >
          Добавить виджеты ({current.length}/8)
        </Button>
      </div>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <SimpleBar>
          <div className={styles.stack}>
            {widgets_cards.map(
              (widget_card) =>
                !current.some((w) => w === widget_card.id) && (
                  <Paper
                    key={widget_card.id}
                    component="div"
                    className={styles.paper}
                    onClick={() => {
                      const n = [...current, widget_card.id];
                      setPanels((prev) => ({
                        ...prev,
                        [value]: n,
                      }));
                      fetch(
                        `${
                          process.env.NEXT_PUBLIC_BACKEND_URL
                        }/interface/panels?id=${
                          panelsDataRef.current.find((c) => c.title === value)
                            .id
                        }`,
                        {
                          method: "PATCH",
                          headers: {
                            "Content-Type": "application/json",
                            "X-TRADIFY-UID": user.id,
                          },
                          body: JSON.stringify(n),
                        }
                      );
                    }}
                    sx={{
                      ":hover": {
                        backgroundColor: (theme) =>
                          theme.palette.mode === "dark"
                            ? "rgb(33, 43, 54)"
                            : "rgb(255, 255, 255)",
                      },
                    }}
                  >
                    <CardContent>
                      <Iconify
                        icon={widget_card.icon_url}
                        color="rgb(32, 101, 209)"
                      />
                      <ListItemText
                        primary={widget_card.title}
                        primaryTypographyProps={{
                          variant: "body2",
                        }}
                        secondary={widget_card.type}
                        secondaryTypographyProps={{
                          variant: "caption",
                          className: styles.secondary,
                        }}
                      />
                    </CardContent>
                  </Paper>
                )
            )}
          </div>
        </SimpleBar>
      </Collapse>
    </>
  );
}
