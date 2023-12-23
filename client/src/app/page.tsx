"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useState } from "react";
import ReactJson from "react-json-view";

export default function Home() {
  const { user, error, isLoading } = useUser();

  const [apiUser, setApiUser] = useState(null);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  async function handleApiCall() {
    const response = await fetch("/api/login", {
      method: "GET",
    });
    const data = await response.json();

    setApiUser(data);
  }

  if (user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center">
          <div className="font-bold">Welcome {user.name}!</div>
          <div className="font-bold m-2 flex flex-col px-4 m-4">
            <button className="bg-blue-500 p-4 hover:bg-blue-700 text-white font-bold py-2 px-4 m-4 rounded">
              <a href="/api/auth/logout">Logout</a>
            </button>
            <button
              className="bg-blue-500 p-4 hover:bg-blue-700 text-white font-bold py-2 px-4 m-4 rounded"
              onClick={handleApiCall}
            >
              Obtain API from Server
            </button>
            <div className="px-4 m-4">
              <div className="font-xs px-4 m-4">Verified User by Server:</div>
              {apiUser && (
                <ReactJson
                  src={apiUser}
                  collapsed={true}
                  collapseStringsAfterLength={20}
                  theme={"monokai"}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col items-center">
        <div className="font-bold">Welcome to the Auth0</div>
        <button className="bg-blue-500 p-4 hover:bg-blue-700 text-white font-bold py-2 px-4 m-4 rounded">
          <a href="/api/auth/login">Login</a>
        </button>
      </div>
    </div>
  );
}
