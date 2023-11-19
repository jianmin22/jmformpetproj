import React, { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import InputField from "~/components/inputField";
import DropdownSelectField from "~/components/dropdownSelectField";
import MultiSelectCheckboxes from "~/components/multiSelectCheckboxes";
import RadioButtonField from "~/components/radioButtonField";
import DateField from "~/components/dateField";
import TimeField from "~/components/timeField";
import ImageUploadField from "~/components/imageUploadField";
import _ from 'lodash';
import { Download } from "lucide-react";

import { CldUploadWidgetResults } from "next-cloudinary";
import { api } from "~/utils/api";
import { MoveLeft } from "lucide-react";
import { result } from "lodash";
import NavBar from "~/components/navBar";
import LoadingComponent from "~/components/loadingComponent";
const FormPage = () => {
  const updateForm = api.form.updateAnswer.useMutation();
  const [formID, setFormID] = useState("");
  const [formData, setFormData] = useState<FormDataType>();
  const [isSaving, setIsSaving] = useState(false);
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
    public_id: string | null;
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

  const {
    data,
    isLoading: dataLoading,
    error,
  } = api.form.getFormDetailsByFormID.useQuery(
    { formID },
    {
      onSuccess: (formData1) => {
        setFormData(formData1);
      },
      onError: () => {
        (window.location.href = "/memberAccessPage/memberHome"),
          console.error("Form Details is missing");
      },
    },
  );
  if (dataLoading || !formData) {
    return <LoadingComponent />
  }
  
  const handleSaveToDB = async (userQnsAnsArray: UserQnsAnsType[]) => {
    try {
      await updateForm.mutateAsync({ answers: userQnsAnsArray });
      console.log("Form created successfully");
    } catch (err) {
      console.error("Error Updating Form", err);
    } finally {
      setIsSaving(false);
    }
  };
  const debouncedSaveToDB = _.debounce(handleSaveToDB, 3000);


  const handleSaveOrPrint = async (e: React.FormEvent) => {
  
    window.print();
  };
  
  
  

  const handleInputChange = (questionID: string, answer: string | null) => {
    console.log("handleInputChange called with:", questionID, answer);
    if (formData) {
      const updatedUserQnsAns = formData.userQnsAns.map((uqa) =>
        uqa.qnsID === questionID ? { ...uqa, answer } : uqa,
      );
      console.log(updatedUserQnsAns);

      const updatedFormData = { ...formData, userQnsAns: updatedUserQnsAns };

      if (!updatedFormData) {
        window.location.href = "/memberAccessPage/memberHome";
        console.error("Form Details is missing");
      }

      setFormData(updatedFormData);
      setIsSaving(true);
      debouncedSaveToDB(updatedFormData.userQnsAns);
      console.log("Form data updated", updatedFormData);
    }
  };

  const handleImageUpload = (
    questionID: string,
    result: CldUploadWidgetResults
  ) => {
    const info = result.info as object;
    let answer = "";
    let public_id = "";
    if ("secure_url" in info && "public_id" in info) {
      answer = info.secure_url as string;
      public_id = info.public_id as string;
    }
    if (formData) {
      const updatedUserQnsAns = formData.userQnsAns.map((uqa) =>
        uqa.qnsID === questionID ? { ...uqa, answer, public_id } : uqa
      );
  
      const updatedFormData = { ...formData, userQnsAns: updatedUserQnsAns };
  
      setFormData(updatedFormData);
      setIsSaving(true);
      debouncedSaveToDB(updatedFormData.userQnsAns);
  
      console.log("Form data updated", updatedFormData);
    }
  };
  

  const handleImageRemove = (
    questionID: string
  ) => {
    if (formData) {
      const updatedUserQnsAns = formData.userQnsAns.map((uqa) =>
        uqa.qnsID === questionID ? { ...uqa, answer:null, public_id:null } : uqa,
      );
      console.log(updatedUserQnsAns);

      const updatedFormData = { ...formData, userQnsAns: updatedUserQnsAns };


      setFormData(updatedFormData);
      setIsSaving(true);
      debouncedSaveToDB(updatedFormData.userQnsAns);
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
        uqa.qnsID === questionID ? { ...uqa, qnsOptionID: selectedValue } : uqa,
      );
      console.log(updatedUserQnsAns);

      const updatedFormData = { ...formData, userQnsAns: updatedUserQnsAns };

      if (!updatedFormData) {
        window.location.href = "/memberAccessPage/memberHome";
        console.error("Form Details is missing");
      }

      setFormData(updatedFormData);
      setIsSaving(true);
      debouncedSaveToDB(updatedFormData.userQnsAns);
      console.log("Form data updated", updatedFormData);
    }
  };

  const handleMultiSelectChange = (
    questionID: string,
    selectedValues: string[],
  ) => {
    console.log("handleInputChange called with:", questionID, selectedValues);
    if (formData) {
      const updatedUserQnsAns = formData.userQnsAns.map((uqa) =>
        uqa.qnsID === questionID
          ? { ...uqa, qnsOptionIDs: selectedValues }
          : uqa,
      );
      console.log(updatedUserQnsAns);

      const updatedFormData = { ...formData, userQnsAns: updatedUserQnsAns };

      if (!updatedFormData) {
        window.location.href = "/memberAccessPage/memberHome";
        console.error("Form Details is missing");
      }

      setFormData(updatedFormData);
      setIsSaving(true);
      debouncedSaveToDB(updatedFormData.userQnsAns);
      console.log("Form data updated", updatedFormData);
    }
  };

  const handleRadioChange = (
    questionID: string,
    selectedValue: string | null,
  ) => {
    console.log("handleInputChange called with:", questionID, selectedValue);
    if (formData) {
      const updatedUserQnsAns = formData.userQnsAns.map((uqa) =>
        uqa.qnsID === questionID ? { ...uqa, qnsOptionID: selectedValue } : uqa,
      );
      console.log(updatedUserQnsAns);

      const updatedFormData = { ...formData, userQnsAns: updatedUserQnsAns };

      if (!updatedFormData) {
        window.location.href = "/memberAccessPage/memberHome";
        console.error("Form Details is missing");
      }
      setFormData(updatedFormData);
      setIsSaving(true);
      debouncedSaveToDB(updatedFormData.userQnsAns);
      console.log("Form data updated", updatedFormData);
    }
  };

  const handleDateChange = (questionID: string, selectedDate: Date | null) => {
    console.log("handleInputChange called with:", questionID, selectedDate);
    if (formData) {
      const updatedUserQnsAns = formData.userQnsAns.map((uqa) =>
        uqa.qnsID === questionID ? { ...uqa, dateTimeAns: selectedDate } : uqa,
      );
      console.log(updatedUserQnsAns);

      const updatedFormData = { ...formData, userQnsAns: updatedUserQnsAns };

      if (!updatedFormData) {
        window.location.href = "/memberAccessPage/memberHome";
        console.error("Form Details is missing");
      }
      setFormData(updatedFormData);
      setIsSaving(true);
      debouncedSaveToDB(updatedFormData.userQnsAns);
      console.log("Form data updated", updatedFormData);
    }
  };

  const handleTimeChange = (questionID: string, selectedTime: Date | null) => {
    console.log("handleInputChange called with:", questionID, selectedTime);
    if (formData) {
      const updatedUserQnsAns = formData.userQnsAns.map((uqa) =>
        uqa.qnsID === questionID ? { ...uqa, dateTimeAns: selectedTime } : uqa,
      );
      console.log(updatedUserQnsAns);

      const updatedFormData = { ...formData, userQnsAns: updatedUserQnsAns };

      if (!updatedFormData) {
        window.location.href = "/memberAccessPage/memberHome";
        console.error("Form Details is missing");
      }

      setFormData(updatedFormData);
      setIsSaving(true);
      debouncedSaveToDB(updatedFormData.userQnsAns);
      console.log("Form data updated", updatedFormData);
    }
  };



  const handleNavigateBack = () => {
    window.history.back();
  };

  return (
    <div>
      <NavBar />
      <section className="bg-theme_green mx-auto my-10 max-w-4xl rounded-md p-6 shadow-md ">
        <div className="flex justify-end flex-end my-3">
          {isSaving&&
          <div className="flex justify-center"><Download className="text-white" /><h1 className="mt-1 mx-2  text-sm font-bold  text-white">Saving...</h1></div>||
          <div className="flex justify-center"><Download className="text-white" /><h1 className="mt-1 mx-2 text-sm font-bold text-white">All Changes Saved</h1></div>}

        </div>
        <div className="m-2 flex justify-between ">
          <h1 className="mt-2 text-3xl font-bold capitalize text-black">
            {formData?.formName}
          </h1>
          <div
            className="bg-theme_purple/90 hover:bg-theme_purple flex cursor-pointer items-center rounded-md p-2"
            onClick={handleNavigateBack}
          >
            <MoveLeft className="mx-3 my-2 cursor-pointer text-white" />
            <h1 className="my-2 text-sm font-bold capitalize text-white">
              BACK
            </h1>
          </div>
        </div>

        <form>
          <div className="mt-4 grid grid-cols-1 gap-6" >
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
                {question.questionType === "Image" && (
                  <ImageUploadField
                    questionID={question.qnsID}
                    question={question.question}
                    public_id={
                      formData?.userQnsAns.find(
                        (uqa) => uqa.qnsID === question.qnsID,
                      )?.public_id ?? null
                    }
                    onChangeUpload={(result: CldUploadWidgetResults) =>
                      handleImageUpload(question.qnsID, result)
                    }
                    onChangeRemove={() =>
                      handleImageRemove(question.qnsID)
                    }
                    answer={
                      formData?.userQnsAns.find(
                        (uqa) => uqa.qnsID === question.qnsID,
                      )?.answer ?? null
                    }
                  />
                )}
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <input
              className="bg-theme_orange text-center transform rounded-md px-6 py-2 leading-5 text-white transition-colors duration-200 hover:bg-pink-700 cursor-pointer focus:outline-none"
              value="Print Or Save Form"
              onClick={handleSaveOrPrint}
            />
          </div>
        </form>
      </section>
    </div>
  );
};

export default FormPage;
