import React, { useState } from "react";
import axios from "axios";

const SLACalculator = () => {
  const [category, setCategory] = useState("");
  const [concern, setConcern] = useState("");
  const [startDate, setStartDate] = useState("");
  const [deadline, setDeadline] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/calculate", {
        category,
        concern,
        startDate,
      });
      // Format the deadline to MM/DD/YYYY
      const formattedDate = new Date(response.data.deadline)
        .toLocaleDateString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        });
      setDeadline(formattedDate);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred");
      setDeadline(null);
    }
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      textAlign: "center",
    }}>
      <h1>SLA Calculator</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <select value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="">Select Category</option>
          <option value="Incident Report">Incident Report</option>
          <option value="Police Report">Police Report</option>
          <option value="Photo Submission">Photo Submission</option>
        </select>
        <select value={concern} onChange={(e) => setConcern(e.target.value)} required>
          <option value="">Select Concern</option>
          {category === "Incident Report" && (
            <>
              <option value="Delivered Not Received">Delivered Not Received</option>
              <option value="Item Missing">Item Missing</option>
              <option value="Pre-Delivery">Pre-Delivery</option>
              <option value="Returns Related">Returns Related</option>
            </>
          )}
          {category === "Police Report" && (
            <>
              <option value="Delivered Not Received">Delivered Not Received</option>
              <option value="Item Missing">Item Missing</option>
            </>
          )}
          {category === "Photo Submission" && (
            <>
              <option value="Damaged/Defective">Damaged/Defective</option>
              <option value="Wrong Item">Wrong Item</option>
            </>
          )}
        </select>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
        <button type="submit">Calculate Deadline</button>
      </form>
      {deadline && <h2>Deadline: {deadline}</h2>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default SLACalculator;
