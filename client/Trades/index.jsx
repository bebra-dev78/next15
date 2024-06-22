"use client";

import SpeedDialAction from "@mui/material/SpeedDialAction";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import IconButton from "@mui/material/IconButton";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import { useGridApiRef } from "@mui/x-data-grid";
import SpeedDial from "@mui/material/SpeedDial";
import Collapse from "@mui/material/Collapse";
import Backdrop from "@mui/material/Backdrop";
import Card from "@mui/material/Card";

import { useState } from "react";

import KlineChart from "#/client/Trades/klinechart";
import DataTable from "#/client/Trades/data-table";
import Iconify from "#/components/iconify";

import styles from "./index.module.css";

export default function Index() {
  const apiRef = useGridApiRef();

  const [activate, setActivate] = useState(null);
  const [hidden, setHidden] = useState(true);

  return (
    <>
      <KlineChart activate={activate} setActivate={setActivate} />
      <DataTableCardWrapper>
        <DataTable
          apiRef={apiRef}
          setHidden={setHidden}
          setActivate={setActivate}
        />
      </DataTableCardWrapper>
      <DealActions apiRef={apiRef} hidden={hidden} />
    </>
  );
}

function DataTableCardWrapper({ children }) {
  const [openInfo, setOpenInfo] = useState(false);

  return (
    <Card className={styles.card}>
      <CardHeader
        title="Таблица сделок"
        titleTypographyProps={{ paragraph: true }}
        action={
          <IconButton
            onClick={() => {
              setOpenInfo((prev) => !prev);
            }}
          >
            <Iconify icon="solar:info-circle-linear" color="text.disabled" />
          </IconButton>
        }
      />
      <Collapse in={openInfo} timeout="auto" unmountOnExit>
        <Typography
          color="text.secondary"
          className={styles.collapse}
          paragraph
        >
          Здесь вы можете просмотреть историю своих сделок и проанализировать
          их, взаимодействуя с ними или добавляя дополнительную информацию. Для
          открытия свечного графика по определённому тикеру нажмите на название
          нужного тикера. Чтобы горизонтально перемещаться по таблице можно
          использовать нижний скролл или зажать клавишу{" "}
          <span className={styles.span}>Shift</span> и использовать колёсико
          мыши.
        </Typography>
      </Collapse>
      {children}
    </Card>
  );
}

function DealActions({ apiRef, hidden }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Backdrop open={open} />
      <SpeedDial
        open={open}
        hidden={hidden}
        ariaLabel="SpeedDial"
        icon={
          <SpeedDialIcon
            openIcon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="img"
                width="24"
                height="24"
              >
                <path
                  fill="currentColor"
                  d="M2 17.5A4.5 4.5 0 0 1 6.5 13h2.7c.63 0 .945 0 1.186.123c.211.107.384.28.491.491c.123.24.123.556.123 1.186v2.7a4.5 4.5 0 1 1-9 0m11-11a4.5 4.5 0 1 1 4.5 4.5h-3.214c-.15 0-.224 0-.287-.007a1.125 1.125 0 0 1-.992-.992C13 9.938 13 9.864 13 9.714z"
                ></path>
                <path
                  fill="currentColor"
                  d="M2 6.5a4.5 4.5 0 0 1 9 0v3c0 .349 0 .523-.038.666a1.125 1.125 0 0 1-.796.796C10.023 11 9.85 11 9.5 11h-3A4.5 4.5 0 0 1 2 6.5m11 8c0-.349 0-.523.038-.666c.104-.388.408-.692.796-.796c.143-.038.317-.038.666-.038h3a4.5 4.5 0 1 1-4.5 4.5z"
                  opacity=".5"
                ></path>
              </svg>
            }
          />
        }
        onClose={() => {
          setOpen(false);
        }}
        onOpen={() => {
          setOpen(true);
        }}
        FabProps={{
          className: styles.fab,
        }}
        className={styles.dial}
      >
        <SpeedDialAction
          icon={
            <Iconify icon="solar:trash-bin-trash-bold" color="error.main" />
          }
          tooltipTitle="Удалить"
          tooltipOpen
          onClick={() => {
            setOpen(false);
            const ids = [];
            apiRef.current.getSelectedRows().forEach(({ id }) => {
              ids.push(id);
              apiRef.current.updateRows([{ id, _action: "delete" }]);
            });
            // deleteTrades(ids);
          }}
          sx={{
            "& .MuiSpeedDialAction-staticTooltipLabel": {
              color: "text.primary",
            },
          }}
        />
        <SpeedDialAction
          icon={
            <Iconify icon="solar:share-circle-bold-duotone" color="info.main" />
          }
          tooltipTitle="Объединить"
          tooltipOpen
          onClick={() => {
            setOpen(false);
          }}
          sx={{
            "& .MuiSpeedDialAction-staticTooltipLabel": {
              color: "text.primary",
            },
          }}
        />
        <SpeedDialAction
          icon={<Iconify icon="solar:star-bold-duotone" color="warning.main" />}
          tooltipTitle="Архивировать"
          tooltipOpen
          onClick={() => {
            setOpen(false);
            apiRef.current.getSelectedRows().forEach(({ id }) => {
              apiRef.current.updateRows([{ id, _action: "delete" }]);
            });
          }}
          sx={{
            "& .MuiSpeedDialAction-staticTooltipLabel": {
              color: "text.primary",
            },
          }}
        />
      </SpeedDial>
    </>
  );
}
