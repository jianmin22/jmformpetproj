import { CldUploadWidgetResults } from "next-cloudinary";
export interface ImageUploadFieldProps {
    question: string;
    questionID: string;
    answer: string | null;
    public_id: string | null;
    onChangeUpload: (result: CldUploadWidgetResults) => void;
    onChangeRemove:()=>void;
  }
  