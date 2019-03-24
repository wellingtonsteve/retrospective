import QRCode from "qrcode.react";
import React from "react";
import Card from "react-bootstrap/Card";

const LocationCode = () => {
  const url = window.location.href.replace(window.location.search, "");
  return (
    <Card style={{ textAlign: "center" }}>
      <Card.Body style={{ display: "flex" }}>
        <div style={{ flex: "0 0 50%" }}>
          <QRCode
            style={{ marginRight: "50px" }}
            size={300}
            value={url}
            level={"H"}
          />
          <br />
          <h1>{url}</h1>
        </div>
        <div style={{ flex: 1 }}>
          <QRCode
            size={300}
            value="https://tinyurl.com/retro2019"
            level={"H"}
          />
          <br />
          <h1>https://tinyurl.com/retro2019</h1>
        </div>
      </Card.Body>
    </Card>
  );
};

export default LocationCode;
