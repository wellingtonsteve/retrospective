import QRCode from "qrcode.react";
import React from "react";
import Card from "react-bootstrap/Card";

const LocationCode = () => {
  const url = window.location.href.replace(window.location.search, "");
  return (
    <Card style={{ textAlign: "center" }}>
      <Card.Body>
        <QRCode size={300} value={url} level={"H"} />
        <br />
        <h1>{url}</h1>
      </Card.Body>
    </Card>
  );
};

export default LocationCode;
