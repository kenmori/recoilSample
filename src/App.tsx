import * as React from "react";
import { useDropzone } from "react-dropzone";

import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from "recoil";

import "./styles.css";

const initialState: File[] = [];

const fileState = atom({
  key: "fileState",
  default: initialState
});

const b = selector({
  key: "b",
  get: ({ get }: any) => {
    const a = get(fileState);
    return a;
  }
});

const Child = () => {
  const c = useRecoilValue(b);
  // if(!isRecoilValue(c)){
  //   return <div>not RecoilValue</div>
  // }
  return <div>{c.length !== 0 ? c[0].name : ""}</div>;
};

function MyDropzone() {
  const [file, setFile] = useRecoilState(fileState);

  const onDrop = React.useCallback(
    acceptedFiles => {
      setFile((state: typeof initialState) => {
        return acceptedFiles;
      });
    },
    [setFile]
  );

  const getFilesFromEvent = React.useCallback(async event => {
    let files = [];
    const fileList = event.dataTransfer
      ? event.dataTransfer.files
      : event.target.files;

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList.item(i);
      Object.defineProperty(file, "myProp", {
        value: true
      });

      files.push(file);
    }
    return files;
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    getFilesFromEvent
  });
  console.log("filea", file?.name || "");
  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      )}
      <Child />
    </div>
  );
}

export default function App() {
  return (
    <RecoilRoot>
      <MyDropzone />
    </RecoilRoot>
  );
}
