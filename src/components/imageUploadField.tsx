import React, { useState } from "react";
import { api } from "~/utils/api";
import { CldUploadButton, CldUploadWidgetResults } from "next-cloudinary";
import { Img } from "react-image";
import { Image } from "lucide-react";
import {title } from "process";
import { ImageUploadFieldProps } from "~/types/ImageUploadFieldProps";

const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  question,
  questionID,
  answer,
  public_id,
  onChangeUpload,
  onChangeRemove
}) => {
  if (!answer) {
    answer = "";
  }
  const removeImage = api.image.deleteImage.useMutation();
  const handleRemoveImage = async(e:React.FormEvent, public_id:string)=>{
    e.preventDefault();
    try {
      await removeImage.mutateAsync({public_id });
      onChangeRemove();
    } catch (err) {
      console.error("Error removing image", err);
    }
  }
  return (
    <div>
      <label className="text-black" htmlFor={questionID}>
        {question} (optional)
      </label>

      <CldUploadButton
          onUpload={(result: CldUploadWidgetResults) => onChangeUpload(result)}
        className={`bg-gray mt-4 grid h-48 w-full place-items-center rounded-md border-2 border-dotted relative ${answer && 'pointer-events-none'}`}
        uploadPreset='i4htumof'
      >
        <Image />
        {answer && (
          <Img
            src={answer}
            className="absolute object-contain inset-0 h-full w-full"
            alt={title}
          />
        )}
      </CldUploadButton>
      {public_id && (<button onClick={(e)=>handleRemoveImage(e,public_id)} className="py-2 px-4 rounded-md font-bold w-fit bg-red-normal hover:bg-red-dark text-white my-4">Remove Image</button>)}
    </div>
  );
};

export default ImageUploadField;
