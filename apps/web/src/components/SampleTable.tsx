import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { io } from "socket.io-client";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

type ObisEntry = {
  obisId: string;
  mediumName?: string;
  measurementName?: string;
  measurementTypeName?: string;
  tariffRateName?: string;
  previousMeasurementName?: string;
  customName?: string;
  obisName?: string;
  values?: unknown;
};

export default function SampleTable() {
  const [rows, setRows] = useState<ObisEntry[]>([]);

  useEffect(() => {
    const socket = io();

    socket.emit("subscribeSamples");

    socket.on("sample", (payload: { type: string; value: ObisEntry[] }) => {
      setRows(payload.value);
    });

    return () => {
      socket.emit("unsubscribeSamples");
      socket.disconnect();
    };
  }, []);

  const columns: GridColDef[] = [
    { field: "obisId", headerName: "Obis Id", width: 140 },
    { field: "mediumName", headerName: "Medium Name", width: 140 },
    { field: "measurementName", headerName: "Measurement Name", width: 180 },
    {
      field: "measurementTypeName",
      headerName: "Measurement Type Name",
      width: 200,
    },
    { field: "tariffRateName", headerName: "Tariff Rate Name", width: 160 },
    {
      field: "previousMeasurementName",
      headerName: "Previous Measurement Name",
      width: 200,
    },
    { field: "customName", headerName: "Custom Name", width: 140 },
    { field: "obisName", headerName: "Obis Name", width: 340 },
    {
      field: "value",
      headerName: "Value",
      width: 300,
      renderCell: (params: GridRenderCellParams) => {
        if (params.row.values?.[0]) {
          return `${params.row.values[0].value} ${params.row.values[0].unit}`;
        } else {
          return "-";
        }
      },
      sortable: false,
      filterable: false,
    },
    {
      field: "values",
      headerName: "Raw Values",
      width: 300,
      renderCell: (params: GridRenderCellParams) =>
        JSON.stringify(params.value),
      sortable: false,
      filterable: false,
    },
  ];

  const rowsWithId = rows.map((r) => ({ id: r.obisId, ...r }));

  if (rows.length < 1) {
    return (
      <Box textAlign="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Alert severity="info" sx={{ mb: 2 }}>
        Some columns are deactivated by default. You can activate them in the
        column menu.
      </Alert>
      <DataGrid
        rows={rowsWithId}
        columns={columns}
        initialState={{
          columns: {
            columnVisibilityModel: {
              customName: false,
              obisId: false,
              previousMeasurementName: false,
              values: false,
            },
          },
        }}
        hideFooter
        autoHeight
        disableRowSelectionOnClick
      />
    </Box>
  );
}
