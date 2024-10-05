"use client";
import React from "react";
import Header from "@/components/Header";
import { useGetProfileQuery, useUpdateProfileMutation } from "@/state/api";

type Props = {};

const SettingsPage = (props: Props) => {
  const { data: profile, isError } = useGetProfileQuery();
  const [updateUser] = useUpdateProfileMutation();
  const [username, setUsername] = React.useState<string>("");

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-3xl font-normal dark:text-white">
          Sign In to access this feature
        </h1>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-500 text-xl flex items-center justify-center">
        An Error Occurred
      </div>
    );
  }

  const handleClick = () => {
    updateUser({ userId: profile?.user?.userId, username: username });
  };

  return (
    <div className="m-4">
      <Header name="Account Settings" />
      <div className="settings-container p-4 md:p-6 lg:p-8">
        <h2 className="text-lg font-semibold dark:text-white mb-4">Account</h2>
        <p className="text-sm text-gray-500 mb-6">
          This is the account settings page
        </p>

        <div className="space-y-4">
          {profile?.user?.username && (
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full p-2 pl-10 text-sm text-gray-700 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          )}

          <input
            type="text"
            placeholder="ID"
            value={profile?.user?.userId}
            disabled={true}
            className="w-full p-2 pl-10 text-sm text-gray-700 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent cursor-not-allowed opacity-50"
          />
          <button
            onClick={handleClick}
            className="save-button w-full mt-4 py-2 px-4 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          >
            Update
          </button>
        </div>

        {/* <Modal name="Change Password" isOpen={false} onClose={() => {}}>
        </Modal> */}
      </div>
    </div>
  );
};

export default SettingsPage;
