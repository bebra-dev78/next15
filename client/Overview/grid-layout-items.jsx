"use client";

import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import Skeleton from "@mui/material/Skeleton";
import Collapse from "@mui/material/Collapse";
import Tooltip from "@mui/material/Tooltip";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";

import { useState, useEffect } from "react";
import ApexChart from "react-apexcharts";
import { DateTime } from "luxon";
import moment from "moment";

import useFormat from "#/utils/format-thousands";
import Iconify from "#/components/iconify";
import { useUser } from "#/app/my/layout";

import styles from "./grid-layout-items.module.css";

function ProfitItem({ prev, hours, current, isLoading }) {
  const counter = current.reduce((a, t) => a + t.profit, 0);
  const diff = counter - prev.reduce((a, t) => a + t.profit, 0);

  return isLoading ? (
    <Skeleton height={166} />
  ) : (
    <Card className={styles.card}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2">Прибыль</Typography>
        <div className={styles.stack}>
          <Iconify
            icon={
              diff < 0
                ? "solar:double-alt-arrow-down-bold-duotone"
                : "solar:double-alt-arrow-up-bold-duotone"
            }
            color={diff < 0 ? "error.main" : "success.main"}
          />

          <Tooltip
            title={`Изменение прибыли относительно вчера в ${DateTime.now().toFormat(
              "HH:mm"
            )}`}
            placement="right-start"
            arrow
          >
            <Typography
              variant="subtitle2"
              color={diff < 0 ? "error.main" : "success.main"}
            >
              {diff.toFixed(2)}$
            </Typography>
          </Tooltip>
        </div>
        <Typography variant="h3">{counter.toFixed(2)}$</Typography>
      </Box>
      <div className={styles.mini_chart}>
        <ApexChart
          options={{
            chart: {
              type: "line",
              toolbar: {
                show: false,
              },
              zoom: {
                enabled: false,
              },
              dropShadow: {
                enabled: false,
              },
              animations: {
                enabled: false,
              },
            },
            dataLabels: { enabled: false },
            markers: {
              strokeColors: "rgba(22, 28, 36, 0.8)",
            },
            stroke: {
              width: 2,
              curve: "smooth",
            },
            xaxis: {
              type: "numeric",
              labels: { show: false },
              axisBorder: {
                show: false,
              },
              axisTicks: {
                show: false,
              },
              tooltip: {
                enabled: false,
              },
            },
            yaxis: {
              axisBorder: {
                show: false,
              },
              axisTicks: {
                show: false,
              },
              labels: {
                show: false,
              },
            },
            grid: {
              show: false,
              padding: {
                left: 0,
                right: 0,
                top: -10,
                bottom: 0,
              },
            },
            tooltip: {
              x: { show: false },
              y: {
                formatter: (value) => `${useFormat(value.toFixed(2))}$`,
                title: {
                  formatter: () => "",
                },
              },
              marker: {
                show: false,
              },
            },
          }}
          series={[
            {
              data: Array.from({ length: 24 }, (_, hour) => {
                const hourStart = hours + hour * 60 * 60 * 1000;
                const hourEnd = hours + (hour + 1) * 60 * 60 * 1000;
                const hourProfit = current.reduce((a, t) => {
                  const entryTime = parseInt(t.entry_time);
                  if (entryTime >= hourStart && entryTime < hourEnd) {
                    return a + t.profit;
                  }
                  return a;
                }, 0);
                return { x: hour, y: hourProfit };
              }),
              name: "aboba",
              color: "rgb(255, 171, 0)",
            },
          ]}
          type="line"
          width={100}
          height={100}
        />
      </div>
    </Card>
  );
}

function CommissionItem({ prev, hours, current, isLoading }) {
  const counter = current.reduce((a, t) => a + t.commission, 0);
  const diff = counter - prev.reduce((a, t) => a + t.commission, 0);

  return isLoading ? (
    <Skeleton height={166} />
  ) : (
    <Card className={styles.card}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2">Комиссия</Typography>
        <div className={styles.stack}>
          <Iconify
            icon={
              diff < 0
                ? "solar:double-alt-arrow-down-bold-duotone"
                : "solar:double-alt-arrow-up-bold-duotone"
            }
            color={diff < 0 ? "error.main" : "success.main"}
          />

          <Tooltip
            title={`Изменение комиссии относительно вчера в ${DateTime.now().toFormat(
              "HH:mm"
            )}`}
            placement="right-start"
            arrow
          >
            <Typography
              variant="subtitle2"
              color={diff < 0 ? "error.main" : "success.main"}
            >
              {diff.toFixed(3)}$
            </Typography>
          </Tooltip>
        </div>
        <Stack>
          <Typography variant="h3">{counter.toFixed(3)}$</Typography>
        </Stack>
      </Box>
      <div className={styles.mini_chart}>
        <ApexChart
          options={{
            chart: {
              type: "line",
              toolbar: {
                show: false,
              },
              zoom: {
                enabled: false,
              },
              dropShadow: {
                enabled: false,
              },
              animations: {
                enabled: false,
              },
            },
            dataLabels: { enabled: false },
            markers: {
              strokeColors: "rgba(22, 28, 36, 0.8)",
            },
            stroke: {
              width: 2,
              curve: "smooth",
            },
            xaxis: {
              type: "numeric",
              labels: { show: false },
              axisBorder: {
                show: false,
              },
              axisTicks: {
                show: false,
              },
              tooltip: {
                enabled: false,
              },
            },
            yaxis: {
              axisBorder: {
                show: false,
              },
              axisTicks: {
                show: false,
              },
              labels: {
                show: false,
              },
            },
            grid: {
              show: false,
              padding: {
                left: 0,
                right: 0,
                top: -10,
                bottom: 0,
              },
            },
            tooltip: {
              x: { show: false },
              y: {
                formatter: (value) => `${useFormat(value.toFixed(3))}$`,
                title: {
                  formatter: () => "",
                },
              },
              marker: {
                show: false,
              },
            },
          }}
          series={[
            {
              data: Array.from({ length: 24 }, (_, hour) => {
                const hourStart = hours + hour * 60 * 60 * 1000;
                const hourEnd = hours + (hour + 1) * 60 * 60 * 1000;
                const hourProfit = current.reduce((a, t) => {
                  const entryTime = parseInt(t.entry_time);
                  if (entryTime >= hourStart && entryTime < hourEnd) {
                    return a + t.commission;
                  }
                  return a;
                }, 0);
                return { x: hour, y: hourProfit };
              }),
              name: "aboba",
              color: "rgb(0, 184, 217)",
            },
          ]}
          type="line"
          width={100}
          height={100}
        />
      </div>
    </Card>
  );
}

function VolumeItem({ prev, hours, current, isLoading }) {
  const counter = current.reduce((a, t) => a + t.volume, 0);
  const diff = counter - prev.reduce((a, t) => a + t.volume, 0);

  return isLoading ? (
    <Skeleton height={166} />
  ) : (
    <Card className={styles.card}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2">Объём</Typography>
        <div className={styles.stack}>
          <Iconify
            icon={
              diff < 0
                ? "solar:double-alt-arrow-down-bold-duotone"
                : "solar:double-alt-arrow-up-bold-duotone"
            }
            color={diff < 0 ? "error.main" : "success.main"}
          />

          <Tooltip
            title={`Изменение объёма относительно вчера в ${DateTime.now().toFormat(
              "HH:mm"
            )}`}
            placement="right-start"
            arrow
          >
            <Typography
              variant="subtitle2"
              color={diff < 0 ? "error.main" : "success.main"}
            >
              {diff.toFixed()}$
            </Typography>
          </Tooltip>
        </div>
        <Stack>
          <Typography variant="h3">{useFormat(counter.toFixed())}$</Typography>
        </Stack>
      </Box>
      <div className={styles.mini_chart}>
        <ApexChart
          options={{
            chart: {
              type: "line",
              toolbar: {
                show: false,
              },
              zoom: {
                enabled: false,
              },
              dropShadow: {
                enabled: false,
              },
              animations: {
                enabled: false,
              },
            },
            stroke: {
              width: 2,
              curve: "smooth",
            },
            dataLabels: { enabled: false },
            markers: {
              strokeColors: "rgba(22, 28, 36, 0.8)",
            },
            xaxis: {
              type: "numeric",
              labels: { show: false },
              axisBorder: {
                show: false,
              },
              axisTicks: {
                show: false,
              },
              tooltip: {
                enabled: false,
              },
            },
            yaxis: {
              axisBorder: {
                show: false,
              },
              axisTicks: {
                show: false,
              },
              labels: {
                show: false,
              },
            },
            grid: {
              show: false,
              padding: {
                left: 0,
                right: 0,
                top: -10,
                bottom: 0,
              },
            },
            tooltip: {
              x: { show: false },
              y: {
                formatter: (value) => `${useFormat(value.toFixed(0))}$`,
                title: {
                  formatter: () => "",
                },
              },
              marker: {
                show: false,
              },
            },
          }}
          series={[
            {
              data: Array.from({ length: 24 }, (_, hour) => {
                const hourStart = hours + hour * 60 * 60 * 1000;
                const hourEnd = hours + (hour + 1) * 60 * 60 * 1000;
                const hourProfit = current.reduce((a, t) => {
                  const entryTime = parseInt(t.entry_time);
                  if (entryTime >= hourStart && entryTime < hourEnd) {
                    return a + t.volume;
                  }
                  return a;
                }, 0);
                return { x: hour, y: hourProfit };
              }),
              name: "aboba",
              color: "rgb(142, 51, 255)",
            },
          ]}
          type="line"
          width={100}
          height={100}
        />
      </div>
    </Card>
  );
}

function StatisticsItem({ data, isLoading }) {
  const [openInfo, setOpenInfo] = useState(false);

  const seriesData = Array(10)
    .fill(0)
    .map((_, index) => {
      if (data.length === 0) {
        return { profit: 0, commission: 0, volume: 0, loss: 0 };
      }
      const startOfDay = DateTime.now()
        .minus({ days: index })
        .startOf("day")
        .toMillis();
      const endOfDay = DateTime.now()
        .minus({ days: index })
        .endOf("day")
        .toMillis();
      const dailyLoss = data
        .filter((trade) => {
          const entryTime = parseInt(trade.entry_time);
          return entryTime >= startOfDay && entryTime <= endOfDay;
        })
        .reduce((acc, trade) => acc + Math.max(-trade.profit, 0), 0);
      const netValue =
        data
          .filter((trade) => {
            const entryTime = parseInt(trade.entry_time);
            return entryTime >= startOfDay && entryTime <= endOfDay;
          })
          .reduce((acc, trade) => acc + trade.profit, 0) - dailyLoss;

      return {
        profit: netValue > 0 ? netValue : 0,
        commission: data
          .filter((trade) => {
            const entryTime = parseInt(trade.entry_time);
            return entryTime >= startOfDay && entryTime <= endOfDay;
          })
          .reduce((acc, trade) => acc + trade.commission, 0),
        volume: data
          .filter((trade) => {
            const entryTime = parseInt(trade.entry_time);
            return entryTime >= startOfDay && entryTime <= endOfDay;
          })
          .reduce((acc, trade) => acc + trade.volume, 0),
        loss: dailyLoss,
      };
    })
    .reverse();

  return isLoading ? (
    <Skeleton height={586} />
  ) : (
    <Card>
      <CardHeader
        title="Статистика за 10 дней"
        action={
          <IconButton
            onClick={() => setOpenInfo((prev) => !prev)}
            style={{ marginRight: 5 }}
          >
            <Iconify icon="solar:info-circle-linear" color="text.disabled" />
          </IconButton>
        }
      />
      <Collapse in={openInfo} timeout="auto" unmountOnExit>
        <Typography color="text.secondary" className={styles.collapse}>
          Сводка данных за последние 10 дней в виде графика. Слева на графике
          значения прибыли/убытка и комиссии, справа - значения объёма. Чтобы
          отобразить или скрыть тип данных, нажмите на цветовые маркеры.
        </Typography>
      </Collapse>
      <div className={styles.chart}>
        <ApexChart
          options={{
            chart: {
              toolbar: {
                show: false,
              },
              zoom: {
                enabled: false,
              },
              dropShadow: {
                enabled: false,
              },
              animations: {
                enabled: false,
              },
            },
            stroke: {
              width: [0, 0, 3, 2],
              curve: "smooth",
            },
            plotOptions: {
              bar: {
                borderRadius: 3,
                columnWidth: "20%",
                borderRadiusApplication: "end",
              },
            },
            fill: {
              type: ["solid", "solid", "solid", "gradient"],
              gradient: {
                type: "vertical",
                shadeIntensity: 0.1,
                opacityFrom: 0.4,
                opacityTo: 0.2,
              },
            },
            legend: {
              showForSingleSeries: true,
              position: "top",
              horizontalAlign: "right",
              formatter: (legendName) => {
                switch (legendName) {
                  case "profit":
                    return "Прибыль";
                  case "commission":
                    return "Комиссия";
                  case "volume":
                    return "Объём";

                  default:
                    return "Убыток";
                }
              },
              labels: {
                colors: "text.primary",
              },
              fontWeight: 500,
              fontSize: "13px",
              fontFamily: "inherit",
              itemMargin: {
                horizontal: 14,
                vertical: 5,
              },
              markers: {
                width: 11,
                height: 11,
                offsetX: -2,
              },
            },
            grid: {
              borderColor: "rgba(145, 158, 171, 0.2)",
              strokeDashArray: 3,
            },
            xaxis: {
              categories: [9, 8, 7, 6, 5, 4, 3, 2, 1, 0].map(
                (i) =>
                  moment().subtract(i, "days").format("L").split("/")[1] +
                  "." +
                  moment().subtract(i, "days").format("L").split("/")[0]
              ),
              axisBorder: {
                show: false,
              },
              axisTicks: {
                show: false,
              },
              labels: {
                style: {
                  colors: "#637381",
                  fontSize: "12px",
                  fontFamily: "inherit",
                },
              },
            },
            markers: {
              strokeColors: "rgba(22, 28, 36, 0.8)",
            },
            yaxis: [
              {
                max:
                  data.length === 0
                    ? 6
                    : Math.max(
                        Math.max(...seriesData.map((day) => day.profit)),
                        Math.max(...seriesData.map((day) => day.loss))
                      ),
                min: 0,
                showAlways: true,
                tickAmount: 7,
                seriesName: ["profit", "commission", "loss"],
                labels: {
                  style: {
                    fontSize: "12px",
                    colors: "#637381",
                    fontFamily: "inherit",
                  },
                  offsetX: -10,
                  formatter: (val) => `${useFormat(val.toFixed())}$`,
                },
              },
              {
                max:
                  data.length === 0
                    ? 500
                    : Math.max(...seriesData.map((day) => day.volume)),
                min: 0,
                showAlways: true,
                tickAmount: 5,
                seriesName: "volume",
                opposite: true,
                labels: {
                  align: "right",
                  style: {
                    fontSize: "12px",
                    colors: "#637381",
                    fontFamily: "inherit",
                  },
                  offsetX: -10,
                  formatter: (val) => `$${useFormat(val.toFixed())}`,
                },
              },
            ],
            tooltip: {
              x: {
                show: false,
              },
              y: {
                formatter: (val) => `${useFormat(val?.toFixed())}$`,
                title: {
                  formatter: (seriesName) => {
                    switch (seriesName) {
                      case "profit":
                        return "Прибыль";
                      case "commission":
                        return "Комиссия";
                      case "volume":
                        return "Объём";

                      default:
                        return "Убыток";
                    }
                  },
                },
              },
              style: {
                fontSize: "12px",
                fontFamily: "inherit",
              },
            },
          }}
          series={[
            {
              name: "profit",
              type: "column",
              color: "rgb(34, 197, 94)",
              data: seriesData.map((day) => day.profit),
            },
            {
              name: "loss",
              type: "column",
              color: "rgb(255, 86, 48)",
              data: seriesData.map((day) => day.loss),
            },
            {
              name: "commission",
              type: "line",
              color: "rgb(0, 184, 217)",
              data: seriesData.map((day) => day.commission),
            },
            {
              name: "volume",
              type: "area",
              color: "rgb(142, 51, 255)",
              data: seriesData.map((day) => day.volume),
            },
          ]}
          height={384}
        />
      </div>
      <Divider className={styles.divider} />
      <div className={styles.row_div}>
        <div className={styles.box}>
          <Typography color="text.secondary" gutterBottom>
            Прибыль
          </Typography>
          <Typography variant="h4">
            {useFormat(
              data
                .reduce(
                  (acc, trade) => acc + (trade.income - trade.commission),
                  0
                )
                .toFixed(2)
            )}
            $
          </Typography>
        </div>
        <Divider
          className={styles.vertical_divider}
          orientation="vertical"
          flexItem
        />
        <div className={styles.box}>
          <Typography color="text.secondary" gutterBottom>
            Комиссия
          </Typography>
          <Typography variant="h4">
            {useFormat(
              data
                .reduce((acc, trade) => acc + parseFloat(trade.commission), 0)
                .toFixed(3)
            )}
            $
          </Typography>
        </div>
        <Divider
          className={styles.vertical_divider}
          orientation="vertical"
          flexItem
        />
        <div className={styles.box}>
          <Typography color="text.secondary" gutterBottom>
            Объём
          </Typography>
          <Typography variant="h4">
            {useFormat(
              data
                .reduce((acc, trade) => acc + parseFloat(trade.volume), 0)
                .toFixed(0)
            )}
            $
          </Typography>
        </div>
      </div>
    </Card>
  );
}

export default function GridLayoutItems() {
  const { user } = useUser();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/resourses/trades?section=overview`,
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
  }, []);

  const now = Date.now();

  const current = data.filter(
    (t) => Date.now() - parseInt(t.entry_time) <= 24 * 60 * 60 * 1000
  );

  const prev = data.filter((t) => {
    var entryTime = parseInt(t.entry_time);
    return (
      now - entryTime > 24 * 60 * 60 * 1000 &&
      now - entryTime <= 48 * 60 * 60 * 1000
    );
  });

  const hours = DateTime.now().minus({ hours: 24 }).toMillis();

  return (
    <>
      <Grid item xs={12} md={4}>
        <ProfitItem
          prev={prev}
          hours={hours}
          current={current}
          isLoading={loading}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <CommissionItem
          prev={prev}
          hours={hours}
          current={current}
          isLoading={loading}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <VolumeItem
          prev={prev}
          hours={hours}
          current={current}
          isLoading={loading}
        />
      </Grid>
      <Grid item xs={12} md={12} xl={12}>
        <StatisticsItem data={data} isLoading={loading} />
      </Grid>
    </>
  );
}
