import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Routes, Route } from "react-router-dom";
import KarakuriNavbar from "./karakurinavbar";

// ✅ Import your separate pages
import CreatePart1 from "./createpart1";
import EditPart1 from "./editpart1";
import ScanPart1 from "./scanpart1";
import ListPart1 from "./listpart1";

function KarakuriHome() {
  const [items, setItems] = useState([]);
  const [selectedPart, setSelectedPart] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/items")
      .then((res) => {
        console.log("Fetched items:", res.data);
        setItems(res.data);
      })
      .catch((err) => console.log("Axios error:", err));
  }, []);

  const handleSelectChange = (e) => {
    const partId = e.target.value;
    const part = items.find((item) => item._id === partId);
    setSelectedPart(part);
  };

  return (
    <div className="App">
      {/* Navbar */}
      <KarakuriNavbar />

      <div className="container my-5">
        <h2
          className="text-center mb-5 fw-bold"
          style={{
            backgroundImage: "linear-gradient(to right, #2563eb, #4f46e5)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontSize: "2rem",
          }}
        >
          Explore Karakuri Mechanisms
        </h2>

        {/* Dropdown for Part Names */}
        <div className="card shadow-lg mb-4 p-4">
          <h4
            className="fw-bold mb-3 text-start"
            style={{
              backgroundImage: "linear-gradient(to right, #2563eb, #4f46e5)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Part Name
          </h4>
          <select
            className="form-select"
            onChange={handleSelectChange}
            defaultValue=""
          >
            <option value="" disabled>
              Select a Part
            </option>
            {items.map((item) => (
              <option key={item._id} value={item._id}>
                {item["Part Name "]}
              </option>
            ))}
          </select>
        </div>

        {/* Description Card */}
        <div className="card shadow-lg mb-4 p-4">
          <h4
            className="fw-bold mb-3 text-start"
            style={{
              backgroundImage: "linear-gradient(to right, #2563eb, #4f46e5)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Description
          </h4>
          <p className="text-muted">
            {selectedPart
              ? selectedPart["Part description ( What ) "]
              : "Select a part to see the description."}
          </p>
        </div>

        {/* Mechanism Card */}
        <div className="card shadow-lg mb-4 p-4">
          <h4
            className="fw-bold mb-3 text-start"
            style={{
              backgroundImage: "linear-gradient(to right, #2563eb, #4f46e5)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Mechanism
          </h4>
          <p className="text-muted">
            {selectedPart
              ? selectedPart["Mechanism ( How )"]
              : "Select a part to see the mechanism."}
          </p>
        </div>

        {/* Part Image */}
        <div className="card shadow-lg mb-4 p-4">
          <h4
            className="fw-bold mb-3 text-start"
            style={{
              backgroundImage: "linear-gradient(to right, #2563eb, #4f46e5)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Part Image
          </h4>
          <div className="text-center">
            <img
              src={selectedPart?.image || "https://via.placeholder.com/400x300"}
              className="img-fluid rounded"
              alt={selectedPart?.["Part Name "] || "Part"}
            />
          </div>
        </div>

        {/* Part Video */}
        <div className="card shadow-lg mb-4 p-4">
          <h4
            className="fw-bold mb-3 text-start"
            style={{
              backgroundImage: "linear-gradient(to right, #2563eb, #4f46e5)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Part Working Video
          </h4>
          <div className="text-center">
            <video
              className="rounded"
              width="70%"
              controls
              poster="https://via.placeholder.com/400x300"
            >
              <source
                src={selectedPart?.video || "your-video.mp4"}
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        {/* Applications */}
        <div className="card shadow-lg mb-4 p-4">
          <h4
            className="fw-bold mb-3 text-start"
            style={{
              backgroundImage: "linear-gradient(to right, #2563eb, #4f46e5)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Applications
          </h4>
          <div className="d-flex flex-column flex-md-row align-items-center">
            <p className="text-muted mb-3 mb-md-0 me-md-3">
              {selectedPart
                ? selectedPart["Application ( Where ) "]
                : "Select a part to see the applications."}
            </p>
            <img
              src={
                selectedPart?.applicationImage ||
                "https://via.placeholder.com/300x200"
              }
              alt="Application"
              className="img-fluid rounded"
              style={{ maxWidth: "300px" }}
            />
          </div>
        </div>
      </div>

      <footer className="bg-light text-center py-3 border-top">
        <small className="text-muted">
          © 2025 Karakuri Visualization Project | Created by Nayana
        </small>
      </footer>
    </div>
  );
}

function KarakuriApp() {
  return (
    <>
      {/* Navbar remains constant across all Karakuri pages */}
      <KarakuriNavbar />

      <Routes>
        <Route path="/" element={<KarakuriHome />} />
        <Route path="/createpart1" element={<CreatePart1 />} />
        <Route path="/editpart1" element={<EditPart1 />} />
        <Route path="/scanpart1" element={<ScanPart1 />} />
        <Route path="/listpart1" element={<ListPart1 />} />
      </Routes>
    </>
  );
}

export default KarakuriApp;




