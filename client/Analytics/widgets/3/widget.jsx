"use client";

import { useTheme } from "@mui/material/styles";
import Skeleton from "@mui/material/Skeleton";

import ApexChart from "react-apexcharts";

import Wrapper from "#/client/Analytics/widgets/wrapper";
import useFormat from "#/utils/format-thousands";

export default function CoinVolume({ data, isLoading, handleDeleteWidget }) {
  const theme = useTheme();

  const counter = Object.fromEntries(
    Object.entries(
      data.reduce((acc, trade) => {
        if (acc[trade.symbol]) {
          acc[trade.symbol] += parseFloat(trade.volume);
        } else {
          acc[trade.symbol] = parseFloat(trade.volume);
        }
        return acc;
      }, {})
    ).sort((a, b) => a[1] - b[1])
  );

  console.log("RENDER: CoinVolume");

  return isLoading ? (
    <Skeleton />
  ) : (
    <Wrapper title="Объём по монете" onClick={() => handleDeleteWidget(3)}>
      <ApexChart
        options={{
          chart: {
            type: "bar",
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
              dynamicAnimation: {
                enabled: false,
              },
            },
          },
          colors: ["#FFAC82"],
          dataLabels: {
            enabled: false,
          },
          grid: {
            borderColor: "rgba(145, 158, 171, 0.2)",
            strokeDashArray: 3,
          },
          plotOptions: {
            bar: {
              horizontal: true,
              borderRadius: 4,
              borderRadiusApplication: "end",
            },
          },
          xaxis: {
            categories: Object.keys(counter),
            axisBorder: {
              show: false,
            },
            axisTicks: {
              show: false,
            },
            labels: {
              style: {
                colors: theme.palette.text.secondary,
              },
            },
          },
          yaxis: {
            labels: {
              style: {
                colors: theme.palette.text.secondary,
              },
            },
          },
          tooltip: {
            marker: { show: false },
            x: {
              show: false,
            },
            y: {
              formatter: (value) => `$${useFormat(value.toFixed(0))}`,
              title: {
                formatter: () => "",
              },
            },
            style: {
              fontSize: "14px",
              fontFamily: "inherit",
            },
          },
        }}
        series={[
          {
            data: Object.values(counter),
          },
        ]}
        height="100%"
        type="bar"
      />
    </Wrapper>
  );
}
