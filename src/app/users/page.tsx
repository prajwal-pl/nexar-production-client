"use client";
import Header from "@/components/Header";
import { dataGridClassNames, dataGridSxStyles } from "@/libs/utils";
import { useGetUsersQuery } from "@/state/api";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import React from "react";
import { useAppSelector } from "../redux";
import Image from "next/image";
import { Loader2 } from "lucide-react";

const CustomToolbar = () => (
  <GridToolbarContainer className="toolbar flex gap-2">
    <GridToolbarFilterButton />
    <GridToolbarExport />
  </GridToolbarContainer>
);

const columns: GridColDef[] = [
  { field: "userId", headerName: "ID", width: 100 },
  { field: "username", headerName: "Username", width: 150 },
  {
    field: "profilePictureUrl",
    headerName: "Profile Picture",
    width: 100,
    renderCell: (params) => (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-9 w-9">
          <Image
            src={`/${params.value}`}
            alt={params.row.username}
            width={100}
            height={50}
            className="h-full rounded-full object-cover"
          />
        </div>
      </div>
    ),
  },
];

const UsersPage = () => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const { data: users, isLoading, isError } = useGetUsersQuery();

  if (isLoading)
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="animate-spin h-5 w-5 dark:text-white" />
      </div>
    );
  if (isError) <div>Error fetching users...</div>;
  return (
    <div className="flex w-full flex-col p-8">
      <Header name="Users" />
      <div style={{ height: 650, width: "100%" }}>
        <DataGrid
          rows={users || []}
          columns={columns}
          getRowId={(row) => row.userId}
          pagination
          slots={{
            toolbar: CustomToolbar,
          }}
          className={dataGridClassNames}
          sx={dataGridSxStyles(isDarkMode)}
        />
      </div>
    </div>
  );
};

export default UsersPage;
