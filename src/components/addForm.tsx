import React from "react";
import { Plus } from "lucide-react";
import { api } from "~/utils/api";

import { getSession } from 'next-auth/react';


const AddForm = () => {
  
  const questionsArray = [
    {
      questionNumber: 1,
      question: "What is your name?",
      questionType: "Input Field",
      options: [],
    },
    {
      questionNumber: 2,
      question: "Select your favorite color:",
      questionType: "Multi Select Options",
      options: [{ option: "Red" }, { option: "Blue" }, { option: "Green" }],
    },
    {
      questionNumber: 3,
      question: "Select your preferred size:",
      questionType: "Radio Select Options",
      options: [{ option: "Small" }, { option: "Medium" }, { option: "Large" }],
    },
    {
      questionNumber: 4,
      question: "Upload an image:",
      questionType: "Image",
      options: [],
    },
    {
      questionNumber: 5,
      question: "Choose your preferred city:",
      questionType: "Dropdown Options",
      options: [
        { option: "New York" },
        { option: "London" },
        { option: "Tokyo" },
      ],
    },
    {
      questionNumber: 6,
      question: "Add a file:",
      questionType: "File Upload",
      options: [],
    },
    {
      questionNumber: 7,
      question: "Choose a date:",
      questionType: "Date Picker",
      options: [],
    },
    {
      questionNumber: 8,
      question: "Choose a time:",
      questionType: "Time Picker",
      options: [],
    },
  ];

  const createForm = api.form.createForm.useMutation();
  const onClickHandler = async () => {
    try {
      const session = await getSession();
      if (!session?.user) {
        return { error: 'User not authenticated' };
      }
      const userId = session.user.id;
      await createForm.mutateAsync({ userId,questions: questionsArray });
      console.log("Form created successfully");
    } catch (err) {
      console.error("Error Adding Form", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className="cursor-pointer rounded-full bg-blue-500 p-4 text-white"
        onClick={onClickHandler}
      >
        <Plus size={24} color="white" />
      </div>
      <p className="mt-2 text-gray-600">Add a Form</p>
    </div>
  );
};

export default AddForm;
