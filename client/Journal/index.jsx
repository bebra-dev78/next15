"use client";

import FormControlLabel from "@mui/material/FormControlLabel";
import LinearProgress from "@mui/material/LinearProgress";
import ListItemButton from "@mui/material/ListItemButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import NativeSelect from "@mui/material/NativeSelect";
import FormControl from "@mui/material/FormControl";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import LoadingButton from "@mui/lab/LoadingButton";
import RadioGroup from "@mui/material/RadioGroup";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";

import React, { useState, useEffect, useRef } from "react";
import { init, dispose, registerIndicator } from "klinecharts";
import { Tree, TreeNode } from "react-organizational-chart";
// import { motion, AnimatePresence } from "framer-motion";
import { DateTime } from "luxon";
import axios from "axios";

import CounterBox from "#/components/counter-box";
import useFormat from "#/utils/format-thousands";
import { useUser } from "#/app/my/layout";
import "#/configs/klinecharts";
import {
  LineFigure,
  OptionsMenu,
  HeaderIndicators,
  subDataEndTimestaps,
  roundTimeToInterval,
  mainDataEndTimestaps,
  subDataStartTimestaps,
  mainDataStartTimestaps,
} from "#/configs/klinecharts";

import styles from "./index.module.css";

function KlineChartTreeNode({ trades }) {
  const isSmallScreen = useMediaQuery("(max-width:900px)");

  const tradesBySymbol = {};

  trades.forEach((trade) => {
    if (tradesBySymbol.hasOwnProperty(trade.symbol)) {
      tradesBySymbol[trade.symbol].push(trade);
    } else {
      tradesBySymbol[trade.symbol] = [trade];
    }
  });

  // console.log("tradesBySymbol: ", tradesBySymbol);

  const tickers = Object.keys(tradesBySymbol);

  const [selectTicker, setSelectTicker] = useState(tickers[0]);

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

  var exchange = tradesBySymbol[selectTicker][0].exchange;
  var aggDeals = tradesBySymbol[selectTicker]
    .map((trade) => JSON.parse(trade.deals))
    .flat();
  var symbol = selectTicker;
  var start = parseInt(tradesBySymbol[selectTicker][0].entry_time);

  const t = Math.floor(start / 10000) * 10000;

  let lastNewKlineTimestamp = null;
  let lastOldKlineTimestamp = null;

  // console.log("exchange: ", exchange);
  // console.log("aggDeals: ", aggDeals);
  // console.log("symbol: ", symbol);
  // console.log("start: ", start);

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
        var deals = bebra.filter((deal) => deal.time === result[i]);

        deals.forEach((deal) => {
          var x = xAxis.convertToPixel(i);
          var y = yAxis.convertToPixel(deal.price);

          if (deal === bebra[0]) {
            new LineFigure({
              attrs: {
                coordinates: [
                  { x, y },
                  { x: x + 10000, y },
                ],
              },
              styles: {
                style: "dashed",
                color: deal.side === "BUY" ? "#00B8D9" : "#FFAB00",
                dashedValue: [3],
              },
            }).draw(ctx);
          }

          if (deal === bebra[bebra.length - 1]) {
            new LineFigure({
              attrs: {
                coordinates: [
                  { x, y },
                  { x: x + 10000, y },
                ],
              },
              styles: {
                style: "dashed",
                color: deal.side === "BUY" ? "#00B8D9" : "#FFAB00",
                dashedValue: [3],
              },
            }).draw(ctx);
          }

          var direction = deal.side === "BUY" ? 1 : -1;

          ctx.fillStyle = deal.side === "BUY" ? "#00B8D9" : "#FFAB00";
          ctx.beginPath();
          ctx.moveTo(x - 10, y + direction * 10);
          ctx.lineTo(x, y - direction * 10);
          ctx.lineTo(x + 10, y + direction * 10);
          ctx.lineTo(x, y);
          ctx.closePath();
          ctx.fill();
        });
      }
      return false;
    },
  });

  useEffect(() => {
    (async () => {
      if (open) {
        let loading = false;

        var current;
        var finishNewKlineTimestamp;
        var finishOldKlineTimestamp;
        var interval = intervalRef.current;

        var chart = init(`chart-${start}-${selectTicker}`);

        chart.clearData();

        switch (exchange) {
          case 1:
            await Promise.all([
              axios.get(
                `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&startTime=${
                  t - 6600000
                }&endTime=${t - 600001}&interval=${interval}&limit=1500`
              ),
              axios.get(
                `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&startTime=${
                  t - 600000
                }&endTime=${t + 5400000}&interval=${interval}&limit=1500`
              ),
            ]).then((res) => {
              current = [].concat(...res.map((res) => res.data));
              lastNewKlineTimestamp = t + 5400000;
              lastOldKlineTimestamp = t - 6600000;
              finishNewKlineTimestamp = Date.now();
              finishOldKlineTimestamp = t - 2388900000;
            });
            break;

          case 2:
            await Promise.all([
              axios
                .get(
                  `https://api.bybit.com/v5/market/kline?category=linear&symbol=${symbol}&start=${
                    t - 6600000
                  }&end=${t - 600001}&interval=${
                    convertIntervalsForBibyt[interval]
                  }&limit=1000`
                )
                .then((res) => res.data.result.list.reverse()),
              axios
                .get(
                  `https://api.bybit.com/v5/market/kline?category=linear&symbol=${symbol}&start=${
                    t - 600000
                  }&end=${t + 5400000}&interval=${
                    convertIntervalsForBibyt[interval]
                  }&limit=1000`
                )
                .then((res) => res.data.result.list.reverse()),
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

        chart.scrollToTimestamp(start);

        chart.setOffsetRightDistance(200);

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
                        lastOldKlineTimestamp - 33000000
                      }&endTime=${
                        lastOldKlineTimestamp - 1
                      }&interval=${interval}&limit=1500`
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
                      lastOldKlineTimestamp -= 33000000;
                    });
                  break;

                case 2:
                  await axios
                    .get(
                      `https://api.bybit.com/v5/market/kline?category=linear&symbol=${symbol}&start=${
                        lastOldKlineTimestamp - 33000000
                      }&end=${lastOldKlineTimestamp - 1}&interval=${
                        convertIntervalsForBibyt[interval]
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
                  await axios
                    .get(
                      `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&startTime=${
                        lastNewKlineTimestamp + 1
                      }&endTime=${
                        lastNewKlineTimestamp + 27000000
                      }&interval=${interval}&limit=1000`
                    )
                    .then((res) => {
                      res.data.forEach((kline) => {
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
                      lastNewKlineTimestamp += 27000000;
                    });
                  break;

                case 2:
                  await axios
                    .get(
                      `https://api.bybit.com/v5/market/kline?category=linear&symbol=${symbol}&start=${
                        lastNewKlineTimestamp + 1
                      }&end=${lastNewKlineTimestamp + 27000000}&interval=${
                        convertIntervalsForBibyt[interval]
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
            show: JSON.parse(localStorage.getItem("statusGrid")) ?? false,
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
      dispose(`chart-${start}-${selectTicker}`);
    };
  }, [selectTicker]);

  return (
    <TreeNode
      label={
        <Card className="ybxeg">
          <div className="fheci">
            <Typography variant="subtitle1" gutterBottom>
              Тикеры
            </Typography>
            <Divider className="qdxht" />
            {tickers.map((ticker) => (
              <ListItemButton
                key={ticker}
                onClick={() => {
                  setSelectTicker(ticker);
                }}
                sx={{
                  color:
                    ticker === selectTicker ? "text.primary" : "text.secondary",
                  backgroundColor:
                    ticker === selectTicker
                      ? "rgba(145, 158, 171, 0.16)"
                      : "transparent",
                  "&:hover": {
                    backgroundColor: "rgba(145, 158, 171, 0.08)",
                  },
                }}
              >
                <Typography variant="caption" className="vehnv">
                  {ticker} ({tradesBySymbol[ticker].length})
                </Typography>
              </ListItemButton>
            ))}
          </div>
          <div className="uwifr">
            <div className="jsslm">
              {isSmallScreen ? (
                <NativeSelect
                  defaultValue={intervalRef.current}
                  onChange={(e) => {
                    const interval = e.target.value;
                    intervalRef.current = interval;
                    (async () => {
                      unsubscribeActionRef.current();
                      switch (exchange) {
                        case 1:
                          await Promise.all([
                            axios.get(
                              `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&startTime=${
                                t - subDataStartTimestaps[interval]
                              }&endTime=${
                                t - subDataEndTimestaps[interval]
                              }&interval=${interval}&limit=1500`
                            ),
                            axios.get(
                              `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&startTime=${
                                t - mainDataStartTimestaps[interval]
                              }&endTime=${
                                t + mainDataEndTimestaps[interval]
                              }&interval=${interval}&limit=1500`
                            ),
                          ]).then((res) => {
                            changeKlinesDataRef.current(
                              [].concat(...res.map((res) => res.data))
                            );
                            lastNewKlineTimestamp =
                              t + mainDataEndTimestaps[interval];
                            lastOldKlineTimestamp =
                              t - subDataStartTimestaps[interval];
                          });
                          break;

                        case 2:
                          await Promise.all([
                            axios
                              .get(
                                `https://api.bybit.com/v5/market/kline?category=linear&symbol=${symbol}&start=${
                                  t - subDataStartTimestaps[interval]
                                }&end=${
                                  t - subDataEndTimestaps[interval]
                                }&interval=${
                                  convertIntervalsForBibyt[interval]
                                }&limit=1000`
                              )
                              .then((res) => res.data.result.list.reverse()),
                            axios
                              .get(
                                `https://api.bybit.com/v5/market/kline?category=linear&symbol=${symbol}&start=${
                                  t - mainDataStartTimestaps[interval]
                                }&end=${
                                  t + mainDataEndTimestaps[interval]
                                }&interval=${
                                  convertIntervalsForBibyt[interval]
                                }&limit=1000`
                              )
                              .then((res) => res.data.result.list.reverse()),
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
                    })();
                  }}
                >
                  <option value="1m" label="1м" />
                  <option value="3m" label="3м" />
                  <option value="5m" label="5м" />
                  <option value="30m" label="30м" />
                  <option value="1h" label="1ч" />
                  <option value="2h" label="2ч" />
                  <option value="6h" label="6ч" />
                  <option value="1d" label="1д" />
                  <option value="3d" label="3д" />
                  <option value="1w" label="1н" />
                </NativeSelect>
              ) : (
                <FormControl>
                  <RadioGroup
                    row
                    defaultValue={intervalRef.current}
                    onChange={(e) => {
                      const interval = e.target.value;
                      intervalRef.current = interval;
                      (async () => {
                        unsubscribeActionRef.current();
                        switch (exchange) {
                          case 1:
                            await Promise.all([
                              axios.get(
                                `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&startTime=${
                                  t - subDataStartTimestaps[interval]
                                }&endTime=${
                                  t - subDataEndTimestaps[interval]
                                }&interval=${interval}&limit=1500`
                              ),
                              axios.get(
                                `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&startTime=${
                                  t - mainDataStartTimestaps[interval]
                                }&endTime=${
                                  t + mainDataEndTimestaps[interval]
                                }&interval=${interval}&limit=1500`
                              ),
                            ]).then((res) => {
                              changeKlinesDataRef.current(
                                [].concat(...res.map((res) => res.data))
                              );
                              lastNewKlineTimestamp =
                                t + mainDataEndTimestaps[interval];
                              lastOldKlineTimestamp =
                                t - subDataStartTimestaps[interval];
                            });
                            break;

                          case 2:
                            await Promise.all([
                              axios
                                .get(
                                  `https://api.bybit.com/v5/market/kline?category=linear&symbol=${symbol}&start=${
                                    t - subDataStartTimestaps[interval]
                                  }&end=${
                                    t - subDataEndTimestaps[interval]
                                  }&interval=${
                                    convertIntervalsForBibyt[interval]
                                  }&limit=1000`
                                )
                                .then((res) => res.data.result.list.reverse()),
                              axios
                                .get(
                                  `https://api.bybit.com/v5/market/kline?category=linear&symbol=${symbol}&start=${
                                    t - mainDataStartTimestaps[interval]
                                  }&end=${
                                    t + mainDataEndTimestaps[interval]
                                  }&interval=${
                                    convertIntervalsForBibyt[interval]
                                  }&limit=1000`
                                )
                                .then((res) => res.data.result.list.reverse()),
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
                      })();
                    }}
                  >
                    <FormControlLabel
                      value="1m"
                      control={<Radio />}
                      label="1м"
                    />
                    <FormControlLabel
                      value="3m"
                      control={<Radio />}
                      label="3м"
                    />
                    <FormControlLabel
                      value="5m"
                      control={<Radio />}
                      label="5м"
                    />
                    <FormControlLabel
                      value="30m"
                      control={<Radio />}
                      label="30м"
                    />
                    <FormControlLabel
                      value="1h"
                      control={<Radio />}
                      label="1ч"
                    />
                    <FormControlLabel
                      value="2h"
                      control={<Radio />}
                      label="2ч"
                    />
                    <FormControlLabel
                      value="6h"
                      control={<Radio />}
                      label="6ч"
                    />
                    <FormControlLabel
                      value="1d"
                      control={<Radio />}
                      label="1д"
                    />
                    <FormControlLabel
                      value="3d"
                      control={<Radio />}
                      label="3д"
                    />
                    <FormControlLabel
                      value="1w"
                      control={<Radio />}
                      label="1н"
                    />
                  </RadioGroup>
                </FormControl>
              )}
              <HeaderIndicators
                installMainIndicatorRef={installMainIndicatorRef}
                removeMainIndicatorRef={removeMainIndicatorRef}
                installSubIndicatorRef={installSubIndicatorRef}
                removeSubIndicatorRef={removeSubIndicatorRef}
              />
              <OptionsMenu
                changeCandleTypeRef={changeCandleTypeRef}
                showGridRef={showGridRef}
              />
            </div>
            <div style={{ display: "flex" }}>
              <Stack className="gxziz">
                <Lines addOverlay={addOverlayRef} />
                <Divider />
                <Figures addOverlay={addOverlayRef} />
                <Divider />
                <Annotations addOverlay={addOverlayRef} />
                <Divider />
                <Cuts addOverlay={addOverlayRef} />
                <Divider />
                <Lineup addOverlay={addOverlayRef} />
              </Stack>
              <Box
                key={selectTicker}
                id={`chart-${start}-${selectTicker}`}
                style={{
                  height: "75vh",
                  width: "100%",
                }}
              />
            </div>
          </div>
        </Card>
      }
    />
  );
}

function DayTreeNode({
  trades,
  children,
  setValue,
  timestamp,
  setCurrentData,
}) {
  const { length } = trades;

  const profit = trades.reduce((a, t) => a + t.profit, 0);

  const profitableTrades = trades.filter((t) => t.profit >= 0);

  const losingTrades = trades.filter((t) => t.profit < 0);

  return (
    <TreeNode
      label={
        <Card className={styles.card}>
          <Box
            className={styles.separator}
            style={{
              backgroundColor:
                profit === 0
                  ? "text.disabled"
                  : profit > 0
                  ? "primary.main"
                  : "error.main",
            }}
          />
          <Stack className={styles.gap}>
            <div className={styles.stack}>
              <CounterBox
                count={DateTime.fromMillis(timestamp).toLocaleString({
                  weekday: "long",
                  day: "numeric",
                  month: "short",
                })}
              />
            </div>
            <div className={styles.grid}>
              <div>
                <Typography variant="caption" color="text.secondary">
                  Чистая прибыль
                </Typography>
                <Typography className={styles.pt} variant="subtitle1">
                  {useFormat(profit.toFixed(2))}$
                </Typography>
              </div>
              <div>
                <Typography variant="caption" color="text.secondary">
                  Сделки
                </Typography>
                <Typography className={styles.pt} variant="subtitle1">
                  {length}
                </Typography>
              </div>
              <div>
                <Typography variant="caption" color="text.secondary">
                  Объём
                </Typography>
                <Typography className={styles.pt} variant="subtitle1">
                  {useFormat(
                    trades.reduce((a, t) => a + t.volume, 0).toFixed(0)
                  )}
                  $
                </Typography>
              </div>
              <div>
                <Typography variant="caption" color="text.secondary">
                  Процент побед
                </Typography>
                <Typography className={styles.pt} variant="subtitle1">
                  {(
                    (profitableTrades.length / Math.max(1, length)) *
                    100
                  ).toFixed(2)}
                  %
                </Typography>
              </div>
              <div>
                <Typography variant="caption" color="text.secondary">
                  Комиссия
                </Typography>
                <Typography className={styles.pt} variant="subtitle1">
                  {useFormat(
                    trades.reduce((a, t) => a + t.commission, 0).toFixed(2)
                  )}
                  $
                </Typography>
              </div>
              <div>
                <Typography variant="caption" color="text.secondary">
                  Среднее плечо
                </Typography>
                <Typography className={styles.pt} variant="subtitle1">
                  x
                  {(
                    trades
                      .filter((t) => t.deposit >= 1)
                      .reduce(
                        (a, t) => a + Math.max(0, t.volume / 2) / t.deposit,
                        0
                      ) / Math.max(1, length)
                  ).toFixed(2)}
                </Typography>
              </div>
              <div>
                <Typography variant="caption" color="text.secondary">
                  Средняя прибыль
                </Typography>
                <Typography className={styles.pt} variant="subtitle1">
                  {(
                    profitableTrades.reduce((a, t) => a + t.profit, 0) /
                    Math.max(1, profitableTrades.length)
                  ).toFixed(2)}
                  $
                </Typography>
              </div>
              <div>
                <Typography variant="caption" color="text.secondary">
                  Средний убыток
                </Typography>
                <Typography className={styles.pt} variant="subtitle1">
                  {(
                    losingTrades.reduce((a, t) => a - t.profit, 0) /
                    Math.max(1, losingTrades.length)
                  ).toFixed(2)}
                  $
                </Typography>
              </div>
              <div>
                <Typography variant="caption" color="text.secondary">
                  Long/Short
                </Typography>
                <Typography className={styles.pt} variant="subtitle1">
                  {(
                    (trades.filter((t) => t.side === "BUY").length /
                      Math.max(1, length)) *
                    100
                  ).toFixed()}
                  % |{" "}
                  {(
                    (trades.filter((t) => t.side === "SELL").length /
                      Math.max(1, length)) *
                    100
                  ).toFixed()}
                  %
                </Typography>
              </div>
            </div>
            <Button
              variant={trades.length === 0 ? "contained" : "soft"}
              size="small"
              color="info"
              fullWidth
              disabled={trades.length === 0}
              onClick={() => {
                setValue("day");
                setCurrentData(trades);
              }}
            >
              Анализ дня
            </Button>
          </Stack>
        </Card>
      }
    >
      {children}
    </TreeNode>
  );
}

function WeekTreeNode({
  trades,
  children,
  setValue,
  setStartWeek,
  endTimestamp,
  startTimestamp,
  setCurrentData,
}) {
  const { length } = trades;

  const profit = trades.reduce((a, t) => a + t.profit, 0);

  const profitableTrades = trades.filter((t) => t.profit >= 0);

  const losingTrades = trades.filter((t) => t.profit < 0);

  return (
    <TreeNode
      label={
        <Card className={styles.card}>
          <Box
            className={styles.border_box}
            style={{
              backgroundColor:
                profit === 0
                  ? "text.disabled"
                  : profit > 0
                  ? "primary.main"
                  : "error.main",
            }}
          />
          <Stack className={styles.gap}>
            <div className={styles.stack}>
              <CounterBox
                count={`${DateTime.fromMillis(startTimestamp).toLocaleString({
                  month: "short",
                  day: "numeric",
                })} - ${DateTime.fromMillis(endTimestamp).toLocaleString({
                  month: "short",
                  day: "numeric",
                })}`}
              />
            </div>
            <div className={styles.grid}>
              <div>
                <Typography variant="caption" color="text.secondary">
                  Чистая прибыль
                </Typography>
                <Typography className={styles.pt} variant="subtitle1">
                  {useFormat(profit.toFixed(2))}$
                </Typography>
              </div>
              <div>
                <Typography variant="caption" color="text.secondary">
                  Сделки
                </Typography>
                <Typography className={styles.pt} variant="subtitle1">
                  {length}
                </Typography>
              </div>
              <div>
                <Typography variant="caption" color="text.secondary">
                  Объём
                </Typography>
                <Typography className={styles.pt} variant="subtitle1">
                  {useFormat(
                    trades.reduce((a, t) => a + t.volume, 0).toFixed(0)
                  )}
                  $
                </Typography>
              </div>
              <div>
                <Typography variant="caption" color="text.secondary">
                  Процент побед
                </Typography>
                <Typography className={styles.pt} variant="subtitle1">
                  {(
                    (profitableTrades.length / Math.max(1, length)) *
                    100
                  ).toFixed(2)}
                  %
                </Typography>
              </div>
              <div>
                <Typography variant="caption" color="text.secondary">
                  Комиссия
                </Typography>
                <Typography className={styles.pt} variant="subtitle1">
                  {useFormat(
                    trades.reduce((a, t) => a + t.commission, 0).toFixed(2)
                  )}
                  $
                </Typography>
              </div>
              <div>
                <Typography variant="caption" color="text.secondary">
                  Среднее плечо
                </Typography>
                <Typography className={styles.pt} variant="subtitle1">
                  x
                  {(
                    trades
                      .filter((t) => t.deposit >= 1)
                      .reduce(
                        (a, t) => a + Math.max(0, t.volume / 2) / t.deposit,
                        0
                      ) / Math.max(1, length)
                  ).toFixed(2)}
                </Typography>
              </div>
              <div>
                <Typography variant="caption" color="text.secondary">
                  Средняя прибыль
                </Typography>
                <Typography className={styles.pt} variant="subtitle1">
                  {(
                    profitableTrades.reduce((a, t) => a + t.profit, 0) /
                    Math.max(1, profitableTrades.length)
                  ).toFixed(2)}
                  $
                </Typography>
              </div>
              <div>
                <Typography variant="caption" color="text.secondary">
                  Средний убыток
                </Typography>
                <Typography className={styles.pt} variant="subtitle1">
                  {(
                    losingTrades.reduce((a, t) => a - t.profit, 0) /
                    Math.max(1, losingTrades.length)
                  ).toFixed(2)}
                  $
                </Typography>
              </div>
              <div>
                <Typography variant="caption" color="text.secondary">
                  Long | Short
                </Typography>
                <Typography className={styles.pt} variant="subtitle1">
                  {(
                    (trades.filter((t) => t.side === "BUY").length /
                      Math.max(1, length)) *
                    100
                  ).toFixed()}
                  % |{" "}
                  {(
                    (trades.filter((t) => t.side === "SELL").length /
                      Math.max(1, length)) *
                    100
                  ).toFixed()}
                  %
                </Typography>
              </div>
            </div>
            <Button
              variant={length === 0 ? "contained" : "soft"}
              size="small"
              color="info"
              fullWidth
              disabled={length === 0}
              onClick={() => {
                setStartWeek(startTimestamp);
                setCurrentData(trades);
                setValue("week");
              }}
            >
              Анализ недели
            </Button>
          </Stack>
        </Card>
      }
    >
      {children}
    </TreeNode>
  );
}

function RootTreeNode({ currentData }) {
  const { length } = currentData;

  const profitableTrades = currentData.filter((t) => t.profit >= 0);

  const losingTrades = currentData.filter((t) => t.profit < 0);

  return (
    <TreeNode
      label={
        <Card className={styles.card}>
          <Box
            className={styles.border_box}
            sx={{
              backgroundColor: "text.secondary",
            }}
          />
          <div className={styles.grid}>
            <div>
              <Typography variant="caption" color="text.secondary">
                Чистая прибыль
              </Typography>
              <Typography className={styles.pt} variant="subtitle1">
                {useFormat(
                  currentData
                    .reduce((acc, trade) => acc + trade.profit, 0)
                    .toFixed(2)
                )}
                $
              </Typography>
            </div>
            <div>
              <Typography variant="caption" color="text.secondary">
                Сделки
              </Typography>
              <Typography className={styles.pt} variant="subtitle1">
                {length}
              </Typography>
            </div>
            <div>
              <Typography variant="caption" color="text.secondary">
                Объём
              </Typography>
              <Typography className={styles.pt} variant="subtitle1">
                {useFormat(
                  currentData
                    .reduce((acc, trade) => acc + trade.volume, 0)
                    .toFixed(0)
                )}
                $
              </Typography>
            </div>
            <div>
              <Typography variant="caption" color="text.secondary">
                Процент побед
              </Typography>
              <Typography className={styles.pt} variant="subtitle1">
                {(
                  (profitableTrades.length / Math.max(1, length)) *
                  100
                ).toFixed(2)}
                %
              </Typography>
            </div>
            <div>
              <Typography variant="caption" color="text.secondary">
                Комиссия
              </Typography>
              <Typography className={styles.pt} variant="subtitle1">
                {useFormat(
                  currentData.reduce((a, t) => a + t.commission, 0).toFixed(2)
                )}
                $
              </Typography>
            </div>
            <div>
              <Typography variant="caption" color="text.secondary">
                Среднее плечо
              </Typography>
              <Typography className={styles.pt} variant="subtitle1">
                x
                {(
                  currentData
                    .filter((t) => t.deposit >= 1)
                    .reduce(
                      (a, t) => a + Math.max(0, t.volume / 2) / t.deposit,
                      0
                    ) / Math.max(1, length)
                ).toFixed(2)}
              </Typography>
            </div>
            <div>
              <Typography variant="caption" color="text.secondary">
                Средняя прибыль
              </Typography>
              <Typography className={styles.pt} variant="subtitle1">
                {(
                  profitableTrades.reduce((a, t) => a + t.profit, 0) /
                  Math.max(1, profitableTrades.length)
                ).toFixed(2)}
                $
              </Typography>
            </div>
            <div>
              <Typography variant="caption" color="text.secondary">
                Средний убыток
              </Typography>
              <Typography className={styles.pt} variant="subtitle1">
                {(
                  losingTrades.reduce((a, t) => a - t.profit, 0) /
                  Math.max(1, losingTrades.length)
                ).toFixed(2)}
                $
              </Typography>
            </div>
            <div>
              <Typography variant="caption" color="text.secondary">
                Long | Short
              </Typography>
              <Typography className={styles.pt} variant="subtitle1">
                {(
                  (currentData.filter((t) => t.side === "BUY").length /
                    Math.max(1, length)) *
                  100
                ).toFixed()}
                % |{" "}
                {(
                  (currentData.filter((t) => t.side === "SELL").length /
                    Math.max(1, length)) *
                  100
                ).toFixed()}
                %
              </Typography>
            </div>
          </div>
        </Card>
      }
    />
  );
}

function PaperContent({ monthName, title, data, year }) {
  const [currentData, setCurrentData] = useState(data);
  const [startWeek, setStartWeek] = useState(null);
  const [value, setValue] = useState("month");

  const start = DateTime.fromMillis(
    DateTime.local()
      .set({
        year,
        month: DateTime.fromFormat(monthName, "LLLL", {
          locale: "ru",
        }).month,
        day: 1,
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      })
      .toMillis()
  )
    .startOf("week")
    .valueOf();

  const weeksData =
    value === "week"
      ? splitWeekDataByDay(currentData, startWeek)
      : splitMonthDataByWeek(currentData, start);

  return (
    <>
      <CardHeader
        title={title}
        titleTypographyProps={{ variant: "h4" }}
        action={
          <Breadcrumbs
            separator={
              <Box
                className={styles.separator}
                sx={{ backgroundColor: "text.disabled" }}
              />
            }
          >
            <Typography
              variant="body2"
              component="div"
              className={styles.pointer}
              color={value === "month" ? "text.primary" : "text.secondary"}
              onClick={() => {
                setCurrentData(data);
                setValue("month");
              }}
            >
              месяц
            </Typography>
            <Typography
              variant="body2"
              className={styles.default}
              color={value === "week" ? "text.primary" : "text.secondary"}
            >
              неделя
            </Typography>
            <Typography
              variant="body2"
              className={styles.default}
              color={value === "day" ? "text.primary" : "text.secondary"}
            >
              день
            </Typography>
          </Breadcrumbs>
        }
      />
      {/* <AnimatePresence mode="wait">
        <motion.div
          key={value}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.15 }}
        > */}
      <Tree
        label={<RootTreeNode currentData={currentData} />}
        lineWidth="1px"
        lineHeight="40px"
        lineBorderRadius="20px"
        lineColor="rgba(145, 158, 171, 0.2)"
      >
        {data.length > 0 &&
          (value === "week" ? (
            <>
              <DayTreeNode
                setValue={setValue}
                trades={weeksData[0]}
                timestamp={startWeek}
                setCurrentData={setCurrentData}
              >
                <DayTreeNode
                  setValue={setValue}
                  trades={weeksData[3]}
                  timestamp={startWeek + 86400000 * 3}
                  setCurrentData={setCurrentData}
                >
                  <DayTreeNode
                    setValue={setValue}
                    trades={weeksData[6]}
                    timestamp={startWeek + 86400000 * 6}
                    setCurrentData={setCurrentData}
                  />
                </DayTreeNode>
              </DayTreeNode>
              <DayTreeNode
                setValue={setValue}
                trades={weeksData[1]}
                timestamp={startWeek + 86400000}
                setCurrentData={setCurrentData}
              >
                <DayTreeNode
                  setValue={setValue}
                  trades={weeksData[4]}
                  timestamp={startWeek + 86400000 * 4}
                  setCurrentData={setCurrentData}
                />
              </DayTreeNode>
              <DayTreeNode
                setValue={setValue}
                trades={weeksData[2]}
                timestamp={startWeek + 86400000 * 2}
                setCurrentData={setCurrentData}
              >
                <DayTreeNode
                  setValue={setValue}
                  trades={weeksData[5]}
                  timestamp={startWeek + 86400000 * 5}
                  setCurrentData={setCurrentData}
                />
              </DayTreeNode>
            </>
          ) : value === "day" ? (
            <KlineChartTreeNode trades={currentData} />
          ) : (
            <>
              <WeekTreeNode
                endTimestamp={start + 604800000 - 1}
                startTimestamp={start}
                setValue={setValue}
                trades={weeksData[0]}
                setStartWeek={setStartWeek}
                setCurrentData={setCurrentData}
              >
                <WeekTreeNode
                  endTimestamp={start + 604800000 * 3 - 1}
                  startTimestamp={start + 604800000 * 2}
                  setValue={setValue}
                  trades={weeksData[2]}
                  setStartWeek={setStartWeek}
                  setCurrentData={setCurrentData}
                >
                  <WeekTreeNode
                    endTimestamp={start + 604800000 * 5 - 1}
                    startTimestamp={start + 604800000 * 4}
                    setValue={setValue}
                    trades={weeksData[4]}
                    setStartWeek={setStartWeek}
                    setCurrentData={setCurrentData}
                  />
                </WeekTreeNode>
              </WeekTreeNode>
              <WeekTreeNode
                endTimestamp={start + 604800000 * 2 - 1}
                startTimestamp={start + 604800000}
                setValue={setValue}
                trades={weeksData[1]}
                setStartWeek={setStartWeek}
                setCurrentData={setCurrentData}
              >
                <WeekTreeNode
                  endTimestamp={start + 604800000 * 4 - 1}
                  startTimestamp={start + 604800000 * 3}
                  setValue={setValue}
                  trades={weeksData[3]}
                  setStartWeek={setStartWeek}
                  setCurrentData={setCurrentData}
                />
              </WeekTreeNode>
            </>
          ))}
      </Tree>
      {/* </motion.div>
      </AnimatePresence> */}
    </>
  );
}

export default function Index() {
  const { user } = useUser();

  const [data, setData] = useState({});
  const [init, setInit] = useState(true);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(DateTime.now());

  useEffect(() => {
    fetch(
      `${
        process.env.NEXT_PUBLIC_BACKEND_URL
      }/resourses/trades?section=times&startTime=${current
        .startOf("month")
        .startOf("week")
        .toMillis()}&endTime=${current
        .endOf("month")
        .endOf("week")
        .toMillis()}`,
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
        setLoading(false);
        setData((prev) => {
          let n = { ...prev };
          var { year, monthLong } = current;

          if (n[year]) {
            n[year][monthLong] = res;
          } else {
            n[year] = {
              [monthLong]: res,
            };
          }

          return n;
        });
        setInit(false);
      });
  }, [current]);

  return init ? (
    <div className={styles.progress_div}>
      <LinearProgress
        color="inherit"
        className={styles.progress}
        sx={{
          color: "text.primary",
        }}
      />
    </div>
  ) : (
    <>
      {Object.keys(data)
        .reverse()
        .map((y) => (
          <React.Fragment key={y}>
            <Typography variant="h2" color="text.primary" paragraph>
              {y}
            </Typography>
            <Divider />
            {Object.keys(data[y]).map((m) => (
              <Paper key={m} className={styles.paper}>
                <PaperContent
                  title={m.charAt(0).toUpperCase() + m.slice(1)}
                  data={data[y][m]}
                  monthName={m}
                  year={y}
                />
              </Paper>
            ))}
          </React.Fragment>
        ))}
      <LoadingButton
        variant="outlined"
        color="inherit"
        size="large"
        fullWidth
        className={styles.load_button}
        loading={loading}
        onClick={() => {
          setLoading(true);
          setCurrent((prev) => prev.minus({ months: 1 }));
        }}
      >
        Загрузить ещё
      </LoadingButton>
    </>
  );
}

function splitWeekDataByDay(weekTrades, startWeek) {
  var daysData = [[], [], [], [], [], [], []];

  weekTrades.forEach((trade) => {
    const dateCurrentTrade = parseInt(trade.entry_time);

    switch (true) {
      case dateCurrentTrade >= startWeek &&
        dateCurrentTrade < startWeek + 86400000:
        daysData[0].push(trade);
        break;
      case dateCurrentTrade >= startWeek + 86400000 &&
        dateCurrentTrade < startWeek + 86400000 * 2:
        daysData[1].push(trade);
        break;
      case dateCurrentTrade >= startWeek + 86400000 * 2 &&
        dateCurrentTrade < startWeek + 86400000 * 3:
        daysData[2].push(trade);
        break;
      case dateCurrentTrade >= startWeek + 86400000 * 3 &&
        dateCurrentTrade < startWeek + 86400000 * 4:
        daysData[3].push(trade);
        break;
      case dateCurrentTrade >= startWeek + 86400000 * 4 &&
        dateCurrentTrade < startWeek + 86400000 * 5:
        daysData[4].push(trade);
        break;
      case dateCurrentTrade >= startWeek + 86400000 * 5 &&
        dateCurrentTrade < startWeek + 86400000 * 6:
        daysData[5].push(trade);
        break;

      default:
        daysData[6].push(trade);
        break;
    }
  });

  return daysData;
}

function splitMonthDataByWeek(monthTrades, startDate) {
  var weeksData = [[], [], [], [], [], []];

  monthTrades.forEach((trade) => {
    const dateCurrentTrade = parseInt(trade.entry_time);

    switch (true) {
      case dateCurrentTrade >= startDate &&
        dateCurrentTrade < startDate + 604800000:
        weeksData[0].push(trade);
        break;
      case dateCurrentTrade >= startDate + 604800000 &&
        dateCurrentTrade < startDate + 604800000 * 2:
        weeksData[1].push(trade);
        break;
      case dateCurrentTrade >= startDate + 604800000 * 2 &&
        dateCurrentTrade < startDate + 604800000 * 3:
        weeksData[2].push(trade);
        break;
      case dateCurrentTrade >= startDate + 604800000 * 3 &&
        dateCurrentTrade < startDate + 604800000 * 4:
        weeksData[3].push(trade);
        break;
      case dateCurrentTrade >= startDate + 604800000 * 4 &&
        dateCurrentTrade < startDate + 604800000 * 5:
        weeksData[4].push(trade);
        break;

      default:
        weeksData[5].push(trade);
        break;
    }
  });

  return weeksData;
}
