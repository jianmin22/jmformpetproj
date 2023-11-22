import React from "react";
import { api } from "~/utils/api";
import { Trash2 } from "lucide-react";
import LoadingComponent from "./loadingComponent";
import Link from "next/link"

const ShowAllFormNames = () => {
  const { data, isLoading: dataLoading, refetch } = api.form.getFormNamesByID.useQuery();
  const deleteForm = api.form.deleteForm.useMutation();
  const onClickDelete =async (formID: string) => {
    try {
      await deleteForm.mutateAsync({ formID }, {
        onSuccess: () => {
        refetch()
        },
        onError: (error) => {
          console.log(error.message)
        }
      })
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
        <>


        <div className="flex flex-col items-center min-w-max bg-white rounded p-4 cursor-pointer m-2 ">
          <Link  href={`/memberAccessPage/${item.formID}`} passHref>
        <div
          key={index}
          className="flex flex-col items-center min-w-max bg-white rounded p-4 cursor-pointer m-2 "
        >
          <h3 className="text-lg">Edit "{item.formName}" Now!</h3>
        </div>
        </Link>
        <Trash2 className="m-2 text-red-normal hover:text-red-dark" onClick={()=>onClickDelete(item.formID)}/>
        </div>
       
        </>
      ))}
    </div>
  );
};

export default ShowAllFormNames;
