// import React, { useState } from "react";
// import { api } from "~/utils/api";

// interface FileUploadFieldProps {
//   question: string;
//   userQnsAnsID: string;
//   questionID: string;
//   answer: string | null;
//   onChange: (answer: string | null) => void;
// }


// const FileUploadField: React.FC<FileUploadFieldProps> = ({
//   question,
//   userQnsAnsID,
//   questionID,
//   answer,
//   onChange,
// }) => {
//     const [file, setFile] = useState<string | null>(answer);
//   const uploadFile = api.form.uploadFile.useMutation();
//   const handleFileChange = async (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     if (!file) {
//       const selectedFile = e.target.files?.[0];
  
//       if (selectedFile) {
//         try {
//           const formData = new FormData();
//           formData.append("file", selectedFile);
  
//           const { fileUrl } = await uploadFile.mutateAsync({
//             file: { path:selectedFile.name },
//           });
//           setFile(fileUrl);
//           onChange(fileUrl);
//         } catch (error) {
//           console.error("Error uploading file:", error);
//         }
//       }
//     }
//   };


//   const handleDeleteFile = () => {
//     setFile(null);
//     onChange(null);
//   };

//   return (
//     <div>
//       <label className="text-black" htmlFor={questionID}>
//         {question}
//       </label>

//       {file && (
//         <div>
//           <a href={file} target="_blank" rel="noopener noreferrer">
//             {file}
//           </a>
//           <button onClick={handleDeleteFile}>Delete</button>
//         </div>
//       )}

//       {!file && (
//         <input
//           type="file"
//           id={userQnsAnsID}
//           onChange={handleFileChange}
//         />
//       )}
//     </div>
//   );
// };

// export default FileUploadField;
