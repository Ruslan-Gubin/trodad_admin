import { useCallback, useEffect, useRef, useState, ChangeEvent  } from "react";

const useMediaFiles = () => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileList, setFileList] = useState<
    { id: string; result: string | ArrayBuffer | null; file: File | null }[]
  >([]);
  const [currentEditId, setCurrentEditId] = useState<string | null>(null);

  const addFile = (result: string | ArrayBuffer, file: File) => {
    const id = crypto.randomUUID();
    setFileList((prev) => [...prev, { id, result: String(result), file }]);
  };

  const editFile = (id: string, result: string | ArrayBuffer, file: File) => {
    setFileList((prev) => {
      const currentFile = prev.find((obj) => obj.id === id);
      if (currentFile) {
        currentFile.file = file;
        currentFile.result = String(result);
      }
      return prev;
    });
    setCurrentEditId(() => null);
  };

  const removeFile = (id: string) => {
    setFileList((prev) => prev.filter((item) => item.id !== id));
  };

  const setFileToBase = useCallback(
    (file: File) => {
      try {
        const render = new FileReader();
        render.readAsDataURL(file);

        render.onloadend = () => {
          if (!render.result) return;

          if (currentEditId) {
            editFile(currentEditId, render.result, file);
          } else {
            addFile(render.result, file);
          }
        };
      } catch (error) {
        console.log(error, "Ошибка при загрузке файла!");
      }
    },
    [currentEditId, handleEditFile]
  );

  const changeFile = useCallback(
    (e: ChangeEvent<HTMLInputElement> | any) => {
      const file = e.target.files ? e.target.files[0] : false;
      if (!file) return;
      setFileToBase(file);
    },
    [setFileToBase]
  );

  const cancelFiles = useCallback(() => {
    setFileList(() => []);
  }, []);

  function handleEditFile(id?: string) {
    if (id) {
      setCurrentEditId(id);
    }

    if (!currentEditId) return;
    
    if (!fileRef.current) {
      const input = document.createElement("input");
      input.type = "file";
      input.addEventListener("change", changeFile);
      input.click();
      input.remove()
    } else {
      fileRef.current.click();
    }
  }

  function fillMedia (arrayMedia: string[]) {
    const id = crypto.randomUUID();
    const result: { id: string; result: string | ArrayBuffer | null; file: File | null }[] = []
    for (let i = 0; i < arrayMedia.length; i++) {
      const currrentMedia = arrayMedia[i]
      result.push({ id, result: currrentMedia, file: null })
    }
    setFileList(result);
  }

  useEffect(() => {
    if (currentEditId) {
      handleEditFile(currentEditId);
    }
  }, [currentEditId, handleEditFile]);

  return {
    fillMedia,
    handleEditFile,
    fileRef,
    changeFile,
    cancelFiles,
    fileList,
    removeFile,
  };
};

export { useMediaFiles };