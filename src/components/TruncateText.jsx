import React from "react";

const TruncateText = ({ children, length }) => {
  return <>{children.length > length ? `${children.substring(0, length)}...` : children}</>;
};

export default TruncateText;
