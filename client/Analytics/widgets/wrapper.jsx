"use client";

import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import Card from "@mui/material/Card";

import Iconify from "#/components/iconify";

import styles from "./wrapper.module.css";

export default function Wrapper({ children, title, onClick, SelectInput }) {
  return (
    <Card className={styles.card}>
      <CardHeader
        title={title}
        titleTypographyProps={{
          className: "drag-header",
          sx: { cursor: "move" },
        }}
        action={
          <>
            {SelectInput && <SelectInput className={styles.select_input} />}
            <IconButton onClick={onClick}>
              <Iconify
                icon="solar:close-square-outline"
                color="text.disabled"
              />
            </IconButton>
          </>
        }
      />
      <CardContent>{children}</CardContent>
      <Iconify
        icon="tabler:border-corner-ios"
        color="#637381"
        width={18}
        sx={{
          position: "absolute",
          rotate: "180deg",
          bottom: 1,
          right: 1,
        }}
      />
    </Card>
  );
}
