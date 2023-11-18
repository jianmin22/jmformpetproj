import React from "react";
import { api } from "~/utils/api";

const ShowAllFormNames = () => {
  const { data, isLoading: dataLoading } = api.form.getFormNamesByID.useQuery();

  const onClickEditForm = (formID: string) => {
    window.location.href = (`/memberAccessPage/form?formID=${formID}`);
  };

  if (dataLoading) return <div className="flex-grow">Loading...</div>;

  if (!data || data.length === 0) return <div>No Forms Yet</div>;

  return (
    <div className="flex overflow-x-auto p-4 max-w-screen-md mx-auto">
      {data.map((item, index) => (
        <div
          key={index}
          className="min-w-max rounded border p-4 cursor-pointer m-2"
          onClick={() => onClickEditForm(item.formID)}
        >
          Edit "{item.formName}" Now!
        </div>
      ))}
    </div>
  );
};

export default ShowAllFormNames;
