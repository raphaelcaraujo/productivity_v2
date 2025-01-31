import React, { useState, useEffect } from "react";

function App() {
  const todayDate = new Date().toISOString().split("T")[0]; // Ensure proper timezone

  const [formData, setFormData] = useState({
    dueDate: todayDate,
    completeDate: "",
    description: "",
    category: "Work",
    timeCommitment: 0,
  });

  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchAllTasks();
  }, []);

  const fetchAllTasks = async () => {
    try {
      const response = await fetch("https://project-productivity-backend.vercel.app/all-tasks"); // Updated API URL
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("❌ Error fetching tasks:", error);
    }
  };

  const markAsCompleted = async (taskId) => {
    try {
      const response = await fetch(`https://project-productivity-backend.vercel.app/update-task/${taskId}`, { // Updated API URL
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completeDate: todayDate }),
      });
      if (response.ok) {
        fetchAllTasks();
      } else {
        console.error("Failed to update task");
      }
    } catch (error) {
      console.error("❌ Error updating task:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("📩 Sending Data:", formData);

    try {
      const response = await fetch("https://project-productivity-backend.vercel.app/save-task", { // Updated API URL
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Data saved successfully!");
        fetchAllTasks();
      } else {
        alert("Failed to save data.");
      }
    } catch (error) {
      console.error("❌ Error submitting form:", error);
      alert("An error occurred while submitting the form.");
    }
  };



  // Calculate daily score
  const dailyScore = tasks
    .filter(task => task.completeDate === todayDate)
    .reduce((total, task) => total + (task.timeCommitment || 0), 0);

  // Progress bar calculation
  const maxScore = 10;
  const progressPercentage = Math.min((dailyScore / maxScore) * 100, 100);
  const extraPercentage = dailyScore > maxScore ? ((dailyScore - maxScore) / maxScore) * 100 : 0;

  // Filter tasks
  const comingTasks = tasks.filter(task => !task.completeDate).sort((a, b) => {
    const categoryOrder = { "Work": 1, "Financial Management": 2, "Exercise": 3, "Urbeplan": 4, "Health": 5 };
    return (categoryOrder[a.category] || 6) - (categoryOrder[b.category] || 6);
  });

  const completedTasks = tasks.filter(task => task.completeDate);

  return (

    
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", backgroundColor: "#D5FFD0" }}>
      
      {/* Header */}
      <div style={{ backgroundColor: "#164B60", color: "white", padding: "30px", textAlign: "center", fontSize: "28px", fontWeight: "bold" }}>
        Productivity App
      </div>
      {/* All content below header*/}
      <div style={{ display: "flex", flex: 1, padding: "2% 2%", backgroundColor: "#4FC0D0" }}> 
        
        {/* Left Side - Application Visibility */}
        <div style={{ width: "70%", paddingRight: "3%" }}>
          
          {/* What is Coming */}
          {/* Completed Tasks Section */}
          {/* Completed Tasks Section */}
          <div className="rounded-box">
          <h3>Open Tasks</h3>
            {tasks.filter(task => !task.completeDate).length > 0 ? (
              <table border="1" style={{ width: "100%", marginTop: "10px", backgroundColor: "#164B60", color: "white", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th>Due Date</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Time Commitment</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks
                    .filter(task => !task.completeDate)
                    .map((task, index) => (
                      <tr key={index} style={{ backgroundColor: "White", color: "Black" }}> {/* White green background */}
                        <td>{task.dueDate}</td>
                        <td>{task.description}</td>
                        <td>{task.category}</td>
                        <td>{task.timeCommitment}</td>
                        <td>
                          <button 
                            onClick={() => markAsCompleted(task._id)} 
                            style={{ backgroundColor: "#0D9276", color: "white", border: "none", padding: "5px 10px", cursor: "pointer" }}>
                            Mark as Complete
                          </button>
                        </td>
                      </tr>
                    ))}
                          </tbody>
                  </table>
                ) : (
                  <p>No tasks due today.</p> // ✅ Corrected message placement
                )}
 
          </div>



          {/* Score Progress Bar & Completed Tasks */}
          <div className="rounded-box">
            <h3>Score for the Day: {dailyScore}</h3>
            <div style={{ width: "100%", height: "20px", backgroundColor: "#ddd", borderRadius: "5px", marginTop: "5px" }}>
              <div style={{ width: `${progressPercentage}%`, height: "100%", backgroundColor: "#0D9276", borderRadius: "5px" }}></div>
            </div>
            <h3>Completed Tasks</h3>  
            {completedTasks.filter(task => task.completeDate === todayDate).length > 0 ? (
              <table border="1" style={{ width: "100%", marginTop: "10px", backgroundColor: "#EAEAEA", color: "#555", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Time Commitment</th>
                  </tr>
                </thead>
                <tbody>
                  {completedTasks
                    .filter(task => task.completeDate === todayDate)
                    .map((task, index) => (
                      <tr key={index}>
                        <td>{task.description}</td>
                        <td>{task.category}</td>
                        <td>{task.timeCommitment}</td>
                      </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No completed tasks today.</p>  // ✅ Corrected structure
            )}
          </div>

        </div>

        {/* Right Side - Full Form */}
        <div className="rounded-box" style={{ width: "30%" }}>
          <h2>Add More Tasks</h2>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <label><strong>Due Date:</strong></label>
            <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} required />

            <label><strong>Complete Date:</strong></label>
            <input type="date" name="completeDate" value={formData.completeDate} onChange={handleChange} />

            <label><strong>Description:</strong></label>
            <textarea name="description" value={formData.description} onChange={handleChange} required />

            <label><strong>Category:</strong></label>
            <select name="category" value={formData.category} onChange={handleChange}>
              <option value="Work">Work</option>
              <option value="Urbeplan">Urbeplan</option>
              <option value="Health">Health</option>
              <option value="Financial Management">Financial Management</option>
              <option value="Exercise">Exercise</option>
            </select>

            <label><strong>Time Commitment:</strong></label>
            <select name="timeCommitment" value={formData.timeCommitment} onChange={handleChange}>
              {[...Array(11).keys()].map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>

            <button type="submit" style={{ backgroundColor: "#0D9276", color: "white", padding: "10px", border: "none", cursor: "pointer" }}>
              Submit
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default App;
