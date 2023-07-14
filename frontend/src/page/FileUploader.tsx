// import { useUploadFileMutation } from '../generated/graphql';
// import { useRef } from 'react';

// const FileUploader: React.FC = () => {
//   const [uploadFile] = useUploadFileMutation();
//   const fileInput = useRef<HTMLInputElement>(null);

//   const upload = () => {

//     let file = fileInput.current?.files?.[0];
//     console.log(file)
//     if (file) {
//       uploadFile({ variables: { file } });
//     }
//   };

//   return (
//     <form >
//       <input type="file" ref={fileInput} />
//       <button onClick={upload}>Upload</button>
//     </form >
//   );
// };

// export default FileUploader;