"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Tasks = ({
  title,
  description,
  isCompleted,
  id,
  data,
  setData,
  dueDate,
}) => {
  
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  const currentDate = new Date().toLocaleDateString('en-US', options);
  const formattedDate = currentDate.replace(/\//g, '-');
  const parts = formattedDate.split('-');
  const formattedDueDate = `${parts[2]}-${parts[0]}-${parts[1]}`;

  const router = useRouter();

  const handleDelete = async () => {
    // Handle deletion logic
    try {
      const res = await fetch(`/api/mytask/?id=${id}`, {
        method: "DELETE",
      });

      const updatedData = data.filter((task) => task._id !== id);
      setData(updatedData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCheckboxChange = async () => {
    try {
      const res = await fetch(`/api/mytask/?id=${id}`, {
        method: "PUT",
      });
      const newData = await res.json();
      const updatedData = data
        .filter((task) => task._id !== id)
        .concat(newData);
      setData(updatedData);
      router.refresh();
      //console.log(data);
    } catch (error) {
      return toast.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="w-1/2">
        <div className="bg-white shadow-md p-4 rounded flex justify-between items-center mb-4">
          <div className="w-full">
            <h4
              className={
                isCompleted ? "line-through text-gray-600" : "font-semibold"
              }
            >
              {title}
            </h4>
            <p className="text-gray-500">{description}</p>
          </div>
          <div className="flex items-center space-x-4">
            {formattedDueDate == dueDate && (
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={isCompleted}
                  onChange={handleCheckboxChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2">Completed</span>
              </label>
            )}

            <button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded focus:outline-none focus:shadow-outline"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
