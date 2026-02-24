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
  // TODO: Replace the "any"
  const [lastObisEntries, setLastObisEntries] = useState<any[]>([]);

  useEffect(() => {
    const socket = io();

    socket.emit("subscribeSamples");

    socket.on("sample", (payload: { type: string; value: any[] }) => {
      setLastObisEntries(payload.value);
    });

    return () => {
      socket.emit("unsubscribeSamples");
      socket.disconnect();
    };
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small">
        <TableHead>
          <TableRow>
            <TableCell>Obis Id</TableCell>
            <TableCell align="right">Medium Name</TableCell>
            <TableCell align="right">Measurement Name</TableCell>
            <TableCell align="right">Measurement Type Name</TableCell>
            <TableCell align="right">Tariff Rate Name</TableCell>
            <TableCell align="right">Previous Measurement Name</TableCell>
            <TableCell align="right">Custom Name</TableCell>
            <TableCell align="right">Obis Name</TableCell>
            <TableCell align="right">Values</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {lastObisEntries.map((lastObisEntry) => (
            <TableRow
              key={lastObisEntry.obisId}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {lastObisEntry.obisId}
              </TableCell>
              <TableCell align="right">{lastObisEntry.mediumName}</TableCell>
              <TableCell align="right">
                {lastObisEntry.measurementName}
              </TableCell>
              <TableCell align="right">
                {lastObisEntry.measurementTypeName}
              </TableCell>
              <TableCell align="right">
                {lastObisEntry.tariffRateName}
              </TableCell>
              <TableCell align="right">
                {lastObisEntry.previousMeasurementName}
              </TableCell>
              <TableCell align="right">{lastObisEntry.customName}</TableCell>
              <TableCell align="right">{lastObisEntry.obisName}</TableCell>
              <TableCell align="right">
                {JSON.stringify(lastObisEntry.values)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
