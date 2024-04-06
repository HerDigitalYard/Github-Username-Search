import React from "react";
import RepoList from "./RepoList";

export default function UserLayout({ userData }) {
  return (
    <>
      <div className="">
        <div className="flex flex-col items-center pb-10 gap-4">
          <img
            className="w-24 h-24 rounded-full shadow-lg"
            src={userData.avatar_url}
            alt={userData.login}
          />
          <h5 className="text-xl font-medium text-gray-900 dark:text-white">
            {userData.login}
          </h5>
          <span className="text-sm text-gray-500 dark:text-gray-400 text-center">
            {userData.bio}
          </span>
          <a
            href={userData.html_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center font-medium text-blue-600 hover:text-blue-800 dark:text-blue-500 dark:hover:text-blue-700"
          >
            LinkedIn Profile
            <svg
              className=" w-2.5 h-2.5 ms-2 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path stroke="currentColor" d="m1 9 4-4-4-4" />
            </svg>
          </a>
          <RepoList userData={userData}></RepoList>
        </div>
      </div>
    </>
  );
}
