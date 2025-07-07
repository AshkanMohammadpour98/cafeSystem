import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Badge, Spinner, ButtonGroup, Button, Dropdown } from "react-bootstrap";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

export default function GoogleChartDailySales() {
  const [salesData, setSalesData] = useState([]);
  const [dailyStats, setDailyStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("day");
  const [dayMode, setDayMode] = useState("all"); // all, today_vs_yesterday

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.gstatic.com/charts/loader.js";
    script.onload = () => {
      window.google.charts.load("current", { packages: ["corechart"] });
      window.google.charts.setOnLoadCallback(() => {
        setTimeout(drawChart, 100);
      });
    };
    document.body.appendChild(script);

    async function drawChart() {
      try {
        setLoading(true);
        const resOut = await axios.get("http://localhost:3001/dataOrderOut");
        const allOrders = [...resOut.data];

        const firstOrderDate = allOrders.length ? allOrders[0].date : null;
        const firstDate = firstOrderDate ? new DateObject({ date: firstOrderDate, calendar: persian, locale: persian_fa }) : null;

        const groupKey = (dateStr) => {
          if (!dateStr) return "نامشخص";
          const d = new DateObject({ date: dateStr, calendar: persian, locale: persian_fa });

          if (period === "day") {
            return d.format("YYYY/MM/DD");
          } else if (period === "week") {
            const dayOfYear = d.dayOfYear;
            const weekNumber = Math.ceil(dayOfYear / 7);
            return `${d.format("YYYY")}/هفته${weekNumber}`;
          } else if (period === "month") {
            return d.format("YYYY/MM");
          }
          return dateStr;
        };

        const statsMap = {};
        allOrders.forEach(order => {
          const date = groupKey(order.date);
          if (!statsMap[date]) {
            statsMap[date] = { totalSales: 0, totalProfit: 0, orderCount: 0 };
          }

          const orderTotal = order.totalPrice || 0;
          statsMap[date].totalSales += orderTotal;
          statsMap[date].orderCount += 1;

          if (Array.isArray(order.itemCalculator)) {
            order.itemCalculator.forEach(item => {
              const cost = item.cost || 0;
              const count = item.count || 1;
              const totalItemProfit = (item.price - cost) * count;
              statsMap[date].totalProfit += totalItemProfit;
            });
          }
        });

        const sortedDates = Object.keys(statsMap).sort((a, b) => {
          const parseKey = (key) => {
            if (period === "week") {
              const [year, weekStr] = key.split("/هفته");
              const weekNum = parseInt(weekStr, 10);
              const d = new DateObject({ calendar: persian, locale: persian_fa, year: +year, month: 1, day: 1 });
              d.add(weekNum - 1, "week");
              return d.toDate();
            } else {
              return new DateObject({ calendar: persian, locale: persian_fa, date: key.replace("نامشخص", "1400/01/01") }).toDate();
            }
          };
          return parseKey(a) - parseKey(b);
        });

        const chartData = [["تاریخ", "فروش"]];
        const dailyStatsData = [];

        sortedDates.forEach(date => {
          const stats = statsMap[date];
          chartData.push([date, stats.totalSales]);
          dailyStatsData.push({ date, ...stats });
        });

        let filteredChartData = [...chartData];
        let filteredStats = [...dailyStatsData];

        if (period === "day" && dayMode === "today_vs_yesterday" && dailyStatsData.length >= 2) {
          const today = dailyStatsData[dailyStatsData.length - 1];
          const yesterday = dailyStatsData[dailyStatsData.length - 2];
          filteredChartData = [["تاریخ", "فروش"], [yesterday.date, yesterday.totalSales], [today.date, today.totalSales]];
          filteredStats = [yesterday, today];
        }

        setSalesData(filteredChartData);
        setDailyStats(filteredStats);
        setLoading(false);

        if (!window.google) return;
        const data = window.google.visualization.arrayToDataTable(filteredChartData);
        const options = {
          title: `نمودار فروش - ${period === "day" ? (dayMode === "today_vs_yesterday" ? "امروز و دیروز" : "روزانه") : period === "week" ? "هفتگی" : "ماهانه"}`,
          curveType: "function",
          legend: { position: "bottom" },
          hAxis: { textStyle: { fontFamily: 'Vazir', fontSize: 12 } },
          vAxis: {
            title: "فروش (تومان)",
            viewWindow: { min: 0 },
            textStyle: { fontFamily: 'Vazir', fontSize: 12 },
            gridlines: { count: 6 },
          },
          tooltip: {
            isHtml: true,
            trigger: 'focus'
          }
        };

        const container = document.getElementById("daily_sales_chart");
        if (!container) {
          console.error("❌ DOM element 'daily_sales_chart' not found.");
          return;
        }

        const chart = new window.google.visualization.LineChart(container);
        chart.draw(data, options);
      } catch (err) {
        console.error("خطا در دریافت داده:", err);
        setLoading(false);
      }
    }

    drawChart();
  }, [period, dayMode]);

  function formatNumberFA(num) {
    const full = num.toLocaleString();
    return `${full} تومان`;
  }

  return (
    <div dir="rtl" className="container-fluid px-3 mt-4">
      <ButtonGroup aria-label="فیلتر دوره">
        <Button variant={period === "day" ? "primary" : "outline-primary"} onClick={() => setPeriod("day")}>
          روزانه
        </Button>
        <Button variant={period === "week" ? "primary" : "outline-primary"} onClick={() => setPeriod("week")}>
          هفتگی
        </Button>
        <Button variant={period === "month" ? "primary" : "outline-primary"} onClick={() => setPeriod("month")}>
          ماهانه
        </Button>
      </ButtonGroup>

      {period === "day" && (
        <Dropdown className="d-inline mx-2">
          <Dropdown.Toggle variant="secondary" size="sm">
            حالت نمایش روزانه
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setDayMode("all")}>مقایسه همه روزها</Dropdown.Item>
            <Dropdown.Item onClick={() => setDayMode("today_vs_yesterday")}>امروز در برابر دیروز</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )}

      {/* ✅ رفع اسکرول افقی */}
      <div style={{ overflowX: "auto" }}>
        <div id="daily_sales_chart" style={{ width: "100%", minWidth: "600px", height: "400px", marginTop: "20px" }} />
      </div>

      <Card className="mt-4 p-3">
        <Card.Title className="mb-3">📊 مقایسه فروش ({period === "day" ? (dayMode === "today_vs_yesterday" ? "امروز و دیروز" : "روزانه") : period === "week" ? "هفتگی" : "ماهانه"})</Card.Title>

        {loading ? (
          <Spinner animation="border" />
        ) : (
          dailyStats.map(({ date, totalSales, totalProfit, orderCount }, index, array) => {
            const prev = array[index - 1]?.totalSales || 0;
            const diff = totalSales - prev;

            let badgeVariant = "secondary";
            let badgeText = "اولین دوره";
            let icon = "➖";

            if (index > 0) {
              if (diff > 0) {
                badgeVariant = "success";
                badgeText = `افزایش ${formatNumberFA(diff)}`;
                icon = "📈";
              } else if (diff < 0) {
                badgeVariant = "danger";
                badgeText = `کاهش ${formatNumberFA(Math.abs(diff))}`;
                icon = "📉";
              } else {
                badgeVariant = "warning";
                badgeText = "بدون تغییر";
                icon = "➖";
              }
            }

            return (
              <React.Fragment key={index}>
                <div>
                  <strong>{date}</strong> | فروش کل: {formatNumberFA(totalSales)} | سود: {formatNumberFA(totalProfit)} | تعداد سفارش: {orderCount}
                </div>
                <Badge bg={badgeVariant} className="mt-2 mt-md-0">
                  {icon} {badgeText}
                </Badge>
              </React.Fragment>
            );
          })
        )}
      </Card>
    </div>
  );
}
