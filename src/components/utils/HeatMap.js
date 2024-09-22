/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
import HeatMap from "react-heatmap-grid";

const xLabels = ["1994", "1995", "1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005", 
                 "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", 
                 "2018", "2019", "2020", "2021", "2022"];

/*
// Display only even labels
const xLabelsVisibility = new Array(24)
  .fill(0)
  .map((_, i) => i % 2 === 0);
*/

const yLabels = ["André Ventura", "Durão Barroso", "Marques Mendes"]; // Personalidades
const data = new Array(yLabels.length)
  .fill(0)
  .map(() =>
    new Array(xLabels.length).fill(0).map(() => Math.floor(Math.random() * 10))
  );

console.log(data);

// Personalidades and data must be given by the API

function HeatMapComponent() {
  return (
    <div style={{ fontSize: "12px" }}>
      <HeatMap
        xLabels={xLabels}
        yLabels={yLabels}
        xLabelsLocation="bottom"
        // xLabelsVisibility={xLabelsVisibility}
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

export default HeatMapComponent;