import React, { useState } from "react";
import { FaSearch, FaCamera } from "react-icons/fa";

const ScanPart1 = () => {
  const [partId, setPartId] = useState("");

  const handleViewPart = () => {
    if (!partId.trim()) {
      alert("Please enter a Part ID!");
      return;
    }
    console.log("Viewing part:", partId);
    // Later: navigate to part details page or show fetched info
  };

  const handleOpenCamera = () => {
    console.log("Opening camera to scan...");
    // Later: add camera scanning functionality
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f0f4ff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        className="card shadow-lg p-4 text-center"
        style={{
          maxWidth: "400px",
          width: "100%",
          borderRadius: "16px",
          backgroundColor: "#ffffff",
        }}
      >
        {/* Search Icon */}
        <div
          style={{
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            backgroundColor: "#eae8ff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "0 auto 20px auto",
          }}
        >
          <FaSearch size={28} color="#6366f1" />
        </div>

        <h4 className="fw-bold mb-2">View Part</h4>
        <p className="text-muted mb-4">
          Enter a part ID or scan a barcode to view content
        </p>

        {/* Input Field */}
        <div className="mb-3 text-start">
          <label htmlFor="partId" className="form-label fw-semibold">
            Part ID
          </label>
          <input
            id="partId"
            type="text"
            placeholder="Enter part ID (e.g., 123)"
            value={partId}
            onChange={(e) => setPartId(e.target.value)}
            className="form-control"
            style={{
              borderRadius: "10px",
              border: "1px solid #d1d5db",
            }}
          />
        </div>

        {/* View Part Button */}
        <button
          className="btn w-100 mb-3"
          onClick={handleViewPart}
          style={{
            backgroundColor: "#a5b4fc",
            color: "white",
            fontWeight: "600",
            borderRadius: "10px",
            height: "45px",
          }}
        >
          View Part
        </button>

        {/* Open Camera Button */}
        <button
          className="btn w-100"
          onClick={handleOpenCamera}
          style={{
            backgroundColor: "#111827",
            color: "white",
            fontWeight: "600",
            borderRadius: "10px",
            height: "45px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <FaCamera />
          Open Camera to Scan
        </button>
      </div>
    </div>
  );
};

export default ScanPart1;

