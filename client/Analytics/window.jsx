"use client";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import DialogContentText from "@mui/material/DialogContentText";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Popover from "@mui/material/Popover";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import { Responsive, WidthProvider } from "react-grid-layout";
import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { DateTime } from "luxon";

import CounterBox from "#/components/counter-box";
import Iconify from "#/components/iconify";
import { useUser } from "#/app/my/layout";

import styles from "./window.module.css";

const DistributionBySide = dynamic(() => import("./widgets/1/widget"));
const DistributionByCoin = dynamic(() => import("./widgets/2/widget"));
const CoinVolume = dynamic(() => import("./widgets/3/widget"));

const ResponsiveGridLayout = WidthProvider(Responsive);

function DeleteButton({ value, panels, setValue, setPanels, panelsDataRef }) {
  const [confirmation, setConfirmation] = useState(false);

  return (
    <>
      <Button
        variant="text"
        color="error"
        className={styles.button}
        startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
        disabled={Object.keys(panels).length === 0 || value === ""}
        onClick={() => setConfirmation(true)}
      >
        Удалить панель
      </Button>
      <Dialog open={confirmation} onClose={() => setConfirmation(false)}>
        <Typography variant="h6" className={styles.conf_title}>
          Подтвердите действие
        </Typography>
        <DialogContent>
          <DialogContentText>
            Вы уверены, что хотите удалить панель «{value}»?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="inherit"
            size="medium"
            onClick={() => setConfirmation(false)}
          >
            Отмена
          </Button>
          <Button
            variant="contained"
            color="error"
            size="medium"
            autoFocus
            onClick={() => {
              setConfirmation(false);
              const { [value]: omit, ...newPanels } = panels;
              setPanels(newPanels);
              const did = panelsDataRef.current.find(
                (c) => c.title === value
              ).id;
              fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/interface/panels?id=${did}`,
                {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                    "X-TRADIFY-UID": user.id,
                  },
                }
              );
              panelsDataRef.current = panelsDataRef.current.filter(
                (b) => b !== did
              );
              const { [value]: omitWidgetParams, ...newWidgetParams } =
                widgetsParamsRef.current;
              widgetsParamsRef.current = newWidgetParams;
              value =
                Object.keys(panels).length === 1
                  ? ""
                  : Object.keys(newPanels)[0];
              setValue(value);
              localStorage.setItem(
                "widgetsParams",
                JSON.stringify(newWidgetParams)
              );
            }}
          >
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function CreateButton({ panels, setValue, setPanels, panelsDataRef }) {
  const { user } = useUser();

  const [titleError, setTitleError] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);

  const titleRef = useRef("");

  function handleSubmit() {
    let titleErrorMessage = "";

    const title = titleRef.current;

    switch (true) {
      case !/[a-zA-Zа-яА-Я]/.test(title):
        titleErrorMessage = "Название не указано";
        break;
      case title.length > 26:
        titleErrorMessage = "Слишком длинное название";
        break;
      case Object.keys(panels).some((t) => t === title):
        titleErrorMessage = "Панель с таким названием уже существует";
        break;
      default:
        break;
    }

    if (titleErrorMessage) {
      setTitleError(titleErrorMessage);
      return;
    }

    setAnchorEl(null);

    setPanels((prev) => ({ ...prev, [title]: null }));
    setValue(title);
    panelsDataRef.current = [...panelsDataRef.current, title];
    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/interface/panels?title=${title}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-TRADIFY-UID": user.id,
        },
      }
    );
  }

  return (
    <>
      <Button
        color="info"
        variant="text"
        className={styles.button}
        startIcon={<Iconify icon="ic:round-plus" />}
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        Добавить панель
      </Button>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        onClose={() => setAnchorEl(null)}
        slotProps={{
          paper: {
            style: { padding: 16 },
          },
        }}
      >
        <TextField
          label="Название"
          autoFocus
          autoComplete="off"
          variant="outlined"
          color="info"
          onChange={(e) => {
            setTitleError("");
            titleRef.current = e.target.value;
          }}
          error={Boolean(titleError)}
          helperText={titleError}
        />
        <div className={styles.row}>
          <Button
            variant="outlined"
            color="inherit"
            size="medium"
            onClick={() => {
              setAnchorEl(null);
              setTitleError("");
              titleRef.current = "";
            }}
          >
            Отмена
          </Button>
          <Button
            variant="contained"
            color="inherit"
            size="medium"
            onClick={handleSubmit}
          >
            Добавить
          </Button>
        </div>
      </Popover>
    </>
  );
}

function TimeRangeSelect({
  setTimeRangeStatus,
  timeRangeStatus,
  setTimeRange,
}) {
  const [customItem, setCustomItem] = useState("Указать вручную");
  const [confirmation, setConfirmation] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const initDateRef = useRef(null);
  const endDateRef = useRef(null);

  return (
    <>
      <FormControl>
        <InputLabel>Временной диапазон</InputLabel>
        <Select
          label="Временной диапазон"
          value={timeRangeStatus}
          onChange={(e) => {
            setTimeRangeStatus(e.target.value);
            localStorage.setItem("timeRange", e.target.value);
          }}
        >
          <MenuItem value="current-day">Сегодня</MenuItem>
          <MenuItem value="current-week">Текущая неделя</MenuItem>
          <MenuItem value="current-month">Текущий месяц</MenuItem>
          <MenuItem value="last-7">Последние 7 дней</MenuItem>
          <MenuItem value="last-30">Последние 30 дней</MenuItem>
          <MenuItem value="custom" onClick={() => setConfirmation(true)}>
            {customItem}
          </MenuItem>
        </Select>
      </FormControl>
      <Dialog
        open={confirmation}
        maxWidth="xs"
        fullWidth
        onClose={() => setConfirmation(false)}
      >
        <Typography variant="h6" className={styles.h6} color="text.primary">
          Выберите диапазон дат
        </Typography>
        <DialogContent>
          <Stack gap={2} paddingTop="8px" justifyContent="center">
            <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale="ru">
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  label="Начало"
                  slots={{
                    openPickerIcon: () => (
                      <Iconify
                        icon="solar:calendar-mark-bold-duotone"
                        color="text.secondary"
                      />
                    ),
                  }}
                  slotProps={{
                    textField: { fullWidth: true, error: disabled },
                  }}
                  inputRef={initDateRef}
                  defaultValue={DateTime.now()}
                  onChange={() => setDisabled(false)}
                />
              </DemoContainer>
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale="ru">
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  label="Конец"
                  slots={{
                    openPickerIcon: () => (
                      <Iconify
                        icon="solar:calendar-mark-bold-duotone"
                        color="text.secondary"
                      />
                    ),
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      helperText: disabled
                        ? "Начало не может быть больше конца."
                        : "",
                      error: disabled,
                    },
                  }}
                  inputRef={endDateRef}
                  defaultValue={DateTime.now()}
                  onChange={() => setDisabled(false)}
                />
              </DemoContainer>
            </LocalizationProvider>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="inherit"
            size="medium"
            onClick={() => setConfirmation(false)}
          >
            Отмена
          </Button>
          <Button
            variant="contained"
            color="inherit"
            size="medium"
            autoFocus
            disabled={disabled}
            onClick={() => {
              const start = DateTime.fromFormat(
                initDateRef.current?.value,
                "dd.MM.yyyy"
              ).toMillis();
              const end = DateTime.fromFormat(
                endDateRef.current?.value,
                "dd.MM.yyyy"
              ).toMillis();
              if (start > end) {
                setDisabled(true);
              } else {
                setConfirmation(false);
                setTimeRange([start, end]);
                setCustomItem(
                  `${DateTime.fromMillis(start).toLocaleString({
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })} - ${DateTime.fromMillis(end).toLocaleString({
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}`
                );
              }
            }}
          >
            Применить
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function GridLayout({
  value,
  panels,
  setPanels,
  timeRange,
  panelsDataRef,
  timeRangeStatus,
}) {
  const { user } = useUser();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const now = Date.now();

    switch (timeRangeStatus) {
      case "current-day":
        fetch(
          `${
            process.env.NEXT_PUBLIC_BACKEND_URL
          }/resourses/trades?section=times&startTime=${DateTime.now()
            .startOf("day")
            .toMillis()}&endTime=${now}`,
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
            setData(res);
            setLoading(false);
          });
        break;
      case "current-week":
        fetch(
          `${
            process.env.NEXT_PUBLIC_BACKEND_URL
          }/resourses/trades?section=times&startTime=${DateTime.now()
            .startOf("week")
            .toMillis()}&endTime=${now}`,
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
            setData(res);
            setLoading(false);
          });
        break;
      case "current-month":
        fetch(
          `${
            process.env.NEXT_PUBLIC_BACKEND_URL
          }/resourses/trades?section=times&startTime=${DateTime.now()
            .startOf("month")
            .toMillis()}&endTime=${now}`,
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
            setData(res);
            setLoading(false);
          });
        break;
      case "last-7":
        fetch(
          `${
            process.env.NEXT_PUBLIC_BACKEND_URL
          }/resourses/trades?section=times&startTime=${
            now - 604800000
          }&endTime=${now}`,
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
            setData(res);
            setLoading(false);
          });
        break;
      case "last-30":
        fetch(
          `${
            process.env.NEXT_PUBLIC_BACKEND_URL
          }/resourses/trades?section=times&startTime=${
            now - 2592000000
          }&endTime=${now}`,
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
            setData(res);
            setLoading(false);
          });
        break;
      case "custom":
        if (timeRange.length === 0) {
          setLoading(false);
        } else {
          fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/resourses/trades?section=times&startTime=${timeRange[0]}&endTime=${timeRange[1]}`,
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
              setData(res);
              setLoading(false);
            });
        }
        break;
      default:
        setData([]);
        setLoading(false);
        break;
    }
  }, [timeRangeStatus, timeRange]);

  const widgetsParamsRef = useRef(
    JSON.parse(localStorage.getItem("widgetsParams")) ?? {}
  );

  const widgets = panels[value] ?? [];

  function handleDeleteWidget(ID) {
    const n = widgets.filter((i) => i !== ID);

    setPanels((prev) => ({
      ...prev,
      [value]: n,
    }));

    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/interface/panels?id=${
        panelsDataRef.current.find((c) => c.title === value).id
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

    delete widgetsParamsRef.current[value]?.[ID];

    localStorage.setItem(
      "widgetsParams",
      JSON.stringify(widgetsParamsRef.current)
    );
  }

  return (
    <ResponsiveGridLayout
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 16, md: 14, sm: 10, xs: 8, xxs: 6 }}
      draggableHandle=".drag-header"
      rowHeight={35}
      onResizeStop={(l, o, n) => {
        var k = n.i.split("-");
        const b = {
          ...widgetsParamsRef.current,
          [k[0]]: {
            ...widgetsParamsRef.current[k[0]],
            [k[1]]: {
              x: n.x,
              y: n.y,
              w: n.w,
              h: n.h,
            },
          },
        };
        widgetsParamsRef.current = b;
        localStorage.setItem("widgetsParams", JSON.stringify(b));
      }}
      onDragStop={(l, o, n) => {
        var k = n.i.split("-");
        const b = {
          ...widgetsParamsRef.current,
          [k[0]]: {
            ...widgetsParamsRef.current[k[0]],
            [k[1]]: {
              x: n.x,
              y: n.y,
              w: n.w,
              h: n.h,
            },
          },
        };
        widgetsParamsRef.current = b;
        localStorage.setItem("widgetsParams", JSON.stringify(b));
      }}
    >
      {widgets.map((w) => {
        var params = widgetsParamsRef?.current[value]?.[w] ?? {
          x: 0,
          y: 0,
          w: 7,
          h: 12,
        };
        switch (w) {
          case 1:
            return (
              <div
                key={`${value}-1`}
                data-grid={{
                  x: params.x,
                  y: params.y,
                  w: params.w,
                  h: params.h,
                }}
              >
                <DistributionBySide
                  data={data}
                  isLoading={loading}
                  handleDeleteWidget={handleDeleteWidget}
                />
              </div>
            );
          case 2:
            return (
              <div
                key={`${value}-2`}
                data-grid={{
                  x: params.x,
                  y: params.y,
                  w: params.w,
                  h: params.h,
                }}
              >
                <DistributionByCoin
                  data={data}
                  isLoading={loading}
                  handleDeleteWidget={handleDeleteWidget}
                />
              </div>
            );
          case 3:
            return (
              <div
                key={`${value}-3`}
                data-grid={{
                  x: params.x,
                  y: params.y,
                  w: params.w,
                  h: params.h,
                }}
              >
                <CoinVolume
                  data={data}
                  isLoading={loading}
                  handleDeleteWidget={handleDeleteWidget}
                />
              </div>
            );
          default:
            break;
        }
      })}
    </ResponsiveGridLayout>
  );
}

export default function Window({
  value,
  panels,
  setValue,
  setPanels,
  panelsDataRef,
}) {
  const [timeRange, setTimeRange] = useState([]);
  const [timeRangeStatus, setTimeRangeStatus] = useState(() => {
    const n = localStorage.getItem("timeRange") ?? "current-week";
    return n === "custom" ? "current-week" : n;
  });

  return (
    <>
      <div className={styles.stack}>
        <div className={styles.flex}>
          <DeleteButton
            value={value}
            panels={panels}
            setValue={setValue}
            setPanels={setPanels}
            panelsDataRef={panelsDataRef}
          />
          <CreateButton
            value={value}
            panels={panels}
            setValue={setValue}
            setPanels={setPanels}
            panelsDataRef={panelsDataRef}
          />
        </div>
        <TimeRangeSelect
          setTimeRange={setTimeRange}
          timeRangeStatus={timeRangeStatus}
          setTimeRangeStatus={setTimeRangeStatus}
        />
      </div>
      <Tabs value={value} onChange={(e, n) => setValue(n)}>
        {Object.keys(panels).map((title) => (
          <Tab
            key={title}
            label={title}
            value={title}
            iconPosition="end"
            disableTouchRipple
            icon={
              <CounterBox
                variant="info"
                count={panels[title]?.length ?? 0}
                style={{ marginLeft: 8 }}
              />
            }
          />
        ))}
      </Tabs>
      <GridLayout
        value={value}
        panels={panels}
        setPanels={setPanels}
        timeRange={timeRange}
        panelsDataRef={panelsDataRef}
        timeRangeStatus={timeRangeStatus}
      />
    </>
  );
}
