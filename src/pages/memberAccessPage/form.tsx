import React, { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import InputField from "~/components/inputField";
import DropdownSelectField from "~/components/dropdownSelectField";
import MultiSelectCheckboxes from "~/components/multiSelectCheckboxes";
import RadioButtonField from "~/components/radioButtonField";
import DateField from "~/components/dateField";
import TimeField from "~/components/timeField";
import { api } from "~/utils/api";
import { debounce } from "lodash";
const FormPage = () => {
  const [formID, setFormID] = useState("");
  // const [formData, setFormData]=useState<FormDataType>();
  type FormDataType = {
    formID: string;
    formName: string;
    createdUserID: string;
    creationDate: Date;
    questions: QuestionDetails[];
    userQnsAns: UserQnsAnsType[]; // Include the FormData type here
  };
  type QuestionDetails = {
    qnsID: string;
    questionNumber: number;
    question: string;
    questionType: string;
    createdAt: Date;
    updatedAt: Date | null;
    formID: string;
    options: QuestionOption[];
  };

  type QuestionOption = {
    qnsOptionID: string;
    option: string;
    qnsID: string;
  };
  // Now, your full FormData type
  type UserQnsAnsType = {
    userQnsAnsID: string;
    userID: string;
    qnsID: string;
    formID: string;
    answer: string | null;
    qnsOptionID: string | null;
    qnsOptionIDs: string[];
    dateTimeAns: Date | null;
    lastUpdated: Date | null;
  };
  useEffect(() => {
      const fetchSession = async () => {
        const session = await getSession();
        const redirectTo = "/";
        if (!session?.user) {
          window.location.href = redirectTo;
        }
      };
      fetchSession();
      const searchParams = new URLSearchParams(window.location.search);
      const formID2 = searchParams.get("formID");

      if (!formID2) {
        window.location.href = "/memberAccessPage/memberHome";
        console.error("Form ID is missing");
      } else {
        setFormID(formID2);
      }
    
  }, []);

  let { data: formData, isLoading: dataLoading } =api.form.getFormDetailsByFormID.useQuery({ formID });
  if (dataLoading) {
    return <div>loading</div>;
  } else if (!formData) {
    window.location.href = "/memberAccessPage/memberHome";
    console.error("Form Details is missing");
  } 




  const updateFormData = async () => {
    try {
      // Send a request to update the form data in the database
      // Use localFormData to get the updated values
      // Example: await api.form.updateFormData(localFormData);
      console.log("Form data updated in the database");
    } catch (error) {
      console.error("Error updating form data:", error);
    }
  };
const handleInputChange = (questionID: string, answer: string | null) => {
  console.log("handleInputChange called with:", questionID, answer);
  if (formData) {
    const updatedUserQnsAns = formData.userQnsAns.map((uqa) =>
      uqa.qnsID === questionID ? { ...uqa, answer } : uqa
    );
    console.log(updatedUserQnsAns);

    // Create a new formData object with the updated userQnsAns array
    const updatedFormData = { ...formData, userQnsAns: updatedUserQnsAns };

    // Set the state with the new formData object
    formData = updatedFormData;
    if (!formData) {
      window.location.href = "/memberAccessPage/memberHome";
      console.error("Form Details is missing");
    } 
    console.log("Form data updated", updatedFormData);
  }
};

  const handleDropdownChange = (
    questionID: string,
    selectedValue: string | null,
  ) => {
    console.log("handleInputChange called with:", questionID, selectedValue);
    if (formData) {
      const updatedUserQnsAns = formData.userQnsAns.map((uqa) =>
        uqa.qnsID === questionID ? { ...uqa,qnsOptionID:selectedValue } : uqa
      );
      console.log(updatedUserQnsAns);
  
      // Create a new formData object with the updated userQnsAns array
      const updatedFormData = { ...formData, userQnsAns: updatedUserQnsAns };
  
      // Set the state with the new formData object
      formData = updatedFormData;
      if (!formData) {
        window.location.href = "/memberAccessPage/memberHome";
        console.error("Form Details is missing");
      } 
      console.log("Form data updated", updatedFormData);
    }
  };

  const handleMultiSelectChange = (
    questionID: string,
    selectedValues: string[],
  ) => {
    // Implement your logic to handle multi-select changes
  };

  const handleRadioChange = (
    questionID: string,
    selectedValue: string | null,
  ) => {
    console.log("handleInputChange called with:", questionID, selectedValue);
    if (formData) {
      const updatedUserQnsAns = formData.userQnsAns.map((uqa) =>
        uqa.qnsID === questionID ? { ...uqa,qnsOptionID:selectedValue } : uqa
      );
      console.log(updatedUserQnsAns);
  
      // Create a new formData object with the updated userQnsAns array
      const updatedFormData = { ...formData, userQnsAns: updatedUserQnsAns };
  
      // Set the state with the new formData object
      formData = updatedFormData;
      if (!formData) {
        window.location.href = "/memberAccessPage/memberHome";
        console.error("Form Details is missing");
      } 
      console.log("Form data updated", updatedFormData);
    }
  };

  const handleDateChange = (questionID: string, selectedDate: Date | null) => {
    console.log("handleInputChange called with:", questionID, selectedDate);
    if (formData) {
      const updatedUserQnsAns = formData.userQnsAns.map((uqa) =>
        uqa.qnsID === questionID ? { ...uqa,dateTimeAns:selectedDate } : uqa
      );
      console.log(updatedUserQnsAns);
  
      // Create a new formData object with the updated userQnsAns array
      const updatedFormData = { ...formData, userQnsAns: updatedUserQnsAns };
  
      // Set the state with the new formData object
      formData = updatedFormData;
      if (!formData) {
        window.location.href = "/memberAccessPage/memberHome";
        console.error("Form Details is missing");
      } 
      console.log("Form data updated", updatedFormData);
    }
  };

  const handleTimeChange = (questionID: string, selectedTime: Date | null) => {
    console.log("handleInputChange called with:", questionID, selectedTime);
    if (formData) {
      const updatedUserQnsAns = formData.userQnsAns.map((uqa) =>
        uqa.qnsID === questionID ? { ...uqa,dateTimeAns:selectedTime } : uqa
      );
      console.log(updatedUserQnsAns);
  
      // Create a new formData object with the updated userQnsAns array
      const updatedFormData = { ...formData, userQnsAns: updatedUserQnsAns };
  
      // Set the state with the new formData object
      formData = updatedFormData;
      if (!formData) {
        window.location.href = "/memberAccessPage/memberHome";
        console.error("Form Details is missing");
      } 
      console.log("Form data updated", updatedFormData);
    }
  };

  return (
    <div>
      <section className="mx-auto mt-20 max-w-4xl rounded-md bg-indigo-600 p-6 shadow-md dark:bg-gray-800">
        <h1 className="text-xl font-bold capitalize text-white dark:text-white">
          {formData?.formName}
        </h1>
        <form>
          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {formData?.questions?.map((question) => (
              <div key={question.qnsID}>
                {question.questionType === "Input Field" && (
                  <InputField
                    question={question.question}
                    userQnsAnsID={question.qnsID}
                    questionID={question.qnsID}
                    answer={
                      formData?.userQnsAns.find(
                        (uqa) => uqa.qnsID === question.qnsID,
                      )?.answer || ""
                    }
                    onChange={(answer) =>
                      handleInputChange(question.qnsID, answer)
                    }
                  />
                )}
                {question.questionType === "Dropdown Options" && (
                  <DropdownSelectField
                    question={question.question}
                    userQnsAnsID={question.qnsID}
                    questionID={question.qnsID}
                    ansOptionID={
                      formData?.userQnsAns.find(
                        (uqa) => uqa.qnsID === question.qnsID,
                      )?.qnsOptionID || null
                    }
                    optionIDs={question.options.map(
                      (option) => option.qnsOptionID,
                    )}
                    onChange={(selectedValue) =>
                      handleDropdownChange(question.qnsID, selectedValue)
                    }
                  />
                )}
                {question.questionType === "Multi Select Options" && (
                  <MultiSelectCheckboxes
                    question={question.question}
                    userQnsAnsID={question.qnsID}
                    questionID={question.qnsID}
                    ansOptionIDs={
                      (formData?.userQnsAns.find(
                        (uqa) => uqa.qnsID === question.qnsID,
                      )?.qnsOptionIDs || []) as string[]
                    }
                    optionIDs={question.options.map(
                      (option) => option.qnsOptionID,
                    )}
                    onChange={(selectedValues) =>
                      handleMultiSelectChange(question.qnsID, selectedValues)
                    }
                  />
                )}
                {question.questionType === "Radio Select Options" && (
                  <RadioButtonField
                    question={question.question}
                    userQnsAnsID={question.qnsID}
                    questionID={question.qnsID}
                    ansOptionID={
                      formData?.userQnsAns.find(
                        (uqa) => uqa.qnsID === question.qnsID,
                      )?.qnsOptionID || ""
                    }
                    optionIDs={question.options.map(
                      (option) => option.qnsOptionID,
                    )}
                    onChange={(selectedValue) =>
                      handleRadioChange(question.qnsID, selectedValue)
                    }
                  />
                )}
                {question.questionType === "Date Picker" && (
                  <DateField
                    question={question.question}
                    userQnsAnsID={question.qnsID}
                    questionID={question.qnsID}
                    dateAns={
                      formData?.userQnsAns.find(
                        (uqa) => uqa.qnsID === question.qnsID,
                      )?.dateTimeAns || null
                    }
                    onChange={(selectedDate) =>
                      handleDateChange(question.qnsID, selectedDate)
                    }
                  />
                )}
                {question.questionType === "Time Picker" && (
                  <TimeField
                    question={question.question}
                    userQnsAnsID={question.qnsID}
                    questionID={question.qnsID}
                    timeAns={
                      formData?.userQnsAns.find(
                        (uqa) => uqa.qnsID === question.qnsID,
                      )?.dateTimeAns || null
                    }
                    onChange={(selectedTime) =>
                      handleTimeChange(question.qnsID, selectedTime)
                    }
                  />
                )}
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <button className="transform rounded-md bg-pink-500 px-6 py-2 leading-5 text-white transition-colors duration-200 hover:bg-pink-700 focus:bg-gray-600 focus:outline-none">
              Save
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default FormPage;
