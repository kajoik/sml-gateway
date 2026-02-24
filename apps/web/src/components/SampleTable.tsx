import { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { io } from "socket.io-client";

export default function SampleTable() {
  const [lastValue, setLastValue] = useState<number | null>(null);

  useEffect(() => {
    const socket = io();

    socket.emit("subscribeSamples");

    socket.on("sample", (payload: { type: string; value: number }) => {
      setLastValue(payload.value);
    });

    return () => {
      socket.emit("unsubscribeSamples");
      socket.disconnect();
    };
  }, []);

  const rows = [
    { property: "Serial", value: "123XSK29" },
    {
      property: "Last sample",
      value: lastValue !== null ? String(lastValue) : "—",
    },
  ];

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>Property</TableCell>
            <TableCell align="right">Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.property}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.property}
              </TableCell>
              <TableCell align="right">{row.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
