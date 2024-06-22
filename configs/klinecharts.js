import ClickAwayListener from "@mui/material/ClickAwayListener";
import ListItemButton from "@mui/material/ListItemButton";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import Switch from "@mui/material/Switch";
import Select from "@mui/material/Select";
import Popper from "@mui/material/Popper";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Grow from "@mui/material/Grow";
import Menu from "@mui/material/Menu";

import SimpleBar from "simplebar-react";
import { useState } from "react";
import {
  registerLocale,
  registerOverlay,
  registerIndicator,
} from "klinecharts";

import Iconify from "#/components/iconify";

registerLocale("ru", {
  time: "Время：",
  open: "Open: ",
  high: "High: ",
  low: "Low: ",
  close: "Close: ",
  volume: "Объём: ",
  turnover: "Оборот: ",
});

registerOverlay({
  name: "lineup",
  needDefaultPointFigure: true,
  needDefaultXAxisFigure: true,
  needDefaultYAxisFigure: true,
  totalStep: 3,
  createPointFigures: ({ coordinates, overlay }) => {
    if (coordinates.length === 2) {
      var x1 = Math.min(coordinates[0].x, coordinates[1].x);
      var y1 = Math.min(coordinates[0].y, coordinates[1].y);
      var x2 = Math.max(coordinates[0].x, coordinates[1].x);
      var y2 = Math.max(coordinates[0].y, coordinates[1].y);

      var verticalDown = coordinates[1].y > coordinates[0].y;
      var horizontalLeft = coordinates[1].x < coordinates[0].x;

      var centerX = (x1 + x2) / 2;
      var centerY = (y1 + y2) / 2;

      var currentColor = verticalDown
        ? "rgb(249, 40, 85)"
        : "rgb(22, 119, 255)";

      var styles = {
        color: currentColor,
      };

      return [
        {
          key: "lineup",
          type: "rect",
          attrs: {
            x: Math.min(x1, x2),
            y: Math.min(y1, y2),
            width: Math.abs(x2 - x1),
            height: Math.abs(y2 - y1),
          },
          styles: {
            color: verticalDown
              ? "rgba(249, 40, 85, .25)"
              : "rgba(22, 119, 255, .25)",
          },
        },
        {
          type: "line",
          attrs: {
            coordinates: [
              { x: x1, y: centerY },
              { x: x2, y: centerY },
            ],
          },
          styles,
        },
        {
          type: "line",
          attrs: {
            coordinates: [
              { x: horizontalLeft ? x1 + 10 : x2 - 10, y: centerY + 5 },
              { x: horizontalLeft ? x1 : x2, y: centerY },
            ],
          },
          styles,
        },
        {
          type: "line",
          attrs: {
            coordinates: [
              { x: horizontalLeft ? x1 + 10 : x2 - 10, y: centerY - 5 },
              { x: horizontalLeft ? x1 : x2, y: centerY },
            ],
          },
          styles,
        },
        {
          type: "line",
          attrs: {
            coordinates: [
              { x: centerX, y: y1 },
              { x: centerX, y: y2 },
            ],
          },
          styles,
        },
        {
          type: "line",
          attrs: {
            coordinates: [
              { x: centerX + 5, y: verticalDown ? y2 - 10 : y1 + 10 },
              { x: centerX, y: verticalDown ? y2 : y1 },
            ],
          },
          styles,
        },
        {
          type: "line",
          attrs: {
            coordinates: [
              { x: centerX - 5, y: verticalDown ? y2 - 10 : y1 + 10 },
              { x: centerX, y: verticalDown ? y2 : y1 },
            ],
          },
          styles,
        },
        {
          type: "text",
          attrs: {
            x: x1,
            y: y2 + 10,
            text: `${(
              overlay.points[1].value - overlay.points[0].value
            ).toFixed(4)}$ || ${(
              ((overlay.points[1].value - overlay.points[0].value) /
                overlay.points[0].value) *
              100
            ).toFixed(2)}%`,
          },
          styles: {
            style: "stroke_fill",
            family: "inherit",
            borderColor: currentColor,
            backgroundColor: currentColor,
          },
        },
      ];
    }
    return [];
  },
});

registerOverlay({
  name: "sampleEightWaves",
  needDefaultPointFigure: true,
  needDefaultXAxisFigure: true,
  needDefaultYAxisFigure: true,
  totalStep: 10,
  createPointFigures: ({ coordinates }) => {
    if (coordinates.length <= 10) {
      return {
        key: "sampleEightWaves",
        type: "line",
        attrs: {
          coordinates,
        },
        styles: {
          style: "dashed",
        },
      };
    }

    return [];
  },
});

registerOverlay({
  name: "sampleFiveWaves",
  needDefaultPointFigure: true,
  needDefaultXAxisFigure: true,
  needDefaultYAxisFigure: true,
  totalStep: 7,
  createPointFigures: ({ coordinates }) => {
    if (coordinates.length <= 7) {
      return {
        key: "sampleFiveWaves",
        type: "line",
        attrs: {
          coordinates,
        },
        styles: {
          style: "dashed",
        },
      };
    }

    return [];
  },
});

registerOverlay({
  name: "sampleThreeWaves",
  needDefaultPointFigure: true,
  needDefaultXAxisFigure: true,
  needDefaultYAxisFigure: true,
  totalStep: 5,
  createPointFigures: ({ coordinates }) => {
    if (coordinates.length <= 5) {
      return {
        key: "sampleThreeWaves",
        type: "line",
        attrs: {
          coordinates,
        },
        styles: {
          style: "dashed",
        },
      };
    }

    return [];
  },
});

registerOverlay({
  name: "sampleParallelogram",
  needDefaultPointFigure: true,
  needDefaultXAxisFigure: true,
  needDefaultYAxisFigure: true,
  totalStep: 5,
  createPointFigures: ({ coordinates }) => {
    if (coordinates.length === 2) {
      return {
        key: "sampleParallelogram",
        type: "line",
        attrs: {
          coordinates,
        },
      };
    }

    if (coordinates.length === 3 || coordinates.length === 4) {
      return {
        key: "sampleParallelogram",
        type: "polygon",
        attrs: {
          coordinates,
        },
        styles: {
          style: "stroke_fill",
        },
      };
    }

    return [];
  },
});

registerOverlay({
  name: "sampleTriangle",
  needDefaultPointFigure: true,
  needDefaultXAxisFigure: true,
  needDefaultYAxisFigure: true,
  totalStep: 4,
  createPointFigures: ({ coordinates }) => {
    if (coordinates.length === 2) {
      return {
        key: "sampleTriangle",
        type: "line",
        attrs: {
          coordinates,
        },
      };
    }

    if (coordinates.length === 3) {
      return {
        key: "sampleTriangle",
        type: "polygon",
        attrs: {
          coordinates,
        },
        // styles: {
        //   style: "stroke_fill",
        // },
      };
    }
    return [];
  },
});

registerOverlay({
  name: "sampleRect",
  needDefaultPointFigure: true,
  needDefaultXAxisFigure: true,
  needDefaultYAxisFigure: true,
  totalStep: 3,
  createPointFigures: ({ coordinates }) => {
    if (coordinates.length === 2) {
      const x1 = Math.min(coordinates[0].x, coordinates[1].x);
      const y1 = Math.min(coordinates[0].y, coordinates[1].y);
      const x2 = Math.max(coordinates[0].x, coordinates[1].x);
      const y2 = Math.max(coordinates[0].y, coordinates[1].y);
      return {
        key: "sampleRect",
        type: "rect",
        attrs: {
          x: Math.min(x1, x2),
          y: Math.min(y1, y2),
          width: Math.abs(x2 - x1),
          height: Math.abs(y2 - y1),
        },
        styles: {
          style: "stroke_fill",
        },
      };
    }
    return [];
  },
});

registerOverlay({
  name: "sampleCircle",
  needDefaultPointFigure: true,
  needDefaultXAxisFigure: true,
  needDefaultYAxisFigure: true,
  totalStep: 3,
  createPointFigures: ({ coordinates }) => {
    if (coordinates.length === 2) {
      const xDis = Math.abs(coordinates[0].x - coordinates[1].x);
      const yDis = Math.abs(coordinates[0].y - coordinates[1].y);
      return {
        key: "sampleCircle",
        type: "circle",
        attrs: {
          ...coordinates[0],
          r: Math.sqrt(xDis * xDis + yDis * yDis),
        },
        styles: {
          style: "stroke_fill",
        },
      };
    }
    return [];
  },
});

const mainDataStartTimestaps = {
  "1m": 600000,
  "3m": 1800000,
  "5m": 3000000,
  "30m": 18000000,
  "1h": 38100000,
  "2h": 77700000,
  "6h": 228900000,
  "1d": 941700000,
  "3d": 2842500000,
  "1w": 6644100000,
  "1M": 27898500000,
};

const mainDataEndTimestaps = {
  "1m": 5400000,
  "3m": 16200000,
  "5m": 27000000,
  "30m": 162000000,
  "1h": 321900000,
  "2h": 642300000,
  "6h": 1931100000,
  "1d": 7698300000,
  "3d": 23077500000,
  "1w": 53835900000,
  "1M": 239941500000,
};

const subDataStartTimestaps = {
  "1m": 6600000,
  "3m": 19740000,
  "5m": 33000000,
  "30m": 196500000,
  "1h": 398100000,
  "2h": 797700000,
  "6h": 2388900000,
  "1d": 9581700000,
  "3d": 28503300000,
  "1w": 63149700000,
  "1M": 270941700000,
};

const subDataEndTimestaps = {
  "1m": 600001,
  "3m": 1740001,
  "5m": 3000001,
  "30m": 16500001,
  "1h": 38100001,
  "2h": 77700001,
  "6h": 228900001,
  "1d": 941700001,
  "3d": 2583300001,
  "1w": 2669700001,
  "1M": 3101700001,
};

const convertIntervalsForBibyt = {
  "1m": 1,
  "3m": 3,
  "5m": 5,
  "30m": 30,
  "1h": 60,
  "2h": 120,
  "6h": 360,
  "1d": "D",
  "3d": 720,
  "1w": "W",
  "1M": "M",
};

function roundTimeToInterval(dealTime, interval) {
  const intervals = {
    "1m": 60,
    "3m": 180,
    "5m": 300,
    "30m": 1800,
    "1h": 3600,
    "2h": 7200,
    "6h": 21600,
    "1d": 86400,
    "3d": 259200,
    "1w": 604800,
    "1M": 2592000,
  };

  const intervalSeconds = intervals[interval];

  return (
    Math.floor(dealTime / (intervalSeconds * 1000)) * intervalSeconds * 1000
  );
}

const main_indicators = ["MA", "EMA", "SMA", "BBI"];

const sub_indicators = {
  VOL: "pane_1",
  BIAS: "pane_2",
  MACD: "pane_3",
  BOLL: "pane_4",
  KDJ: "pane_5",
  RSI: "pane_6",
  BRAR: "pane_7",
  CCI: "pane_8",
  DMI: "pane_9",
  CR: "pane_10",
  PSY: "pane_11",
  DMA: "pane_12",
  TRIX: "pane_13",
  OBV: "pane_14",
  VR: "pane_15",
  WR: "pane_16",
  MTM: "pane_17",
  EMV: "pane_18",
  SAR: "pane_19",
  AO: "pane_20",
  ROC: "pane_21",
  SAR: "pane_22",
  PVT: "pane_23",
};

export function Indicators({
  installMainIndicatorRef,
  removeMainIndicatorRef,
  installSubIndicatorRef,
  removeSubIndicatorRef,
}) {
  const [indicators, setIndicators] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <>
      <Button
        variant="outlined"
        color="inherit"
        startIcon={<Iconify icon="solar:tuning-line-duotone" />}
        onClick={(e) => {
          setAnchorEl(e.currentTarget);
        }}
      >
        Индикаторы
      </Button>
      <Menu
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
        onClose={() => {
          setAnchorEl(null);
        }}
      >
        <SimpleBar style={{ maxHeight: 48 * 4.5, width: "10ch" }}>
          {main_indicators.map((n) => (
            <MenuItem
              key={n}
              onClick={() => {
                if (indicators.some((indicator) => indicator === n)) {
                  removeMainIndicatorRef.current(n);
                  setIndicators((prev) => prev.filter((i) => i !== n));
                } else {
                  installMainIndicatorRef.current(n);
                  setIndicators((prev) => [...prev, n]);
                }
              }}
              sx={{
                backgroundColor: indicators.some((indicator) => indicator === n)
                  ? "rgba(0, 167, 111, 0.16)"
                  : "transparent",
                "&:hover": {
                  backgroundColor: indicators.some(
                    (indicator) => indicator === n
                  )
                    ? "rgba(0, 167, 111, 0.32)"
                    : "rgba(255, 255, 255, 0.08)",
                },
              }}
            >
              {n}
            </MenuItem>
          ))}
          {Object.keys(sub_indicators).map((n) => (
            <MenuItem
              key={n}
              onClick={() => {
                if (indicators.some((indicator) => indicator === n)) {
                  removeSubIndicatorRef.current([n, sub_indicators[n]]);
                  setIndicators((prev) => prev.filter((i) => i !== n));
                } else {
                  installSubIndicatorRef.current([n, sub_indicators[n]]);
                  setIndicators((prev) => [...prev, n]);
                }
              }}
              sx={{
                backgroundColor: indicators.some((indicator) => indicator === n)
                  ? "rgba(0, 167, 111, 0.16)"
                  : "transparent",
                "&:hover": {
                  backgroundColor: indicators.some(
                    (indicator) => indicator === n
                  )
                    ? "rgba(0, 167, 111, 0.32)"
                    : "rgba(255, 255, 255, 0.08)",
                },
              }}
            >
              {n}
            </MenuItem>
          ))}
        </SimpleBar>
      </Menu>
    </>
  );
}

export function Settings({ changeCandleTypeRef, showGridRef }) {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <>
      <Tooltip title="Настройки" arrow>
        <IconButton
          onClick={() => {
            setOpenDialog(true);
          }}
        >
          <Iconify
            icon="solar:settings-minimalistic-bold-duotone"
            color="text.secondary"
          />
        </IconButton>
      </Tooltip>
      <Dialog
        open={openDialog}
        maxWidth="sm"
        fullWidth
        onClose={() => {
          setOpenDialog(false);
        }}
        PaperProps={{
          sx: {
            boxShadow: "none",
            borderRadius: "16px",
            backdropFilter: "none",
            backgroundImage: "none",
          },
        }}
      >
        <DialogContent>
          <Stack gap={3}>
            <Stack
              alignItems="center"
              flexDirection="row"
              justifyContent="space-between"
            >
              <Typography variant="subtitle1">Тип графика</Typography>
              <Select
                defaultValue={
                  localStorage.getItem("candleType") ?? "candle_solid"
                }
                onChange={(e) => {
                  changeCandleTypeRef.current(e.target.value);
                  localStorage.setItem("candleType", e.target.value);
                }}
              >
                <MenuItem value="candle_solid">Сплошная</MenuItem>
                <MenuItem value="candle_stroke">Штрих</MenuItem>
                <MenuItem value="candle_up_stroke">Штрих вверх</MenuItem>
                <MenuItem value="candle_down_stroke">Штрих вниз</MenuItem>
                <MenuItem value="ohlc">OHLC</MenuItem>
                <MenuItem value="area">Area</MenuItem>
              </Select>
            </Stack>
            <Divider />
            <Stack
              alignItems="center"
              flexDirection="row"
              justifyContent="space-between"
            >
              <Typography variant="subtitle1">Показать сетку</Typography>
              <Box
                sx={{
                  width: 100,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Switch
                  defaultChecked={
                    JSON.parse(localStorage.getItem("statusGrid")) ?? true
                  }
                  onChange={(e) => {
                    showGridRef.current(e.target.checked);
                    localStorage.setItem("statusGrid", e.target.checked);
                  }}
                />
              </Box>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function Close({ setActivate }) {
  return (
    <>
      <Tooltip title="Закрыть" arrow>
        <IconButton color="error" onClick={() => setActivate(null)}>
          <Iconify icon="mingcute:close-line" color="error.main" />
        </IconButton>
      </Tooltip>
    </>
  );
}

export function Tools({}) {
  return <></>;
}

function Annotations({ addOverlay }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  return (
    <ClickAwayListener
      mouseEvent="onMouseDown"
      touchEvent="onTouchStart"
      onClickAway={() => setAnchorEl(null)}
    >
      <div>
        <ListItemButton
          onClick={(e) => {
            setAnchorEl(open ? null : e.currentTarget);
          }}
          sx={{
            p: "4px",
            m: "0px 4px",
            borderRadius: "6px",
            "&:hover": {
              backgroundColor: "rgba(145, 158, 171, 0.08)",
            },
          }}
        >
          <Iconify icon="line-md:hash-small" />
        </ListItemButton>
        <Popper
          open={open}
          anchorEl={anchorEl}
          transition
          placement="right-start"
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
              <Paper>
                <Stack>
                  <MenuItem
                    onClick={() => {
                      setAnchorEl(null);
                      addOverlay.current("simpleAnnotation");
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                    >
                      <g transform="rotate(-90 12 12)">
                        <g fill="none" fillRule="evenodd">
                          <path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                          <path
                            fill="currentColor"
                            d="M10.537 2.164a3 3 0 0 1 2.244.727l.15.14l7.822 7.823a3 3 0 0 1 .135 4.098l-.135.144l-5.657 5.657a3 3 0 0 1-4.098.135l-.144-.135L3.03 12.93a3 3 0 0 1-.878-2.188l.011-.205l.472-5.185a3 3 0 0 1 2.537-2.695l.179-.021zM8.024 8.025a2 2 0 1 0 2.829 2.829a2 2 0 0 0-2.829-2.829"
                          />
                        </g>
                      </g>
                    </svg>
                    <Typography sx={{ ml: 2 }}>Бирка</Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setAnchorEl(null);
                      addOverlay.current("simpleTag");
                    }}
                  >
                    <Iconify icon="line-md:hash-small" />
                    <Typography sx={{ ml: 2 }}>Линейная метка</Typography>
                  </MenuItem>
                </Stack>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </ClickAwayListener>
  );
}

function Cuts({ addOverlay }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  return (
    <ClickAwayListener
      mouseEvent="onMouseDown"
      touchEvent="onTouchStart"
      onClickAway={() => setAnchorEl(null)}
    >
      <div>
        <ListItemButton
          onClick={(event) => {
            setAnchorEl(open ? null : event.currentTarget);
          }}
          sx={{
            p: "4px",
            m: "0px 4px",
            borderRadius: "6px",
            "&:hover": {
              backgroundColor: "rgba(145, 158, 171, 0.08)",
            },
          }}
        >
          <Iconify icon="ph:line-segments-fill" />
        </ListItemButton>
        <Popper
          open={open}
          anchorEl={anchorEl}
          transition
          placement="right-start"
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
              <Paper>
                <Stack>
                  <MenuItem
                    onClick={() => {
                      setAnchorEl(null);
                      addOverlay.current("sampleThreeWaves");
                    }}
                  >
                    <Iconify icon="ph:line-segments-bold" />
                    <Typography sx={{ ml: 2 }}>3 волны</Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setAnchorEl(null);
                      addOverlay.current("sampleFiveWaves");
                    }}
                  >
                    <Iconify icon="ph:line-segments-bold" />
                    <Typography sx={{ ml: 2 }}>5 волн</Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setAnchorEl(null);
                      addOverlay.current("sampleEightWaves");
                    }}
                  >
                    <Iconify icon="ph:line-segments-bold" />
                    <Typography sx={{ ml: 2 }}>8 волн</Typography>
                  </MenuItem>
                </Stack>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </ClickAwayListener>
  );
}

function Figures({ addOverlay }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  return (
    <ClickAwayListener
      mouseEvent="onMouseDown"
      touchEvent="onTouchStart"
      onClickAway={() => setAnchorEl(null)}
    >
      <div>
        <ListItemButton
          onClick={(e) => {
            setAnchorEl(open ? null : e.currentTarget);
          }}
          sx={{
            p: "4px",
            m: "0px 4px",
            borderRadius: "6px",
            "&:hover": {
              backgroundColor: "rgba(145, 158, 171, 0.08)",
            },
          }}
        >
          <Iconify icon="line-md:circle" />
        </ListItemButton>
        <Popper
          open={open}
          anchorEl={anchorEl}
          transition
          placement="right-start"
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
              <Paper>
                <Stack>
                  <MenuItem
                    onClick={() => {
                      setAnchorEl(null);
                      addOverlay.current("sampleCircle");
                    }}
                  >
                    <Iconify icon="line-md:circle" />
                    <Typography sx={{ ml: 2 }}>Круг</Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setAnchorEl(null);
                      addOverlay.current("sampleRect");
                    }}
                  >
                    <Iconify icon="line-md:square" />
                    <Typography sx={{ ml: 2 }}>Прямоугольник</Typography>
                  </MenuItem>
                </Stack>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </ClickAwayListener>
  );
}

function Lines({ addOverlay }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  return (
    <ClickAwayListener
      mouseEvent="onMouseDown"
      touchEvent="onTouchStart"
      onClickAway={() => setAnchorEl(null)}
    >
      <div>
        <ListItemButton
          onClick={(e) => {
            setAnchorEl(open ? null : e.currentTarget);
          }}
          sx={{
            p: "4px",
            m: "0px 4px",
            borderRadius: "6px",
            "&:hover": {
              backgroundColor: "rgba(145, 158, 171, 0.08)",
            },
          }}
        >
          <Iconify icon="material-symbols:line-start" />
        </ListItemButton>
        <Popper
          open={open}
          anchorEl={anchorEl}
          transition
          placement="right-start"
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
              <Paper>
                <Stack>
                  <MenuItem
                    onClick={() => {
                      setAnchorEl(null);
                      addOverlay.current("straightLine");
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <g transform="rotate(130 12 12) translate(0 24) scale(1 -1)">
                        <path
                          fill="currentColor"
                          d="M2 11h7.17c.41-1.17 1.52-2 2.83-2s2.42.83 2.83 2H22v2h-7.17A2.99 2.99 0 0 1 12 15a2.99 2.99 0 0 1-2.83-2H2z"
                        />
                      </g>
                    </svg>
                    <Typography sx={{ ml: 2 }}>Прямая линия</Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setAnchorEl(null);
                      console.log(addOverlay.current("horizontalStraightLine"));
                    }}
                  >
                    <Iconify icon="mdi:ray-vertex" />
                    <Typography sx={{ ml: 2 }}>
                      Горизонтальная прямая линия
                    </Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setAnchorEl(null);
                      addOverlay.current("verticalStraightLine");
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <g transform="rotate(90 12 12) translate(0 24) scale(1 -1)">
                        <path
                          fill="currentColor"
                          d="M2 11h7.17c.41-1.17 1.52-2 2.83-2s2.42.83 2.83 2H22v2h-7.17A2.99 2.99 0 0 1 12 15a2.99 2.99 0 0 1-2.83-2H2z"
                        />
                      </g>
                    </svg>
                    <Typography sx={{ ml: 2 }}>
                      Вертикальная прямая линия
                    </Typography>
                  </MenuItem>
                  <Divider />
                  <MenuItem
                    onClick={() => {
                      setAnchorEl(null);
                      addOverlay.current("rayLine");
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <g transform="rotate(130 12 12) translate(0 24) scale(1 -1)">
                        <path
                          fill="currentColor"
                          d="m1 12l4 4v-3h12.17c.41 1.17 1.52 2 2.83 2a3 3 0 0 0 3-3a3 3 0 0 0-3-3c-1.31 0-2.42.83-2.83 2H5V8z"
                        />
                      </g>
                    </svg>
                    <Typography sx={{ ml: 2 }}>Лучевая линия</Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setAnchorEl(null);
                      addOverlay.current("horizontalRayLine");
                    }}
                  >
                    <Iconify icon="mdi:ray-end-arrow" />
                    <Typography sx={{ ml: 2 }}>
                      Горизонтальная лучевая линия
                    </Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setAnchorEl(null);
                      addOverlay.current("verticalRayLine");
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <g transform="rotate(90 12 12) translate(0 24) scale(1 -1)">
                        <path
                          fill="currentColor"
                          d="m1 12l4 4v-3h12.17c.41 1.17 1.52 2 2.83 2a3 3 0 0 0 3-3a3 3 0 0 0-3-3c-1.31 0-2.42.83-2.83 2H5V8z"
                        />
                      </g>
                    </svg>
                    <Typography sx={{ ml: 2 }}>
                      Вертикальная лучевая линия
                    </Typography>
                  </MenuItem>
                  <Divider />
                  <MenuItem
                    onClick={() => {
                      setAnchorEl(null);
                      addOverlay.current("segment");
                    }}
                  >
                    <Iconify icon="tabler:line" />
                    <Typography sx={{ ml: 2 }}>Cегмент</Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setAnchorEl(null);
                      addOverlay.current("horizontalSegment");
                    }}
                  >
                    <Iconify icon="mdi:ray-start-end" />
                    <Typography sx={{ ml: 2 }}>
                      Горизонтальный сегмент
                    </Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setAnchorEl(null);
                      addOverlay.current("verticalSegment");
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <g transform="rotate(90 12 12) translate(0 24) scale(1 -1)">
                        <path
                          fill="currentColor"
                          d="M4 9c1.31 0 2.42.83 2.83 2h10.34c.41-1.17 1.52-2 2.83-2a3 3 0 0 1 3 3a3 3 0 0 1-3 3a2.99 2.99 0 0 1-2.83-2H6.83A2.99 2.99 0 0 1 4 15a3 3 0 0 1-3-3a3 3 0 0 1 3-3"
                        />
                      </g>
                    </svg>
                    <Typography sx={{ ml: 2 }}>Вертикальный сегмент</Typography>
                  </MenuItem>
                  <Divider />
                  <MenuItem
                    onClick={() => {
                      setAnchorEl(null);
                      addOverlay.current("priceLine");
                    }}
                  >
                    <Iconify icon="material-symbols:line-start" />
                    <Typography sx={{ ml: 2 }}>Линия цены</Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setAnchorEl(null);
                      addOverlay.current("priceChannelLine");
                    }}
                  >
                    <svg viewBox="0 0 24 24" width="24" height="24">
                      <path
                        fill="currentColor"
                        d="M3.3367688759765626,12.63173C3.5320318759765623,12.82699,3.8486138759765627,12.82699,4.043876875976562,12.63173L11.822052875976562,4.853553C12.017312875976563,4.658291,12.017312875976563,4.341708,11.822052875976562,4.146446C11.626792875976562,3.9511843,11.310202875976563,3.9511843,11.114942875976563,4.146446L3.3367688759765626,11.92462C3.1415071759765625,12.11988,3.1415071759765625,12.43647,3.3367688759765626,12.63173ZM5.001492875976562,17.0351C4.806232875976562,16.8399,4.806232875976562,16.5233,5.001492875976562,16.328L7.304532875976562,14.025C7.210822875976563,13.82916,7.158352875976563,13.60984,7.158352875976563,13.37827C7.158352875976563,12.54984,7.829922875976562,11.87827,8.658352875976561,11.87827C8.889922875976563,11.87827,9.109232875976563,11.93075,9.305052875976562,12.02446L11.304532875976562,10.02498C11.210822875976563,9.82916,11.158352875976561,9.60984,11.158352875976561,9.37827C11.158352875976561,8.54984,11.829922875976562,7.8782700000000006,12.658352875976563,7.8782700000000006C12.889922875976563,7.8782700000000006,13.109232875976563,7.93075,13.305022875976562,8.024460000000001L15.608122875976562,5.72142C15.803322875976562,5.5261499999999995,16.119922875976563,5.5261499999999995,16.315222875976563,5.72142C16.510422875976563,5.9166799999999995,16.510422875976563,6.23326,16.315222875976563,6.42852L14.012122875976562,8.73156C14.105822875976562,8.92738,14.158322875976562,9.1467,14.158322875976562,9.37827C14.158322875976562,10.2067,13.486822875976562,10.87827,12.658352875976563,10.87827C12.426772875976562,10.87827,12.207452875976562,10.82579,12.011642875976563,10.73209L10.012162875976562,12.73156C10.105872875976562,12.92738,10.158352875976561,13.1467,10.158352875976561,13.37827C10.158352875976561,14.2067,9.486772875976563,14.8783,8.658352875976561,14.8783C8.426772875976562,14.8783,8.207452875976562,14.8258,8.011642875976563,14.7321L5.708602875976562,17.0351C5.513342875976562,17.2304,5.196752875976562,17.2304,5.001492875976562,17.0351ZM10.415712875976563,18.328C10.220452875976562,18.5233,9.903862875976563,18.5233,9.708602875976563,18.328C9.513342875976562,18.1328,9.513342875976562,17.816200000000002,9.708602875976563,17.6209L12.304532875976562,15.025C12.210822875976563,14.8292,12.158352875976563,14.6098,12.158352875976563,14.3783C12.158352875976563,13.54984,12.829922875976562,12.87827,13.658322875976562,12.87827C13.889922875976563,12.87827,14.109222875976563,12.93075,14.305022875976562,13.02446L17.486822875976564,9.84274C17.682022875976564,9.64747,17.99862287597656,9.64747,18.19392287597656,9.84274C18.38912287597656,10.038,18.38912287597656,10.35458,18.19392287597656,10.54984L15.012122875976562,13.73156C15.105822875976562,13.92738,15.158322875976562,14.1467,15.158322875976562,14.3783C15.158322875976562,15.2067,14.486822875976562,15.8783,13.658322875976562,15.8783C13.426822875976562,15.8783,13.207422875976562,15.8258,13.011642875976563,15.7321L10.415712875976563,18.328Z"
                        stroke-opacity="0"
                        stroke="none"
                      ></path>
                    </svg>
                    <Typography sx={{ ml: 2 }}>
                      Линия ценового канала
                    </Typography>
                  </MenuItem>
                </Stack>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </ClickAwayListener>
  );
}

function Lineup({ addOverlay }) {
  return (
    <ListItemButton
      onClick={() => {
        addOverlay.current("lineup");
      }}
      sx={{
        p: "4px",
        m: "0px 4px",
        borderRadius: "6px",
        "&:hover": {
          backgroundColor: "rgba(145, 158, 171, 0.08)",
        },
      }}
    >
      <Iconify icon="solar:ruler-angular-bold" />
    </ListItemButton>
  );
}
