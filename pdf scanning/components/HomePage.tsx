// "use client";
// import React, { useState } from "react";
// import { useToast } from "./ui/use-toast";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import FileUpload from "./FileUploader";

// function HomePage() {
//   const [uploadedFile, setUploadedFile] = useState<File | null>(null);
//   const { toast } = useToast();
//   const [parsedText, setParsedText] = useState("");
//   const [open, setOpen] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const handleFileUpload = async (file: File) => {
//     setUploadedFile(() => {
//       return file;
//     });

//     setOpen(() => {
//       return false;
//     });
//     toast({
//       variant: "default",
//       title: "File Uploaded",
//       description: `${file.name} has been uploaded successfully.`,
//     });
//     setLoading(true);
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogTrigger asChild>
//           <button className="bg-black hover:bg-gray-700 text-white text-lg font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
//             Upload File
//           </button>
//         </DialogTrigger>
//         <DialogContent className="sm:max-w-[425px] p-6 bg-white rounded shadow-md">
//           <DialogHeader>
//             <DialogTitle className="text-center text-lg font-bold">
//               Upload your file
//             </DialogTitle>
//           </DialogHeader>
//           <div className="grid gap-4 py-4">
//             <FileUpload
//               onFileUpload={handleFileUpload}
//               setParsedText={(text: string) => {
//                 setParsedText(text);
//                 setLoading(false);
//               }}
//               maxSize={8 * 1024 * 1024} // 8 MB
//             />
//           </div>
//         </DialogContent>
//       </Dialog>
//       {loading && (
//         <div className="mt-6 flex items-center justify-center">
//           <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
//         </div>
//       )}
//       {parsedText && (
//         <div className="mt-6 w-full max-w-3xl bg-white p-4 rounded shadow">
//           <h3 className="text-xl font-semibold mb-2">Parsed Text</h3>
//           <p className="bg-gray-100 p-4 rounded whitespace-pre-wrap">
//             {parsedText}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default HomePage;

"use client";
import React, { useState } from "react";
import { useToast } from "./ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import FileUpload from "./FileUploader";
import ResultDisplay from "./ResultDisplay";

function HomePage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const [parsedText, setParsedText] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiResult, setApiResult] = useState<string>("");
  const prompt = "Based on the particular historical reports of the patient predict the possible future diseases he/she can get, provide the prediction with showing in how years the particular diseases can harm with providing which has the highest chances in 100 and which has the lowest in those.";

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setOpen(false);
    toast({
      variant: "default",
      title: "File Uploaded",
      description: `${file.name} has been uploaded successfully.`,
    });
    setLoading(true);
  };

  // const handleSendToApi = async () => {
  //   if (!parsedText) return;

  //   try {
  //     const response = await fetch("/api/prompter", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ message: parsedText }),
  //     });

  //     if (!response.ok) {
  //       throw new Error("Failed to fetch response");
  //     }

  //     const data = await response.json();
  //     setApiResult(data.result || "No result returned.");
  //   } catch (error) {
  //     console.error("Error sending parsed text to API:", error);
  //     toast({
  //       variant: "destructive",
  //       title: "Error",
  //       description: "Failed to get a response from the API.",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSendToApi = async () => {
    if (!parsedText) return;
  
    try {
      const response = await fetch("/api/prompter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt + "\n\n" + parsedText }],
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch response");
      }
  
      const data = await response.json();
      setApiResult(data.content || "No result returned.");
    } catch (error) {
      console.error("Error sending parsed text to API:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get a response from the API.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Use effect to send parsed text when it's updated
  React.useEffect(() => {
    if (parsedText) {
      handleSendToApi();
    }
  }, [parsedText]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="bg-black hover:bg-gray-700 text-white text-lg font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Upload File
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] p-6 bg-white rounded shadow-md">
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-bold">
              Upload your file
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <FileUpload
              onFileUpload={handleFileUpload}
              setParsedText={(text: string) => {
                setParsedText(text);
                setLoading(false);
              }}
              maxSize={8 * 1024 * 1024} // 8 MB
            />
          </div>
        </DialogContent>
      </Dialog>

      {loading && (
        <div className="mt-6 flex items-center justify-center">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
        </div>
      )}

      {/* {parsedText && (
        <div className="mt-6 w-full max-w-3xl bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Parsed Text</h3>
          <p className="bg-gray-100 p-4 rounded whitespace-pre-wrap">
            {parsedText}
          </p>
        </div>
      )} */}

      {/* Display API Result */}
      {apiResult && <ResultDisplay result={apiResult} />}
    </div>
  );
}

export default HomePage;