import QRCode from "qrcode.react";
import React from "react";

const LocationCode = () => {
  const url = window.location.href.replace(window.location.search, "");
  return (
    <div>
      <QRCode size={300} value={url} />
      <br />
      <h1>{url}</h1>
    </div>
  );
};

export default LocationCode;
