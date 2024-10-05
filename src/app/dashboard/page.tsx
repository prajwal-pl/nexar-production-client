"use client";

import {
  Priority,
  Status,
  Task,
  useGetProjectQuery,
  useGetProjectsQuery,
  useGetTasksQuery,
} from "@/state/api";
import React, { useState } from "react";
import { useAppSelector } from "../redux";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Header from "@/components/Header";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { dataGridClassNames, dataGridSxStyles } from "@/libs/utils";
import { Briefcase, Plus } from "lucide-react";
import ModalNewProject from "../projects/ModalNewProject";

const taskColumns: GridColDef[] = [
  { field: "title", headerName: "Title", width: 200 },
  { field: "status", headerName: "Status", width: 150 },
  { field: "priority", headerName: "Priority", width: 150 },
  { field: "dueDate", headerName: "Due Date", width: 150 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const DashboardPage = () => {
  const [projectId, setProjectId] = useState<number>(1);
  const [isModalNewProjectOpen, setIsModalNewProjectOpen] = useState(false);
  const {
    data: tasks,
    isLoading: tasksLoading,
    isError: tasksError,
  } = useGetTasksQuery({ projectId });
  const { data: projects, isLoading: isProjectsLoading } =
    useGetProjectsQuery();
  const { data: project } = useGetProjectQuery({ projectId });

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  if (tasksLoading || isProjectsLoading) return <div>Loading..</div>;
  if (tasksError || !tasks || !projects || !project)
    return <div>Error fetching data</div>;

  const priorityCount = tasks.reduce(
    (acc: Record<string, number>, task: Task) => {
      const { priority } = task;
      acc[priority as Priority] = (acc[priority as Priority] || 0) + 1;
      return acc;
    },
    {}
  );

  const taskDistribution = Object.keys(priorityCount).map((key) => ({
    name: key,
    count: priorityCount[key],
  }));

  const statusCount = tasks.reduce(
    (acc: Record<string, number>, task: Task) => {
      const { status } = task;
      acc[status as Status] = (acc[status as Status] || 0) + 1;
      return acc;
    },
    {}
  );

  const statusDistribution = Object.keys(statusCount).map((key) => ({
    name: key,
    count: statusCount[key],
  }));

  // const statusCount = projects.reduce(
  //   (acc: Record<string, number>, project: Project) => {
  //     const status = project.endDate ? "Completed" : "Active";
  //     acc[status] = (acc[status] || 0) + 1;
  //     return acc;
  //   },
  //   {}
  // );

  // const taskStatus = tasks.map((task) => {
  //   const status = task.status;
  //   return status;
  // });

  // const projectStatus = Object.keys(statusCount).map((key) => ({
  //   name: key,
  //   count: statusCount[key],
  // }));

  const chartColors = isDarkMode
    ? {
        bar: "#8884d8",
        barGrid: "#303030",
        pieFill: "#4A90E2",
        text: "#FFFFFF",
      }
    : {
        bar: "#8884d8",
        barGrid: "#E0E0E0",
        pieFill: "#82ca9d",
        text: "#000000",
      };

  const handleProjectIncrement = () => {
    if (projectId <= projects.length - 1) {
      setProjectId(projectId + 1);
    }
    if (projectId >= projects.length) {
      setProjectId(1);
    }
  };

  const handleNewProject = () => {
    setIsModalNewProjectOpen(true);
  };
  return (
    <div className="container h-full max-w-screen-xl w-[100%] bg-gray-100 bg-transparent p-8">
      <ModalNewProject
        isOpen={isModalNewProjectOpen}
        onClose={() => setIsModalNewProjectOpen(false)}
      />
      <Header
        name="Project Management Dashboard"
        buttonComponent={
          <div className="flex gap-4">
            <button
              className="flex items-center rounded-md bg-blue-primary px-3 py-2 text-white hover:bg-blue-600"
              onClick={handleProjectIncrement}
            >
              <Briefcase className="mr-2 h-5 w-5" /> Change Project
            </button>
            <button
              className="flex items-center rounded-md bg-blue-primary px-3 py-2 text-white hover:bg-blue-600"
              onClick={handleNewProject}
            >
              <Plus className="mr-2 h-5 w-5" /> New Project
            </button>
          </div>
        }
      />
      <div className="border-b my-4" />
      <div className="py-2">
        <Header name={project.name} isSmallText />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary">
          <h3 className="mb-4 text-lg font-semibold dark:text-white">
            Task Priority Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={taskDistribution}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={chartColors.barGrid}
              />
              <XAxis dataKey="name" stroke={chartColors.text} />
              <YAxis stroke={chartColors.text} />
              <Tooltip
                contentStyle={{
                  width: "min-content",
                  height: "min-content",
                }}
              />
              <Legend />
              <Bar dataKey="count" fill={chartColors.bar} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary">
          <h3 className="mb-4 text-lg font-semibold dark:text-white">
            Project Status
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                dataKey="count"
                data={statusDistribution}
                fill="#82ca9d"
                label
              >
                {statusDistribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary md:col-span-2">
          <h3 className="mb-4 text-lg font-semibold dark:text-white">
            Your Tasks
          </h3>
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={tasks}
              columns={taskColumns}
              checkboxSelection
              loading={tasksLoading}
              getRowClassName={() => "data-grid-row"}
              getCellClassName={() => "data-grid-cell"}
              className={dataGridClassNames}
              sx={dataGridSxStyles(isDarkMode)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
