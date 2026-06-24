import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// IMPORT ADDED: Brought back getPatients to check for duplicates
import { addPatient, getPatients } from './dataService'; 

export default function AddPatient() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ name: '', age: '' });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors
    
    // 1. Check if fields are empty
    if (!formData.name || !formData.age) {
        setErrors({ general: "All fields are required." });
        return;
    }
    
    // 2. DUPLICATE VALIDATION LOGIC
    // Fetch only this specific doctor's patients
    const currentPatients = getPatients(); 
    
    // Check if any patient matches the exact same name and age
    const isDuplicate = currentPatients.some(patient => 
      patient.name.trim().toLowerCase() === formData.name.trim().toLowerCase() && 
      patient.age.toString() === formData.age.toString()
    );

    if (isDuplicate) {
        // Stop the save and show an error to the doctor
        setErrors({ general: "A patient with this exact name and age is already registered in your clinic." });
        return;
    }
    
    // 3. If no duplicates are found, save the data
    addPatient(formData);
    navigate('/dashboard');
  };

  return (
    <div className="form-page">
      <div className="form-box">
        <h2>Add Patient</h2>
        
        {/* Displays the duplicate or missing fields error right above the form */}
        {errors.general && <span className="error-text" style={{ display: 'block', marginBottom: '1rem' }}>{errors.general}</span>}
        
        <form onSubmit={handleSubmit}>
          
          <div className="input-group">
            <input 
              type="text" 
              placeholder="Full Name" 
              className="input-field" 
              onChange={e => {
                setFormData({...formData, name: e.target.value});
                setErrors({}); // Clear error when user starts typing again
              }} 
              required 
            />
          </div>
          
          <div className="input-group">
            <input 
              type="number" 
              placeholder="Age" 
              className="input-field" 
              onChange={e => {
                setFormData({...formData, age: e.target.value});
                setErrors({}); // Clear error when user starts typing again
              }} 
              required 
            />
          </div>
          
          <div className="action-buttons mt-1">
            <button type="submit" className="primary-btn">Save Patient</button>
            <button type="button" onClick={() => navigate('/dashboard')} className="secondary-btn">Cancel</button>
          </div>
          
        </form>
      </div>
    </div>
  );
}