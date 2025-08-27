import { Metadata } from "next";
import { BackButton } from "@/components/functional/back-button";

type PageProps = {
  searchParams: { id?: string; message?: string };
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { id, message } = await searchParams;

  const messages: Record<string, string> = {
    "403": "Permission Denied",
    "404": "Page Not Found",
    "405": "Permission Denied / Page Not Found",
    "500": "Server Error",
  };

  let title = "Error";
  if (message) {
    title = message;
  } else if (id && messages[id]) {
    title = `${id} - ${messages[id]}`;
  }

  return {
    title,
    description: "An error occurred while processing your request.",
  };
}

export default async function ErrorPage({ searchParams }: PageProps) {
  const { id, message } = await searchParams;

  const messages: Record<string, string> = {
    "403": "You do not have permission to access this page.",
    "404": "The page you are looking for could not be found.",
    "405": "You either do not have permission to access this page, or the page you are looking for could not be found.",
    "500": "An unexpected server error occurred.",
  };

  const displayMessage = message || (id && messages[id]) || "An unknown error occurred.";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-5 bg-gray-100 text-center">
      <div className="bg-white p-8 min-w-[400px] rounded-2xl shadow-md max-w-lg relative">
        <BackButton className="absolute l-10% t-10%" label="Back"/>
        {id ? 
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error - {id}</h1>
        :
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        }
        <p className="text-gray-700">{displayMessage}</p>
      </div>
    </div>
  );
}

{/* <div className="mt-6 pl-auto pr-auto"> */}
{/* </div> */}