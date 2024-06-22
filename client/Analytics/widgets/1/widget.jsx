"use client";

import { useTheme } from "@mui/material/styles";
import Skeleton from "@mui/material/Skeleton";

import ApexChart from "react-apexcharts";

import Wrapper from "#/client/Analytics/widgets/wrapper";

export default function DistributionBySide({
  data,
  isLoading,
  handleDeleteWidget,
}) {
  const theme = useTheme();

  let l = 0;
  let s = 0;

  data.forEach((trade) => {
    if (trade.side === "BUY") {
      l++;
    } else {
      s++;
    }
  });

  return isLoading ? (
    <Skeleton />
  ) : (
    <Wrapper
      title="Распределение по LONG/SHORT"
      onClick={() => handleDeleteWidget(1)}
    >
      <ApexChart
        options={{
          chart: {
            type: "donut",
            animations: {
              dynamicAnimation: {
                enabled: false,
              },
            },
          },
          labels: ["LONG", "SHORT"],
          colors: [theme.palette.info.main, theme.palette.warning.main],
          stroke: {
            colors: [theme.palette.background.paper],
            width: 3,
          },
          legend: {
            position: "bottom",
            horizontalAlign: "center",
            labels: {
              colors: "inherit",
            },
            fontFamily: "inherit",
            fontWeight: 500,
            fontSize: "13px",
            itemMargin: {
              horizontal: 14,
            },
            markers: {
              width: 12,
              height: 12,
              offsetX: -2,
            },
          },
          dataLabels: {
            enabled: false,
          },
          tooltip: {
            enabled: false,
          },
          plotOptions: {
            pie: {
              donut: {
                size: "90%",
                labels: {
                  show: true,
                  name: {
                    formatter: (v) => {
                      if (v === "LONG") {
                        return "Long";
                      } else if (v === "SHORT") {
                        return "Short";
                      } else {
                        return v;
                      }
                    },
                  },
                  value: {
                    fontWeight: 700,
                    fontSize: "1.5rem",
                    fontFamily: "inherit",
                    color: theme.palette.text.primary,
                  },
                  total: {
                    show: true,
                    label: "Всего",
                    fontWeight: 600,
                    fontFamily: "inherit",
                    color: theme.palette.text.secondary,
                  },
                },
              },
            },
          },
        }}
        series={[l, s]}
        height="100%"
        type="donut"
      />
    </Wrapper>
  );
}
