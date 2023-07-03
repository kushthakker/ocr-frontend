import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import toast, { Toaster } from "react-hot-toast";

function downloadJsonFile(data, filename) {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function App() {
  const [file, setFile] = useState(null);
  const [type, setType] = useState(null);
  const [resp, setResp] = useState(null);
  const [loading, setLoading] = useState(null);
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) return;
    if (!type)
      return toast.error("Please select a type", {
        id: "loading",
      });
    setLoading(true);
    toast.loading("getting OCR", {
      id: "loading",
    });
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `https://ocr-backend-nqb2.onrender.com${type}`,
        formData
      );
      console.log(response.data);
      setResp(response.data);
      setLoading(false);
      toast.success("OCR done", {
        id: "loading",
      });
    } catch (error) {
      console.log(error);
      toast.error("OCR failed", {
        id: "loading",
      });
    }
  };

  return (
    <div className="w-screen h-screen bg-black p-10">
      <div className="bg-[#4F4457] border border-[#1b1b1b] border-bg-[#1b1b1b] rounded-md w-full h-full flex items-center justify-center flex-col gap-4">
        <div className="w-full h-[10%] flex items-center justify-center text-white text-center uppercase text-4xl font-bold">
          PDF OCR
        </div>
        <div className="w-full h-[40%] flex items-center justify-center">
          <div className="flex w-full gap-4 items-center justify-center">
            <div className="beautiful-input-file flex gap-10">
              <label htmlFor="file-upload" className="custom-file-upload">
                <i className="fas fa-cloud-upload-alt"></i> Choose a File to
                Upload
              </label>
              <input id="file-upload" type="file" onChange={handleFileChange} />
              {file && (
                <div className="selected-file-info flex gap-10 items-center justify-center w-fit h-fit">
                  <span className="file-name text-xl uppercase">
                    {file.name}
                  </span>
                  <span className="file-size text-white flex  items-center justify-center font-bold gap-2">
                    <span>Size:</span>
                    <span>{(file.size / 1024).toFixed(2)} KB</span>
                  </span>
                </div>
              )}
              {file && (
                <button
                  onClick={() => handleSubmit()}
                  className="px-4 py-2 rounded-md bg-slate-300 text-xl uppercase font-bold flex items-center justify-center shadow-[0_10px_20px_rgba(240,_46,_170,_0.7)] transition-all duration-500 ease-in-out  hover:-translate-y-2 active:translate-y-2"
                >
                  Get OCR
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="w-full h-[25%] flex items-center justify-evenly px-10 gap-4">
          <div
            className={`w-full h-full rounded-md ${
              type === "tesseract_single"
                ? "bg-white text-black"
                : "bg-black text-white"
            } flex items-center justify-center  hover:bg-white hover:text-black transition-all duration-500 ease-in-out cursor-pointer hover:-translate-y-2 active:translate-y-2`}
            onClick={() => setType("tesseract_single")}
          >
            <div className="text-3xl font-bold">Tesseract Single thread</div>
          </div>
          <div
            className={`w-full h-full rounded-md ${
              type === "tesseract_multi"
                ? "bg-white text-black"
                : "bg-black text-white"
            } flex items-center justify-center  hover:bg-white hover:text-black transition-all duration-500 ease-in-out cursor-pointer hover:-translate-y-2 active:translate-y-2`}
            onClick={() => setType("tesseract_multi")}
          >
            <div className="text-3xl font-bold">Tesseract Multi thread</div>
          </div>
          <div
            className={`w-full h-full rounded-md ${
              type === "gcp_vision"
                ? "bg-white text-black"
                : "bg-black text-white"
            } flex items-center justify-center  hover:bg-white hover:text-black transition-all duration-500 ease-in-out cursor-pointer hover:-translate-y-2 active:translate-y-2`}
            onClick={() => setType("gcp_vision")}
          >
            <div className="text-3xl font-bold">Google Vision</div>
          </div>
        </div>
        {resp && (
          <div className="w-full h-[25%] flex flex-col gap-4 items-center justify-evenly text-white">
            <div className="flex gap-4 underline text-xl">
              <div className="text-md font-bold">Total Time: </div>
              <div>{resp?.totaltime} Sec</div>
            </div>
            <button
              onClick={() => downloadJsonFile(resp, "data.json")}
              className="w-fit h-fit px-4 py-2 justify-center items-center text-xl rounded-md bg-white text-black font-bold transition-all duration-500 ease-in-out cursor-pointer hover:-translate-y-2 active:translate-y-2 shadow-[5px_5px_5px_2.5px_#90cdf4]"
            >
              Download OCR File
            </button>
          </div>
        )}
      </div>
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Define default options
          className: "",
          duration: 5000,
          style: {
            background: "#363636",
            color: "#fff",
          },

          // Default options for specific types
          success: {
            duration: 3000,
            theme: {
              primary: "green",
              secondary: "black",
            },
          },
        }}
      />
    </div>
  );
}

export default App;
