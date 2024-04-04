function artistItemArray(selectedArtist) {
  return data.filter((item) => item.artist === selectedArtist);
}

function createChart() {
  const labels = [];
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Sales Amount",
        backgroundColor: "#a26a5e",
        borderColor: "rgb(255, 99, 132)",
        hoverBackgroundColor: "#d44c2e",
        data: [],
      },
    ],
  };

  const config = {
    type: "bar",
    data,
    options: {
      indexAxis: "y",
    },
  };
  const myChart = new Chart(document.getElementById("myChart"), config);

  document.querySelector("#sevenDays").addEventListener("click", () => {
    myChart.clear();
    myChart.data.labels = getLastDays(7).dateLabel;
    myChart.data.datasets[0].data = getLastDays(7).salesData;
    myChart.update();
  });
  document.querySelector("#fourteenDays").addEventListener("click", () => {
    myChart.clear();
    myChart.data.labels = getLastDays(14).dateLabel;
    myChart.data.datasets[0].data = getLastDays(14).salesData;
    myChart.update();
  });
  document.querySelector("#oneMonth").addEventListener("click", () => {
    myChart.clear();
    myChart.data.labels = getLastDays(30).dateLabel;
    myChart.data.datasets[0].data = getLastDays(30).salesData;
    myChart.update();
  });
  document.querySelector("#oneYear").addEventListener("click", () => {
    myChart.clear();
    myChart.data.labels = getDataForLastOneYear().dateLabel;
    myChart.data.datasets[0].data = getDataForLastOneYear().salesData;
    myChart.update();
  });
  getDataForLastOneYear;
}

function getDataForLastOneYear() {
  monthsLabel = [];
  let monthsArray = [];
  let monthName = new Array(
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  );
  let d = new Date();
  d.setDate(1);
  for (i = 0; i <= 11; i++) {
    monthsArray.push(new Date(d));
    d.setMonth(d.getMonth() - 1);
  }

  monthsLabel = monthsArray.map(
    (month) =>
      `${monthName[new Date(month).getMonth()]} ${new Date(
        month
      ).getFullYear()}`
  );

  let data = [];

  monthsArray.forEach((day) => {
    let soldData = artistItemArray(artistName).filter((item) =>
      getMonthstoCompare(item.dateSold, day)
    );

    data.push(soldData);
  });
  salesDataforEachDay = [];
  data.forEach((array) => {
    let sales = 0;
    array.forEach((item) => {
      sales = sales + item.priceSold;
    });
    salesDataforEachDay.push(sales);
  });
  chartData = {
    dateLabel: monthsLabel,
    salesData: salesDataforEachDay,
  };
  return chartData;
}

function getLastDays(days) {
  let previousDays = [];
  let today = Date.parse(new Date());
  let oneDay = 86400000;

  for (let i = 0; days > i; i++) {
    let eachDay = oneDay * i;
    let previousDay = new Date(today - eachDay);
    previousDays.push(previousDay);
  }

  let lastDays = previousDays.map(
    (day) => `${day.toLocaleDateString("en-GB")}`
  );
  let data = [];

  previousDays.forEach((day) => {
    let soldData = artistItemArray(artistName).filter((item) =>
      getDatestoCompare(item.dateSold, day)
    );

    data.push(soldData);
  });
  salesDataforEachDay = [];
  data.forEach((array) => {
    let sales = 0;
    array.forEach((item) => {
      sales = sales + item.priceSold;
    });
    salesDataforEachDay.push(sales);
  });
  chartData = {
    dateLabel: lastDays,
    salesData: salesDataforEachDay,
  };

  return chartData;
}
function getMonthstoCompare(date1, date2) {
  dateOne = new Date(date1);
  dateTwo = new Date(date2);

  if (
    dateOne.getMonth() === dateTwo.getMonth() &&
    dateOne.getFullYear() === dateTwo.getFullYear()
  ) {
    return true;
  } else {
    return false;
  }
}

function getDatestoCompare(date1, date2) {
  dateOne = new Date(date1);
  dateTwo = new Date(date2);

  if (
    dateOne.getDate() === dateTwo.getDate() &&
    dateOne.getMonth() === dateTwo.getMonth() &&
    dateOne.getFullYear() === dateTwo.getFullYear()
  ) {
    return true;
  } else {
    return false;
  }
}
