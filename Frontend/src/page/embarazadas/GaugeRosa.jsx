// src/components/GaugeRosa.jsx

import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

// Módulos correctos para Highcharts v12+
import HighchartsMore from "highcharts/highcharts-more.js";
import SolidGauge from "highcharts/modules/solid-gauge.js";

// Inicializar módulos
// HighchartsMore(Highcharts);
// SolidGauge(Highcharts);

export default function GaugeRosa({ valor, titulo, max = 200 }) {
  const options = {
    chart: {
      type: "solidgauge",
      height: "200px",
      backgroundColor: "transparent",
    },

    title: null,

    pane: {
      center: ["50%", "50%"],
      size: "100%",
      startAngle: -90,
      endAngle: 90,
      background: {
        innerRadius: "60%",
        outerRadius: "100%",
        shape: "arc",
        backgroundColor: "#FFECCC", // Rosa claro
      },
    },

    tooltip: { enabled: false },

    yAxis: {
      min: 0,
      max: max,
      stops: [[1, "#F39F9F"]], // Rosa fuerte
      lineWidth: 0,
      tickWidth: 0,
      labels: { enabled: false },
    },

    plotOptions: {
      solidgauge: {
        dataLabels: {
          y: -20,
          borderWidth: 0,
          useHTML: true,
          style: { fontSize: "18px", color: "#F39F9F" },
          formatter: function () {
            return `
              <div style="text-align:center">
                <span style="font-size:26px;font-weight:bold;color:#F39F9F">${valor}</span>
                <br/>
                <span style="font-size:14px;color:#F39F9F">${titulo}</span>
              </div>
            `;
          },
        },
      },
    },

    series: [
      {
        data: [valor],
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
