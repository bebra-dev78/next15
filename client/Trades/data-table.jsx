"use client";

import Autocomplete, { autocompleteClasses } from "@mui/material/Autocomplete";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import CircularProgress from "@mui/material/CircularProgress";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import MuiPagination from "@mui/material/Pagination";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { ruRU } from "@mui/x-data-grid/locales";
import MenuItem from "@mui/material/MenuItem";
import Popover from "@mui/material/Popover";
import Divider from "@mui/material/Divider";
import Dialog from "@mui/material/Dialog";
import Slider from "@mui/material/Slider";
import Popper from "@mui/material/Popper";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import Paper from "@mui/material/Paper";
import Grow from "@mui/material/Grow";
import Box from "@mui/material/Box";
import {
  DataGrid,
  GridPagination,
  GridToolbarExport,
  GridToolbarContainer,
  GridColumnMenuSortItem,
  GridColumnMenuHideItem,
  GridToolbarFilterButton,
  GridColumnMenuContainer,
  GridToolbarColumnsButton,
  GridColumnMenuManageItem,
  GridColumnMenuFilterItem,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid";

import { useState, useEffect, useRef } from "react";
import { DateTime } from "luxon";
import Image from "next/image";

import { useUser, useKeys } from "#/app/my/layout";
import useFormat from "#/utils/format-thousands";
import Iconify from "#/components/iconify";

import styles from "./data-table.module.css";

function DisableVirtualizationPopover() {
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <>
      <IconButton
        onMouseEnter={(e) => {
          setAnchorEl(e.currentTarget);
        }}
        onMouseLeave={() => {
          setAnchorEl(null);
        }}
      >
        <Iconify
          icon="solar:question-circle-linear"
          color="text.secondary"
          width={20}
        />
      </IconButton>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        disableRestoreFocus
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        className={styles.popover}
        onClose={() => {
          setAnchorEl(null);
        }}
      >
        <div className={styles.text}>
          <Typography variant="subtitle1" paragraph>
            Режим виртуализации
          </Typography>
          <Typography color="text.secondary">
            При включении этого режима высота таблицы будет автоматически
            подстраиваться под общее количество сделок на странице. Этот
            параметр почти полностью отключает <b>виртуализацию</b>, в
            результате чего незначительно снижается оптимизация таблицы.
          </Typography>
        </div>
      </Popover>
    </>
  );
}

function HeightPopover() {
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <>
      <IconButton
        onMouseEnter={(e) => {
          setAnchorEl(e.currentTarget);
        }}
        onMouseLeave={() => {
          setAnchorEl(null);
        }}
      >
        <Iconify
          icon="solar:question-circle-linear"
          color="text.secondary"
          width={20}
        />
      </IconButton>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        disableRestoreFocus
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        className={styles.popover}
        onClose={() => {
          setAnchorEl(null);
        }}
      >
        <div className={styles.text}>
          <Typography variant="subtitle1" paragraph>
            Режим фиксированной высоты
          </Typography>
          <Typography color="text.secondary">
            При включении этого режима высота таблицы всегда будет равна
            выбранному <b>количеству пикселей</b>, вне зависимости от общего
            количества сделок на странице.
          </Typography>
        </div>
      </Popover>
    </>
  );
}

function GridToolbarTag() {
  const [anchorEl, setAnchorEl] = useState(null);

  const popperRef = useRef(null);
  const tagRef = useRef(null);

  const open = Boolean(anchorEl);

  return (
    <ClickAwayListener
      mouseEvent="onMouseDown"
      touchEvent="onTouchStart"
      onClickAway={() => {
        setAnchorEl(null);
      }}
    >
      <div>
        <Button
          variant="text"
          color="info"
          size="small"
          onClick={(event) => {
            setAnchorEl(open ? null : event.currentTarget);
          }}
        >
          <Iconify
            icon="solar:add-square-outline"
            width={20}
            sx={{ marginRight: 1 }}
          />
          Добавить причину
        </Button>
        <Popper
          open={open}
          anchorEl={anchorEl}
          ref={popperRef}
          transition
          placement="bottom-start"
          className={styles.popper}
          modifiers={[
            {
              name: "offset",
              options: {
                offset: [0, 8],
              },
            },
          ]}
        >
          {({ TransitionProps }) => (
            <Grow
              {...TransitionProps}
              timeout={200}
              style={{
                transformOrigin: "top left",
              }}
            >
              <Paper className={styles.paper}>
                <>
                  <TextField
                    label="Причина"
                    variant="outlined"
                    color="secondary"
                    size="medium"
                    fullWidth
                    autoFocus
                    inputRef={tagRef}
                    className={styles.tag}
                  />
                  <Button
                    variant="contained"
                    color="inherit"
                    size="medium"
                    fullWidth
                    className={styles.tag}
                    onClick={() => {
                      if (!/[a-zA-Zа-яА-Я]/.test(tagRef.current.value)) {
                        return;
                      }
                      setAnchorEl(null);
                      localStorage.setItem(
                        "tags",
                        JSON.stringify([
                          ...(JSON.parse(localStorage.getItem("tags")) ?? []),
                          tagRef.current.value,
                        ])
                      );
                    }}
                  >
                    Добавить
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="medium"
                    fullWidth
                    onClick={() => {
                      setAnchorEl(null);
                      localStorage.setItem("tags", JSON.stringify([]));
                    }}
                  >
                    Очистить всё
                  </Button>
                </>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </ClickAwayListener>
  );
}

function GridToolbarSettings({
  height,
  setHeight,
  disableVirtualization,
  setDisableVirtualization,
}) {
  const [virtualization, setVirtualization] = useState(disableVirtualization);
  const [selectHeight, setSelectHeight] = useState(height);
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="text"
        color="info"
        size="small"
        onClick={() => setOpen((prev) => !prev)}
      >
        <Iconify
          icon="solar:settings-minimalistic-bold-duotone"
          sx={{ marginRight: 1 }}
        />
        Настройки
      </Button>
      <Dialog open={open} fullWidth onClose={() => setOpen(false)}>
        <DialogTitle>Настройки таблицы</DialogTitle>
        <DialogContent>
          <DisableVirtualizationPopover />
          <Typography variant="body2" className={styles.body2}>
            Виртуализация:
          </Typography>
          <Switch
            checked={!virtualization}
            onChange={(e) => {
              setVirtualization(!e.target.checked);
              localStorage.setItem("disableVirtualization", !e.target.checked);
            }}
          />
          <HeightPopover />
          <Typography variant="body2" className={styles.body2}>
            Высота:
          </Typography>
          <Slider
            defaultValue={selectHeight}
            valueLabelDisplay="auto"
            color="error"
            size="small"
            step={100}
            max={2000}
            min={300}
            className={styles.slider}
            onChange={(e, v) => {
              setSelectHeight(v);
              localStorage.setItem("height", v);
            }}
            marks={[
              {
                value: height,
                label: height,
              },
              {
                value: 2000,
                label: 2000,
              },
            ]}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="text"
            color="warning"
            size="small"
            onClick={() => {
              setHeight(selectHeight);
              setDisableVirtualization(virtualization);
            }}
          >
            <Iconify icon="line-md:backup-restore" sx={{ marginRight: 1 }} />
            Обновить таблицу
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default function DataTable({ setActivate, setHidden, apiRef }) {
  const { user } = useUser();
  const { keys } = useKeys();

  const [disableVirtualization, setDisableVirtualization] = useState(
    JSON.parse(localStorage.getItem("disableVirtualization")) ?? true
  );
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: JSON.parse(localStorage.getItem("pageSize")) ?? 25,
  });
  const [height, setHeight] = useState(
    JSON.parse(localStorage.getItem("height")) ?? 800
  );
  const [pagesCount, setPagesCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [onLoad, setOnLoad] = useState(false);
  const [total, setTotal] = useState(0);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    setLoading(true);
    fetch(
      `${
        process.env.NEXT_PUBLIC_BACKEND_URL
      }/resourses/trades?section=table&page=${
        paginationModel.page + 1
      }&pageSize=${paginationModel.pageSize}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-TRADIFY-UID": user.id,
        },
      }
    )
      .then((res) => res.json())
      .then((res) => {
        setRows(
          res.data.map((trade) => ({
            id: trade.id,
            kid: trade.kid,
            side: trade.side,
            symbol: trade.symbol,
            rating: trade.rating,
            income: trade.income,
            profit: trade.profit,
            deposit: trade.deposit,
            procent: trade.procent,
            exchange: trade.exchange,
            duration: trade.duration,
            turnover: trade.turnover,
            volume: trade.volume / 2,
            maxVolume: trade.max_volume,
            tags: JSON.parse(trade.tags),
            commission: trade.commission,
            deals: JSON.parse(trade.deals),
            exitTime: parseInt(trade.exit_time),
            entryTime: parseInt(trade.entry_time),
            averageExitPrice: trade.avg_exit_price,
            averageEntryPrice: trade.avg_entry_price,
            apikey: keys.find((key) => key.id === trade.kid)?.title,
          }))
        );
        setLoading(false);
        setTotal(res.total);
        setPagesCount(res.last_page);
        setOnLoad(true);
      });
  }, [paginationModel]);

  const columns = [
    {
      field: "symbol",
      headerName: "Тикер",
      width: 150,
      renderCell: ({ value, row }) => (
        <MenuItem
          className={styles.menuitem}
          onClick={() => {
            window.scrollTo(0, 0);
            setActivate({
              deals: row.deals,
              symbol: row.symbol,
              procent: row.procent,
              exchange: row.exchange,
              entryTime: row.entryTime,
            });
          }}
        >
          {value}
        </MenuItem>
      ),
    },
    {
      field: "tags",
      headerName: "Причины входа",
      width: 350,
      renderCell: ({ value, row }) => (
        <Autocomplete
          multiple
          fullWidth
          noOptionsText="Нет данных"
          value={value ?? []}
          options={JSON.parse(localStorage.getItem("tags")) ?? []}
          onChange={(e, n) => {
            apiRef.current.updateRows([{ id: row.id, tags: n }]);
            fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/interface/trades?section=tags&id=${row.id}`,
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
          renderOption={(props, option, state, ownerState) => (
            <Box
              component="li"
              sx={{
                borderRadius: "8px",
                marginTop: "6px",
                [`&.${autocompleteClasses.option}`]: {
                  padding: "8px",
                },
              }}
              {...props}
            >
              {ownerState.getOptionLabel(option)}
            </Box>
          )}
          ChipProps={{ variant: "soft", color: "info", size: "medium" }}
          popupIcon={<Iconify icon="solar:alt-arrow-down-bold-duotone" />}
          renderInput={(params) => (
            <TextField {...params} variant="standard" color="secondary" />
          )}
        />
      ),
    },
    {
      field: "rating",
      headerName: "Оценка",
      width: 150,
      renderCell: ({ value, row }) => (
        <Rating
          value={value}
          icon={<StarRoundedIcon color="warning" />}
          emptyIcon={<StarRoundedIcon color="text.secondary" />}
          onChange={(e, n) => {
            apiRef.current.updateRows([{ id: row.id, rating: n }]);
            fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/interface/trades?section=rating&id=${row.id}&value=${n}`,
              {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                  "X-TRADIFY-UID": user.id,
                },
              }
            );
          }}
        />
      ),
    },
    {
      field: "entryTime",
      headerName: "Время входа",
      width: 140,
      renderCell: ({ value }) => (
        <div className={styles.stack}>
          {DateTime.fromMillis(value).toLocaleString({
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
          <Typography variant="caption" color="text.secondary">
            {DateTime.fromMillis(value).toLocaleString({
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
            })}
          </Typography>
        </div>
      ),
    },
    {
      field: "exitTime",
      headerName: "Время выхода",
      width: 140,
      renderCell: ({ value }) => (
        <div className={styles.stack}>
          {DateTime.fromMillis(value).toLocaleString({
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
          <Typography variant="caption" color="text.secondary">
            {DateTime.fromMillis(value).toLocaleString({
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
            })}
          </Typography>
        </div>
      ),
    },
    {
      field: "side",
      headerName: "Сторона",
      description: "Направление сделки",
      renderCell: ({ value }) =>
        value === "BUY" ? (
          <Typography variant="subtitle1" color="info.main">
            LONG
          </Typography>
        ) : (
          <Typography variant="subtitle1" color="warning.main">
            SHORT
          </Typography>
        ),
    },
    {
      type: "number",
      field: "leverage",
      headerName: "Плечо",
      headerAlign: "center",
      valueGetter: (v, row) => row.volume / row.deposit,
      renderCell: ({ value }) => (
        <Typography
          variant="caption"
          color="text.secondary"
          className={styles.leverage}
        >
          x{value.toFixed(2)}
        </Typography>
      ),
    },
    {
      field: "averageEntryPrice",
      headerName: "Цена входа",
      description: "Средняя цена входа",
      width: 120,
      valueGetter: (value, row) =>
        row.side === "BUY" ? value : row.averageExitPrice,
      valueFormatter: (value) => `$${value}`,
      renderCell: ({ value }) => (
        <Typography variant="subtitle2">{value}</Typography>
      ),
    },
    {
      field: "averageExitPrice",
      headerName: "Цена выхода",
      description: "Средняя цена выхода",
      width: 130,
      valueGetter: (value, row) =>
        row.side === "BUY" ? value : row.averageEntryPrice,
      valueFormatter: (value) => `$${value}`,
      renderCell: ({ value }) => (
        <Typography variant="subtitle2">{value}</Typography>
      ),
    },
    {
      field: "duration",
      headerName: "Длительность",
      width: 200,
      valueFormatter: (value) => {
        const hours = Math.floor(value / 1000 / 3600);
        const minutes = Math.floor((value / 1000 / 60) % 60);
        const seconds = Math.floor((value / 1000) % 60);
        return `${hours > 0 ? `${hours} час. ` : ""}${
          minutes > 0 ? `${minutes} мин. ` : ""
        }${seconds > 0 ? `${seconds} сек. ` : `${value % 1000} мс. `}`.trim();
      },
    },
    {
      type: "number",
      field: "procent",
      headerName: "Процент",
      renderCell: ({ value }) =>
        value >= 0 ? (
          <span className={styles.span + " " + styles.green}>{value}%</span>
        ) : (
          <span className={styles.span + " " + styles.red}>{value}%</span>
        ),
    },
    {
      type: "number",
      field: "income",
      headerName: "Доход",
      width: 150,
      valueFormatter: (value) => `${useFormat(value)}$`,
    },
    {
      type: "number",
      field: "profit",
      headerName: "Прибыль ($)",
      width: 150,
      valueFormatter: (value) => `${useFormat(value)}$`,
    },
    {
      type: "number",
      field: "procentProfit",
      headerName: "Прибыль (%)",
      width: 130,
      valueGetter: (v, row) => (row.profit / row.deposit) * 100,
      valueFormatter: (value) => `${useFormat(value.toFixed(3))}%`,
    },
    {
      type: "number",
      field: "turnover",
      headerName: "Оборот",
      width: 150,
      renderCell: ({ value }) => (
        <Typography variant="subtitle2">{useFormat(value)}</Typography>
      ),
    },
    {
      type: "number",
      field: "maxVolume",
      headerName: "Макс. объём",
      width: 150,
      renderCell: ({ value }) => (
        <Typography variant="subtitle2">${useFormat(value)}</Typography>
      ),
    },
    {
      type: "number",
      field: "deposit",
      headerName: "Депозит",
      description: "Сумма собственных средств при открытии сделки",
      width: 130,
      valueFormatter: (value) => `$${value}`,
    },
    {
      type: "number",
      field: "volume",
      headerName: "Объём",
      width: 150,
      valueFormatter: (value) => `$${useFormat(value.toFixed(2))}`,
    },
    {
      type: "number",
      field: "commission",
      headerName: "Комиссия",
      width: 150,
      valueFormatter: (value) => `$${value}`,
    },
    {
      field: "apikey",
      headerAlign: "right",
      headerName: "API-ключ",
      width: 150,
      renderCell: ({ value }) => (
        <Typography
          variant="subtitle2"
          color="text.disabled"
          className={styles.key}
        >
          {value}
        </Typography>
      ),
    },
  ];

  const slotProps = {
    toolbar: {
      height,
      setHeight,
      disableVirtualization,
      setDisableVirtualization,
    },
    pagination: {
      pagesCount,
    },
  };

  const initialState = {
    pagination: {
      paginationModel,
    },
    sorting: {
      sortModel: [{ field: "entryTime", sort: "desc" }],
    },
  };

  const onRowSelectionModelChange =
    ((n) => setHidden(n.length > 0 ? false : true), []);

  const onPaginationModelChange = ({ page, pageSize }) => {
    setPaginationModel({ page, pageSize });
    localStorage.setItem("pageSize", pageSize);
  };

  return (
    <div style={{ height }}>
      <DataGrid
        pagination
        checkboxSelection
        disableRowSelectionOnClick
        keepNonExistentRowsSelected
        localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
        onRowSelectionModelChange={onRowSelectionModelChange}
        onPaginationModelChange={onPaginationModelChange}
        disableVirtualization={disableVirtualization}
        pageSizeOptions={pageSizeOptions}
        getRowHeight={getRowHeight}
        initialState={initialState}
        paginationMode="server"
        slotProps={slotProps}
        columns={columns}
        loading={loading}
        rowCount={total}
        apiRef={apiRef}
        slots={slots}
        rows={rows}
        sx={sx}
      />
    </div>
  );
}

const getRowHeight = () => "auto";

const slots = {
  loadingOverlay: () => {
    return (
      <div className={styles.box}>
        <CircularProgress color="error" disableShrink />
      </div>
    );
  },
  noRowsOverlay: () => {
    return (
      <div className={styles.box}>
        <Image
          src="/svg/illustration_empty_content.svg"
          width={320}
          height={240}
          alt="loading"
          style={{ marginBottom: "25px" }}
        />
        <Typography variant="h4" gutterBottom>
          Нет сделок
        </Typography>
      </div>
    );
  },
  columnMenu: ({ hideMenu, colDef }) => {
    return (
      <GridColumnMenuContainer hideMenu={hideMenu} colDef={colDef}>
        <GridColumnMenuSortItem onClick={hideMenu} colDef={colDef} />
        <Divider />
        <GridColumnMenuFilterItem onClick={hideMenu} colDef={colDef} />
        <Divider />
        <GridColumnMenuHideItem onClick={hideMenu} colDef={colDef} />
        <GridColumnMenuManageItem onClick={hideMenu} colDef={colDef} />
      </GridColumnMenuContainer>
    );
  },
  pagination: ({ pagesCount, ...props }) => {
    return (
      <GridPagination
        ActionsComponent={({ page, onPageChange, className }) => (
          <MuiPagination
            color="error"
            className={className}
            count={pagesCount}
            page={page + 1}
            onChange={(event, newPage) => {
              onPageChange(event, newPage - 1);
            }}
          />
        )}
        {...props}
      />
    );
  },
  toolbar: ({
    height,
    setHeight,
    disableVirtualization,
    setDisableVirtualization,
  }) => {
    return (
      <GridToolbarContainer sx={tsx}>
        <GridToolbarColumnsButton slotProps={ToolbarSlotProps} />
        <GridToolbarFilterButton slotProps={ToolbarSlotProps} />
        <GridToolbarDensitySelector slotProps={ToolbarSlotProps} />
        <GridToolbarExport slotProps={ToolbarSlotProps} />
        <GridToolbarTag />
        <GridToolbarSettings
          height={height}
          setHeight={setHeight}
          disableVirtualization={disableVirtualization}
          setDisableVirtualization={setDisableVirtualization}
        />
      </GridToolbarContainer>
    );
  },
};

const pageSizeOptions = [10, 25, 50, 100];

const ToolbarSlotProps = { button: { color: "info" } };

const sx = {
  border: "none",
  "--DataGrid-overlayHeight": "600px",
  "--unstable_DataGrid-radius": "0px",
  "--DataGrid-rowBorderColor": "transparent",
  "--DataGrid-containerBackground": (theme) =>
    theme.palette.mode === "dark" ? "#2F3944" : "#F4F6F8",
  "&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell": {
    alignItems: "center",
    display: "flex",
    py: "5px",
  },
  "&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell": {
    alignItems: "center",
    display: "flex",
    py: "10px",
  },
  "&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell": {
    alignItems: "center",
    display: "flex",
    py: "15px",
  },
  "& .MuiDataGrid-columnHeaderTitle": {
    color: "text.secondary",
  },
  "&.MuiDataGrid-columnsContainer, .MuiDataGrid-cell": {
    borderBottom: (theme) =>
      theme.palette.mode === "dark"
        ? "1px dashed rgba(145, 158, 171, 0.24)"
        : "1px dashed rgba(145, 158, 171, 0.5)",
  },
  "& .MuiDataGrid-withBorderColor": {
    borderColor: "transparent",
  },
};

const tsx = {
  padding: "14px",
  borderColor: (theme) =>
    theme.palette.mode === "dark" ? "rgb(46, 50, 54)" : "rgb(241, 243, 244)",
  backgroundColor: (theme) =>
    theme.palette.mode === "dark"
      ? "rgba(145, 158, 171, 0.12)"
      : "rgb(244, 246, 248)",
  borderBottom: (theme) =>
    theme.palette.mode === "dark"
      ? "1px dashed rgba(145, 158, 171, 0.24)"
      : "1px dashed rgba(145, 158, 171, 0.5)",
};
