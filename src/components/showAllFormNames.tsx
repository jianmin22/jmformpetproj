import React from "react";
import { api } from "~/utils/api";
import { Trash2 } from "lucide-react";
import LoadingComponent from "./loadingComponent";
const ShowAllFormNames = () => {
  const { data, isLoading: dataLoading } = api.form.getFormNamesByID.useQuery();

  const onClickEditForm = (formID: string) => {
    window.location.href = (`/memberAccessPage/form?formID=${formID}`);
  };
  const deleteForm = api.form.deleteForm.useMutation();
  const onClickDelete =async (formID: string) => {
    try {
      await deleteForm.mutateAsync({ formID });
      console.log("Form delete successfully");
    } catch (err) {
      console.error("Error Adding Form", err);
    }
  };

  if (dataLoading) return <LoadingComponent />;

  if (!data || data.length === 0) return <div>No Forms Yet</div>;

  return (
    <div className="flex overflow-x-auto p-4 max-w-screen-md mx-auto">
      {data.map((item, index) => (
        <div
          key={index}
          className="flex flex-col items-center min-w-max bg-white rounded p-4 cursor-pointer m-2 "
          onClick={() => onClickEditForm(item.formID)}
        >
          <h3 className="text-lg">Edit "{item.formName}" Now!</h3>
          
          <Trash2 className="m-2 text-red-normal hover:text-red-dark" onClick={()=>onClickDelete(item.formID)}/>
        </div>
      ))}
    </div>
  );
};

export default ShowAllFormNames;
