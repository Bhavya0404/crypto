import { CircularProgress } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import React, { useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { HistoricalChart } from "../utils/apiService";
import { CryptoState } from "../CryptoContext";
import { chartDays } from "../utils/chartDays";
import SelectedButton from "./SelectedButton";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Coin = ({ coin }) => {
  const [coinHistory, setCoinHistory] = React.useState();
  const [days, setDays] = React.useState(1);

  const { currency } = CryptoState();

  const fetchCoinHistory = async () => {
    const { data } = await axios.get(HistoricalChart(coin?.id, days, currency));
    setCoinHistory(data.prices);
  };


  useEffect(() => {
    fetchCoinHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency, days]);

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      mode: "dark",
    },
  });

  const useStyles = makeStyles((theme) => ({
    container: {
      width: "75%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 25,
      padding: 40,
      [theme.breakpoints.down("md")]: {
        width: "100%",
        marginTop: 0,
        padding: 20,
        paddingTop: 0,
      },
    },
  }));

  const classes = useStyles();

  return (
    <ThemeProvider theme={darkTheme}>
      <div className={classes.container}>
        {!coinHistory ? (
          <CircularProgress
            style={{ color: "gold" }}
            size={250}
            thickness={1}
          />
        ) : (
          <>
            <Line
              data={{
                labels: coinHistory.map((coin) => {
                  let date = new Date(coin[0]);
                  let time =
                    date.getHours() > 12
                      ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                      : `${date.getHours()}:${date.getMinutes()} AM`;

                  return days === 1 ? time : date.toLocaleDateString();
                }),
                datasets: [
                  {
                    data: coinHistory.map((coin) => coin[1]),
                    label: `Price (Past ${days} day(s)) in ${currency}`,
                    borderColor: "#EEBC1D",
                  },
                ],
              }}
              options={{
                elements: {
                  point: {
                    radius: 1,
                  },
                },
              }}
            />
            <div
              style={{
                display: "flex",
                marginTop: 20,
                justifyContent: "space-around",
                width: "100%",
              }}
            >
              {chartDays.map((day) => (
                <SelectedButton onClick={() => setDays(day.value)} selected={day.value === days} key={day.value}>{day.label}</SelectedButton>
              ))}
            </div>
          </>
        )}
      </div>
    </ThemeProvider>
  );
};

export default Coin;
