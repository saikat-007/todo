"use client";

import React, { useState } from "react";
import { redirect, useRouter } from "next/navigation";
import Tasks from "./Tasks";

const TodoForm = () => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  const currentDate = new Date().toLocaleDateString('en-US', options);
  const formattedDate = currentDate.replace(/\//g, '-');
  const parts = formattedDate.split('-');
  const formattedDueDate = `${parts[2]}-${parts[0]}-${parts[1]}`;

  //console.log(currentDate);
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [data, setData] = useState([]);

  // 2023-08-29  format

  const calculateCompletionPercentage = (date) => {
    const dateTasks = data.filter((task) => task.dueDate === date);
    if (dateTasks.length === 0) {
      return 0;
    }
    const completedTasks = dateTasks.filter((task) => task.isCompleted);
    return (completedTasks.length / dateTasks.length) * 100;
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/newtask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          dueDate,
        }),
      });

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const newTask = await res.json();
      setData([...data, newTask]);
      router.refresh();
      //console.log(data);

      setTitle("");
      setDescription("");
      //setDueDate("");
    } catch (error) {
      console.log(error);
    }
  };

  const onDateChange = async (e) => {
    const selectedDate = e.target.value;
    setDueDate(selectedDate);

    try {
      const res = await fetch(`/api/mytask?date=${selectedDate}`, {
        cache: "no-store",
        headers: {
          data: `${selectedDate}`,
        },
      });
      const d = await res.json();
      setData(d);
      //console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <section className="w-full max-w-md">
          <form
            className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
            onSubmit={submitHandler}
          >
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="title"
              >
                Task Title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                id="title"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Task Title"
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="description"
              >
                Task Description
              </label>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                type="text"
                id="description"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Task Description"
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="dueDate"
              >
                Due Date
              </label>
              <input
                value={dueDate}
                onChange={onDateChange}
                type="date"
                id="dueDate"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="flex items-center justify-center">
              {dueDate >= formattedDueDate && (
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Add Task
                </button>
              )}
            </div>
          </form>
        </section>
      </div>

      <div className="flex justify-center items-center">
        <div className="mb-4 p-4 border border-gray-300 rounded-md w-1/2">
          <p className="text-lg font-semibold">{`Date: ${dueDate}`}</p>
          <p className="text-sm text-gray-500">{`Completion Percentage: ${calculateCompletionPercentage(
            dueDate
          ).toFixed(2)}%`}</p>
        </div>
      </div>

      {data.map((task) => (
        <Tasks
          key={task._id}
          id={task._id}
          title={task.title}
          description={task.description}
          dueDate={task.dueDate}
          isCompleted={task.isCompleted}
          data={data}
          setData={setData}
        />
      ))}
    </>
  );
};

export default TodoForm;
