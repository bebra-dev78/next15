"use client";

import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import RadioGroup from "@mui/material/RadioGroup";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Radio from "@mui/material/Radio";
import Card from "@mui/material/Card";

import { init, dispose, registerIndicator } from "klinecharts";
import { useEffect, useRef } from "react";

import "#/configs/klinecharts";
import {
  Indicators,
  subDataEndTimestaps,
  roundTimeToInterval,
  mainDataEndTimestaps,
  subDataStartTimestaps,
  mainDataStartTimestaps,
} from "#/configs/klinecharts";

import styles from "./klinechart.module.css";

export default function KlineChart({ activate, setActivate }) {
  const installMainIndicatorRef = useRef(null);
  const removeMainIndicatorRef = useRef(null);
  const installSubIndicatorRef = useRef(null);
  const removeSubIndicatorRef = useRef(null);
  const unsubscribeActionRef = useRef(null);
  const changeKlinesDataRef = useRef(null);
  const changeCandleTypeRef = useRef(null);
  const subscribeActionRef = useRef(null);
  const addOverlayRef = useRef(null);
  const showGridRef = useRef(null);
  const intervalRef = useRef("5m");

  var exchange = activate?.exchange;
  var start = activate?.entryTime;
  var procent = activate?.procent;
  var aggDeals = activate?.deals;
  var symbol = activate?.symbol;

  const t = Math.floor(start / 10000) * 10000;

  let lastNewKlineTimestamp = null;
  let lastOldKlineTimestamp = null;

  registerIndicator({
    name: "Buy/Sell",
    calc: (kLineDataList) =>
      kLineDataList.map((kLineData) => kLineData.timestamp),
    draw: ({ ctx, visibleRange, indicator, xAxis, yAxis }) => {
      var result = indicator.result;

      var bebra = aggDeals.map((deal) => ({
        time: roundTimeToInterval(deal.time, intervalRef.current),
        side: deal.side,
        price: deal.price,
      }));

      for (let i = visibleRange.from; i < visibleRange.to; i++) {
        bebra
          .filter((deal) => deal.time === result[i])
          .forEach((deal) => {
            const x = xAxis.convertToPixel(i);
            const y = yAxis.convertToPixel(deal.price);

            // if (deal === bebra[0]) {
            //   new LineFigure({
            //     attrs: {
            //       coordinates: [
            //         { x, y },
            //         { x: x + 10000, y },
            //       ],
            //     },
            //     styles: {
            //       style: "dashed",
            //       color: deal.side === "BUY" ? "#00B8D9" : "#FFAB00",
            //       dashedValue: [3],
            //     },
            //   }).draw(ctx);
            //   new TextFigure({
            //     attrs: {
            //       x,
            //       y,
            //       width: 1000,
            //       height: 1000,
            //       text: procent,
            //       baseline: ctx.textBaseline,
            //       align: ctx.textAlign,
            //     },
            //     styles: {
            //       color: deal.side === "BUY" ? "#00B8D9" : "#FFAB00",
            //       family: "inherit",
            //       size: 900,
            //       weight: 900,
            //     },
            //   }).draw(ctx);
            // }

            // if (deal === bebra[bebra.length - 1]) {
            //   new LineFigure({
            //     attrs: {
            //       coordinates: [
            //         { x, y },
            //         { x: x + 10000, y },
            //       ],
            //     },
            //     styles: {
            //       style: "dashed",
            //       color: deal.side === "BUY" ? "#00B8D9" : "#FFAB00",
            //       dashedValue: [3],
            //     },
            //   }).draw(ctx);
            // }

            const direction = deal.side === "BUY" ? 10 : -10;

            ctx.fillStyle = deal.side === "BUY" ? "#00B8D9" : "#FFAB00";
            ctx.beginPath();
            ctx.moveTo(x - 10, y + direction);
            ctx.lineTo(x, y - direction);
            ctx.lineTo(x + 10, y + direction);
            ctx.lineTo(x, y);
            ctx.closePath();
            ctx.fill();
          });
      }
      return false;
    },
  });

  const open = activate !== null;

  useEffect(() => {
    (async () => {
      if (open) {
        let loading = false;

        var current;
        var finishNewKlineTimestamp;
        var finishOldKlineTimestamp;
        var interval = intervalRef.current;

        var chart = init("chart");

        chart.clearData();

        switch (exchange) {
          case 1:
            await Promise.all([
              fetch(
                `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&startTime=${
                  t - 6600000
                }&endTime=${t - 600001}&interval=${interval}&limit=1500`
              ).then((res) => res.json()),
              fetch(
                `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&startTime=${
                  t - 600000
                }&endTime=${t + 5400000}&interval=${interval}&limit=1500`
              ).then((res) => res.json()),
            ]).then((res) => {
              current = res.flat();
              lastNewKlineTimestamp = t + 5400000;
              lastOldKlineTimestamp = t - 6600000;
              finishNewKlineTimestamp = Date.now();
              finishOldKlineTimestamp = t - 2388900000;
            });
            break;

          case 2:
            await Promise.all([
              fetch(
                `https://api.bybit.com/v5/market/kline?category=linear&symbol=${symbol}&start=${
                  t - 6600000
                }&end=${t - 600001}&interval=${
                  convertIntervalsForBibyt[interval]
                }&limit=1000`
              )
                .then((res) => res.json())
                .then(({ result }) => result.list.reverse()),
              fetch(
                `https://api.bybit.com/v5/market/kline?category=linear&symbol=${symbol}&start=${
                  t - 600000
                }&end=${t + 5400000}&interval=${
                  convertIntervalsForBibyt[interval]
                }&limit=1000`
              )
                .then((res) => res.json())
                .then(({ result }) => result.list.reverse()),
            ]).then((res) => {
              current = res.flat();
              lastNewKlineTimestamp = t + 5400000;
              lastOldKlineTimestamp = t - 6600000;
              finishNewKlineTimestamp = Date.now();
              finishOldKlineTimestamp = t - 2388900000;
            });
            break;

          default:
            break;
        }

        chart.applyNewData(
          current.map((kline) => ({
            timestamp: parseFloat(kline[0]),
            open: parseFloat(kline[1]),
            high: parseFloat(kline[2]),
            low: parseFloat(kline[3]),
            close: parseFloat(kline[4]),
            volume: parseFloat(kline[5]),
            turnover: parseFloat(kline[7]),
          }))
        );

        chart.subscribeAction("onVisibleRangeChange", (data) => {
          if (
            data.from < 1 &&
            loading === false &&
            lastOldKlineTimestamp > finishOldKlineTimestamp
          ) {
            (async () => {
              loading = true;
              switch (exchange) {
                case 1:
                  await fetch(
                    `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&startTime=${
                      lastOldKlineTimestamp - 33000000
                    }&endTime=${
                      lastOldKlineTimestamp - 1
                    }&interval=${interval}&limit=1500`
                  )
                    .then((res) => res.json())
                    .then((res) => {
                      chart.applyMoreData(
                        res.map((kline) => ({
                          timestamp: parseFloat(kline[0]),
                          open: parseFloat(kline[1]),
                          high: parseFloat(kline[2]),
                          low: parseFloat(kline[3]),
                          close: parseFloat(kline[4]),
                          volume: parseFloat(kline[5]),
                          turnover: parseFloat(kline[7]),
                        }))
                      );
                      lastOldKlineTimestamp -= 33000000;
                    });
                  break;

                case 2:
                  await fetch(
                    `https://api.bybit.com/v5/market/kline?category=linear&symbol=${symbol}&start=${
                      lastOldKlineTimestamp - 33000000
                    }&end=${lastOldKlineTimestamp - 1}&interval=${
                      convertIntervalsForBibyt[interval]
                    }&limit=1000`
                  )
                    .then((res) => res.json())
                    .then(({ result }) => {
                      chart.applyMoreData(
                        result.list.reverse().map((kline) => ({
                          timestamp: parseFloat(kline[0]),
                          open: parseFloat(kline[1]),
                          high: parseFloat(kline[2]),
                          low: parseFloat(kline[3]),
                          close: parseFloat(kline[4]),
                          volume: parseFloat(kline[5]),
                          turnover: parseFloat(kline[7]),
                        }))
                      );
                      lastOldKlineTimestamp -= 33000000;
                    });
                  break;

                default:
                  break;
              }
              loading = false;
            })();
          } else if (
            data.realFrom > data.from &&
            loading === false &&
            lastNewKlineTimestamp < finishNewKlineTimestamp
          ) {
            (async () => {
              loading = true;
              switch (exchange) {
                case 1:
                  await fetch(
                    `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&startTime=${
                      lastNewKlineTimestamp + 1
                    }&endTime=${
                      lastNewKlineTimestamp + 27000000
                    }&interval=${interval}&limit=1000`
                  )
                    .then((res) => res.json())
                    .then((res) => {
                      res.forEach((kline) => {
                        chart.updateData({
                          timestamp: kline[0],
                          open: kline[1],
                          high: kline[2],
                          low: kline[3],
                          close: kline[4],
                          volume: kline[5],
                          turnover: kline[7],
                        });
                      });
                      chart.scrollToTimestamp(res[10]?.[0]);
                      lastNewKlineTimestamp += 27000000;
                    });
                  break;

                case 2:
                  await fetch(
                    `https://api.bybit.com/v5/market/kline?category=linear&symbol=${symbol}&start=${
                      lastNewKlineTimestamp + 1
                    }&end=${lastNewKlineTimestamp + 27000000}&interval=${
                      convertIntervalsForBibyt[interval]
                    }&limit=1000`
                  )
                    .then((res) => res.json())
                    .then(({ result }) => {
                      result.list.reverse().forEach((kline) => {
                        chart.updateData({
                          timestamp: parseFloat(kline[0]),
                          open: parseFloat(kline[1]),
                          high: parseFloat(kline[2]),
                          low: parseFloat(kline[3]),
                          close: parseFloat(kline[4]),
                          volume: parseFloat(kline[5]),
                          turnover: parseFloat(kline[7]),
                        });
                      });
                      chart.scrollToTimestamp(result.list.reverse()[10]?.[0]);
                      lastNewKlineTimestamp += 27000000;
                    });
                  break;

                default:
                  break;
              }
              loading = false;
            })();
          }
        });

        chart.createIndicator("Buy/Sell", true, { id: "candle_pane" });

        chart.setPriceVolumePrecision(5, 3);

        chart.setLocale("ru");

        chart.setStyles({
          grid: {
            show: JSON.parse(localStorage.getItem("statusGrid")) ?? true,
            horizontal: {
              color: "rgba(145, 158, 171, 0.2)",
            },
            vertical: {
              color: "rgba(145, 158, 171, 0.2)",
            },
          },
          overlay: {
            polygon: {
              // 'fill' | 'stroke' | 'stroke_fill'
              style: "fill",
              color: "rgba(145, 158, 171, 0.2)",
              borderColor: "#1677FF",
              borderSize: 1,
              // 'solid' | 'dashed'
              borderStyle: "solid",
              borderDashedValue: [2, 2],
            },
          },
          candle: {
            type: localStorage.getItem("candleType") ?? "candle_solid",
            priceMark: {
              high: {
                textFamily: "inherit",
              },
              low: {
                textFamily: "inherit",
              },
              last: {
                text: {
                  family: "inherit",
                },
              },
            },
            tooltip: {
              text: {
                family: "inherit",
              },
            },
          },
          indicator: {
            lastValueMark: {
              text: {
                family: "inherit",
              },
            },
            tooltip: {
              text: {
                family: "inherit",
              },
            },
          },
          xAxis: {
            tickText: {
              family: "inherit",
            },
          },
          yAxis: {
            tickText: {
              family: "inherit",
            },
          },
          crosshair: {
            horizontal: {
              text: {
                family: "inherit",
              },
            },
            vertical: {
              text: {
                family: "inherit",
              },
            },
          },
          overlay: {
            text: {
              family: "inherit",
            },
            rectText: {
              family: "inherit",
            },
          },
        });

        addOverlayRef.current = (params) => {
          chart.createOverlay(params);
        };

        showGridRef.current = (params) => {
          if (params === true) {
            chart.setStyles({
              grid: {
                show: true,
              },
            });
          } else {
            chart.setStyles({
              grid: {
                show: false,
              },
            });
          }
        };

        changeCandleTypeRef.current = (params) => {
          chart.setStyles({
            candle: {
              type: params,
            },
          });
        };

        unsubscribeActionRef.current = () => {
          chart.unsubscribeAction("onVisibleRangeChange");
        };

        subscribeActionRef.current = (params) => {
          chart.subscribeAction("onVisibleRangeChange", (data) => {
            if (
              data.from < 1 &&
              loading === false &&
              lastOldKlineTimestamp > finishOldKlineTimestamp
            ) {
              (async () => {
                loading = true;
                switch (exchange) {
                  case 1:
                    await axios
                      .get(
                        `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&startTime=${
                          lastOldKlineTimestamp - subDataStartTimestaps[params]
                        }&endTime=${
                          lastOldKlineTimestamp - 1
                        }&interval=${params}&limit=1000`
                      )
                      .then((res) => {
                        chart.applyMoreData(
                          res.data.map((kline) => ({
                            timestamp: parseFloat(kline[0]),
                            open: parseFloat(kline[1]),
                            high: parseFloat(kline[2]),
                            low: parseFloat(kline[3]),
                            close: parseFloat(kline[4]),
                            volume: parseFloat(kline[5]),
                            turnover: parseFloat(kline[7]),
                          }))
                        );
                        lastOldKlineTimestamp -= subDataStartTimestaps[params];
                      });
                    break;

                  case 2:
                    await axios
                      .get(
                        `https://api.bybit.com/v5/market/kline?category=linear&symbol=${symbol}&start=${
                          lastOldKlineTimestamp - subDataStartTimestaps[params]
                        }&end=${lastOldKlineTimestamp - 1}&interval=${
                          convertIntervalsForBibyt[params]
                        }&limit=1000`
                      )
                      .then((res) => {
                        chart.applyMoreData(
                          res.data.result.list.reverse().map((kline) => ({
                            timestamp: parseFloat(kline[0]),
                            open: parseFloat(kline[1]),
                            high: parseFloat(kline[2]),
                            low: parseFloat(kline[3]),
                            close: parseFloat(kline[4]),
                            volume: parseFloat(kline[5]),
                            turnover: parseFloat(kline[7]),
                          }))
                        );
                        lastOldKlineTimestamp -= subDataStartTimestaps[params];
                      });
                    break;

                  default:
                    break;
                }
                loading = false;
              })();
            } else if (
              data.realFrom > data.from &&
              loading === false &&
              lastNewKlineTimestamp < finishNewKlineTimestamp
            ) {
              (async () => {
                loading = true;
                switch (exchange) {
                  case 1:
                    await axios
                      .get(
                        `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&startTime=${
                          lastNewKlineTimestamp + 1
                        }&endTime=${
                          lastNewKlineTimestamp + mainDataEndTimestaps[params]
                        }&interval=${params}&limit=1500`
                      )
                      .then((res) => {
                        res.data.forEach((kline) => {
                          chart.updateData({
                            timestamp: parseFloat(kline[0]),
                            open: parseFloat(kline[1]),
                            high: parseFloat(kline[2]),
                            low: parseFloat(kline[3]),
                            close: parseFloat(kline[4]),
                            volume: parseFloat(kline[5]),
                            turnover: parseFloat(kline[7]),
                          });
                        });
                        lastNewKlineTimestamp += mainDataEndTimestaps[params];
                      });
                    break;

                  case 2:
                    await axios
                      .get(
                        `https://api.bybit.com/v5/market/kline?category=linear&symbol=${symbol}&start=${
                          lastNewKlineTimestamp + 1
                        }&end=${
                          lastNewKlineTimestamp + mainDataEndTimestaps[params]
                        }&interval=${
                          convertIntervalsForBibyt[params]
                        }&limit=1000`
                      )
                      .then((res) => {
                        res.data.result.list.reverse().forEach((kline) => {
                          chart.updateData({
                            timestamp: parseFloat(kline[0]),
                            open: parseFloat(kline[1]),
                            high: parseFloat(kline[2]),
                            low: parseFloat(kline[3]),
                            close: parseFloat(kline[4]),
                            volume: parseFloat(kline[5]),
                            turnover: parseFloat(kline[7]),
                          });
                        });
                        lastNewKlineTimestamp += mainDataEndTimestaps[params];
                      });
                    break;

                  default:
                    break;
                }
                loading = false;
              })();
            }
          });
        };

        installMainIndicatorRef.current = (params) => {
          chart.createIndicator(params, true, { id: "candle_pane" });
        };

        removeMainIndicatorRef.current = (params) => {
          chart.removeIndicator("candle_pane", params);
        };

        installSubIndicatorRef.current = (params) => {
          chart.createIndicator(params[0], false, { id: params[1] });
        };

        removeSubIndicatorRef.current = (params) => {
          chart.removeIndicator(params[1], params[0]);
        };

        changeKlinesDataRef.current = (params) => {
          chart.applyNewData(
            params.map((kline) => ({
              timestamp: parseFloat(kline[0]),
              open: parseFloat(kline[1]),
              high: parseFloat(kline[2]),
              low: parseFloat(kline[3]),
              close: parseFloat(kline[4]),
              volume: parseFloat(kline[5]),
              turnover: parseFloat(kline[7]),
            }))
          );
        };
      }
    })();
    return () => {
      dispose("chart");
    };
  }, [activate]);

  return (
    open && (
      <Card className={styles.card}>
        <div className={styles.stack}>
          <Typography variant="h4">{procent + "% " + symbol}</Typography>
          <FormControl>
            <RadioGroup
              row
              defaultValue={intervalRef.current}
              onChange={async (e) => {
                const interval = e.target.value;
                intervalRef.current = interval;
                unsubscribeActionRef.current();
                switch (exchange) {
                  case 1:
                    await Promise.all([
                      fetch(
                        `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&startTime=${
                          t - subDataStartTimestaps[interval]
                        }&endTime=${
                          t - subDataEndTimestaps[interval]
                        }&interval=${interval}&limit=1500`
                      ).then((res) => res.json()),
                      fetch(
                        `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&startTime=${
                          t - mainDataStartTimestaps[interval]
                        }&endTime=${
                          t + mainDataEndTimestaps[interval]
                        }&interval=${interval}&limit=1500`
                      ).then((res) => res.json()),
                    ]).then((res) => {
                      changeKlinesDataRef.current(res.flat());
                      lastNewKlineTimestamp =
                        t + mainDataEndTimestaps[interval];
                      lastOldKlineTimestamp =
                        t - subDataStartTimestaps[interval];
                    });
                    break;

                  case 2:
                    await Promise.all([
                      fetch(
                        `https://api.bybit.com/v5/market/kline?category=linear&symbol=${symbol}&start=${
                          t - subDataStartTimestaps[interval]
                        }&end=${t - subDataEndTimestaps[interval]}&interval=${
                          convertIntervalsForBibyt[interval]
                        }&limit=1000`
                      )
                        .then((res) => res.json())
                        .then(({ result }) => result.list.reverse()),
                      fetch(
                        `https://api.bybit.com/v5/market/kline?category=linear&symbol=${symbol}&start=${
                          t - mainDataStartTimestaps[interval]
                        }&end=${t + mainDataEndTimestaps[interval]}&interval=${
                          convertIntervalsForBibyt[interval]
                        }&limit=1000`
                      )
                        .then((res) => res.json())
                        .then(({ result }) => result.list.reverse()),
                    ]).then((res) => {
                      changeKlinesDataRef.current(res.flat());
                      lastNewKlineTimestamp =
                        t + mainDataEndTimestaps[interval];
                      lastOldKlineTimestamp =
                        t - subDataStartTimestaps[interval];
                    });
                    break;

                  default:
                    break;
                }
                subscribeActionRef.current(interval);
              }}
            >
              <FormControlLabel value="1m" control={<Radio />} label="1м" />
              <FormControlLabel value="3m" control={<Radio />} label="3м" />
              <FormControlLabel value="5m" control={<Radio />} label="5м" />
              <FormControlLabel value="30m" control={<Radio />} label="30м" />
              <FormControlLabel value="1h" control={<Radio />} label="1ч" />
              <FormControlLabel value="2h" control={<Radio />} label="2ч" />
              <FormControlLabel value="6h" control={<Radio />} label="6ч" />
              <FormControlLabel value="1d" control={<Radio />} label="1д" />
              <FormControlLabel value="3d" control={<Radio />} label="3д" />
              <FormControlLabel value="1w" control={<Radio />} label="1н" />
            </RadioGroup>
          </FormControl>
          <div className={styles.row}>
            <Indicators
              installMainIndicatorRef={installMainIndicatorRef}
              removeMainIndicatorRef={removeMainIndicatorRef}
              installSubIndicatorRef={installSubIndicatorRef}
              removeSubIndicatorRef={removeSubIndicatorRef}
            />
            <Settings
              changeCandleTypeRef={changeCandleTypeRef}
              showGridRef={showGridRef}
            />
            <Close setActivate={setActivate} />
          </div>
        </div>
        <div className={styles.flex}>
          <div className={styles.tools}>
            <Lines addOverlay={addOverlayRef} />
            <Divider />
            <Figures addOverlay={addOverlayRef} />
            <Divider />
            <Annotations addOverlay={addOverlayRef} />
            <Divider />
            <Cuts addOverlay={addOverlayRef} />
            <Divider />
            <Lineup addOverlay={addOverlayRef} />
          </div>
          <div id="chart" className={styles.chart} />
        </div>
      </Card>
    )
  );
}
