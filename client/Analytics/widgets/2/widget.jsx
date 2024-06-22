"use client";

import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Divider from "@mui/material/Divider";

import ApexChart from "react-apexcharts";

import Wrapper from "#/client/Analytics/widgets/wrapper";
import { colors } from "#/configs/apexcharts";

import styles from "./widget.module.css";

export default function DistributionByCoin({
  data,
  isLoading,
  handleDeleteWidget,
}) {
  var u = {};
  data.forEach((trade) => {
    u[trade.symbol] = u[trade.symbol] ? u[trade.symbol] + 1 : 1;
  });

  const counter = Object.fromEntries(
    Object.entries(u).sort((a, b) => b[1] - a[1])
  );

  console.log("RENDER: DistributionByCoin");

  return isLoading ? (
    <Skeleton />
  ) : (
    <Wrapper
      title="Распределение по монетам"
      onClick={() => handleDeleteWidget(2)}
    >
      <ApexChart
        options={{
          chart: {
            type: "pie",
            animations: {
              enabled: false,
              animateGradually: {
                enabled: false,
              },
              dynamicAnimation: {
                enabled: false,
              },
            },
          },
          labels: Object.keys(counter),
          stroke: {
            colors: ["rgb(33, 43, 54)"],
            width: 3,
          },
          colors,
          legend: {
            labels: {
              colors: "text.primary",
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
          tooltip: {
            fillSeriesColor: false,
          },
          dataLabels: {
            enabled: true,
            style: {
              fontSize: "14px",
              fontFamily: "inherit",
              fontWeight: "400",
            },
            dropShadow: {
              enabled: false,
            },
          },
        }}
        series={Object.values(counter)}
        height="85%"
        type="pie"
      />
      <Divider />
      <div className={styles.div}>
        <div className={styles.stack1}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Всего монет
          </Typography>
          <Typography variant="h6">{Object.keys(counter).length}</Typography>
        </div>
        <div className={styles.stack2}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Количество сделок
          </Typography>
          <Typography variant="h6">
            {Object.values(counter).reduce((a, v) => a + v, 0)}
          </Typography>
        </div>
      </div>
    </Wrapper>
  );
}
