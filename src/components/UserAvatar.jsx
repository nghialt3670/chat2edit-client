import React from "react";
import { FaUser } from "react-icons/fa";
import useUser from "../hooks/useUser";

const defaultStyles = {
  zIndex: 1000,
  cursor: "default",
};

export default function UserAvatar({ size, onClick }) {
  const { user, setUser } = useUser();
  const styles = {
    ...defaultStyles,
    width: size,
    height: size,
    cursor: onClick ? "pointer" : "default",
  };

  const handleAvatarClick = (e) => {
    onClick(e);
  };

  return (
    <div
      className="rounded-full"
      style={styles}
      onClick={onClick ? handleAvatarClick : undefined}
    >
      {user ? (
        <img className="size-full" src={user.avatar} alt="User Avatar" />
      ) : (
        <FaUser className="size-full" />
      )}
    </div>
  );
}
