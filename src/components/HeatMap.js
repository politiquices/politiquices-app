/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
import HeatMap from "react-heatmap-grid";

const xLabels = new Array(24).fill(0).map((_, i) => `${i}`);

// Display only even labels
const xLabelsVisibility = new Array(24)
  .fill(0)
  .map((_, i) => i % 2 === 0);

const yLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const data = new Array(yLabels.length)
  .fill(0)
  .map(() =>
    new Array(xLabels.length).fill(0).map(() => Math.floor(Math.random() * 100))
  );

export default function HeatMapComponent() {
  return (
    <div style={{ fontSize: "13px" }}>
      <HeatMap
        xLabels={xLabels}
        yLabels={yLabels}
        xLabelsLocation="bottom"
        xLabelsVisibility={xLabelsVisibility}
        xLabelWidth={60}
        data={data}
        squares
        height={45}
        // eslint-disable-next-line no-alert
        onClick={(x, y) => alert(`Clicked ${x}, ${y}`)}
        cellStyle={(background, value, min, max, data, x, y) => ({
          background: `rgb(0, 151, 230, ${1 - (max - value) / (max - min)})`,
          fontSize: "11.5px",
          color: "#444"
        })}
        // eslint-disable-next-line react/no-unstable-nested-components
        cellRender={value => value && <div>{value}</div>}
      />
    </div>
  );
}
