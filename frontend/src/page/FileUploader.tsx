import { useUploadFileMutation, UploadFileMutationVariables } from '../generated/graphql';
import { useRef } from 'react';

const FileUploader: React.FC = () => {
  const [uploadFile] = useUploadFileMutation();
  const fileInput = useRef<HTMLInputElement>(null);

  const upload = () => {
    let file = fileInput.current?.files?.[0];
    if (file) {
      uploadFile({ variables: { file } });
    }
  };

  return (
    <div>
      <input type="file" ref={fileInput} />
      <button onClick={upload}>Upload</button>
    </div>
  );
};

export default FileUploader;