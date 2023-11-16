import React from "react";
import { api } from "~/utils/api";

const ShowAllFormNames = () => {
  const { data, isLoading: dataLoading } = api.form.getFormNamesByID.useQuery();

  if (dataLoading) return <div className="flex-grow">Loading...</div>;

  if (!data || data.length === 0) return <div>No Forms Yet</div>;

  return (
    <div className="flex overflow-x-auto p-4 space-x-4">
      {data.map((item, index) => (
        <div key={index} className="border rounded p-4 min-w-max">
          Edit "{item.formName}" Now!
        </div>
      ))}
    </div>
  );
};

export default ShowAllFormNames;
