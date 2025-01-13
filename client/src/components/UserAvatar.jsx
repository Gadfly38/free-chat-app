import React from "react";

const UserAvatar = ({ name, email }) => {
  const firstLetter = name?.charAt(0).toUpperCase() || "?";

  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white text-xl font-medium">
        {firstLetter}
      </div>
      <div>
        <p className="font-medium text-gray-900">Welcome, {name}!</p>
        <p className="text-sm text-gray-500 truncate">{email}</p>
      </div>
    </div>
  );
};

export default UserAvatar;

// Usage:
// <UserAvatar name="Arturu" email="gadflyarthurburton@gmail.com" />
