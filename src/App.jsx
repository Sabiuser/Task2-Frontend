import React, { useEffect, useState } from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import axios from 'axios';

function App() {
  const nameRegex = /^[A-Za-z\s\-]{2,}$/;
  const deptRegex = /^[A-Za-z\s.\-()]{2,}$/;
  const yearRegex = /^(19|20)\d{2}$/;
  const cgpaRegex = /^([0-9]\.\d{1,2}|10(\.0{1,2})?)$/;
  const statusRegex = /^(active|unactive)$/i;
  const genderRegex = /^(male|female|other)$/i;

  const [user, setUser] = useState([]);
  const [edit, setEdit] = useState(false); 
  const [value, setValue] = useState({
    name: "",
    department: "",
    year: "",
    cgpa: "",
    status: "",
    gender: ""
  });

  const getFunction = async () => {
    try {
      const response = await axios.get("http://localhost:5000/user/get-user");
      setUser(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChange = (e) => {
    setValue((prev) => ({
      ...prev,
      [e?.target?.name]: e?.target?.value,
    }));
  };

  const handleSubmit = async () => {
    const { name, department, year, cgpa, status, gender } = value;

    if (
      !nameRegex.test(name) ||
      !deptRegex.test(department) ||
      !yearRegex.test(year) ||
      !cgpaRegex.test(cgpa) ||
      !statusRegex.test(status) ||
      !genderRegex.test(gender)
    ) {
      alert("Please fill all fields with valid data.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/user/post-user", value);
      alert("User added successfully!");
      getFunction();
      setValue({
        name: "",
        department: "",
        year: "",
        cgpa: "",
        status: "",
        gender: ""
      });
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const handleUpdate = async () => {
    const { name, department, year, cgpa, status, gender } = value;

    if (
      !nameRegex.test(name) ||
      !deptRegex.test(department) ||
      !yearRegex.test(year) ||
      !cgpaRegex.test(cgpa) ||
      !statusRegex.test(status) ||
      !genderRegex.test(gender)
    ) {
      alert("Please fill all fields with valid data.");
      return;
    }

    try {
      await axios.put("http://localhost:5000/user/put-user", value);
      alert("User updated successfully");
      setValue({
        name: "",
        department: "",
        year: "",
        cgpa: "",
        status: "",
        gender: ""
      });
      setEdit(false); 
      getFunction();
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Name should not be modified!");
    }
  };

  const handleDelete = async (name) => {
    try {
      await axios.delete("http://localhost:5000/user/delete-user", {
        data: { name }
      });
      alert("User deleted successfully");
      getFunction();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    }
  };

  useEffect(() => {
    getFunction();
  }, []);

  return (
    <div style={{ width: '80%', margin: '20px auto' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          maxWidth: '400px',
          margin: '0 auto',
          padding: '20px',
          boxSizing: 'border-box',
          border: '1px solid #ccc',
          borderRadius: '8px',
        }}
      >
        <TextField label="Name" name="name" value={value.name} onChange={handleChange} variant="outlined" fullWidth />
        <TextField label="Department" name="department" value={value.department} onChange={handleChange} variant="outlined" fullWidth />
        <TextField label="Year" type="number" name="year" value={value.year} onChange={handleChange} variant="outlined" fullWidth />
        <TextField label="CGPA" type="number" name="cgpa" value={value.cgpa} onChange={handleChange} variant="outlined" fullWidth />
        <TextField label="Status" name="status" value={value.status} onChange={handleChange} variant="outlined" fullWidth />

        <FormControl component="fieldset">
          <FormLabel component="legend">Gender</FormLabel>
          <RadioGroup row name="gender" value={value.gender} onChange={handleChange}>
            <FormControlLabel value="male" control={<Radio />} label="Male" />
            <FormControlLabel value="female" control={<Radio />} label="Female" />
            <FormControlLabel value="other" control={<Radio />} label="Other" />
          </RadioGroup>
        </FormControl>

        <Button
          variant="contained"
          color={edit ? "secondary" : "primary"}
          fullWidth
          onClick={edit ? handleUpdate : handleSubmit}
        >
          {edit ? "Update" : "Submit"}
        </Button>
      </div>

      <div style={{ marginTop: '40px' }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow className="bg-pink-200">
                <TableCell>Name</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Year</TableCell>
                <TableCell>CGPA</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Edit</TableCell>
                <TableCell>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {user.map((u, index) => (
                <TableRow key={index}>
                  <TableCell>{u?.name || ""}</TableCell>
                  <TableCell>{u?.department || ""}</TableCell>
                  <TableCell>{u?.year || ""}</TableCell>
                  <TableCell>{u?.cgpa || ""}</TableCell>
                  <TableCell>{u?.status || ""}</TableCell>
                  <TableCell>{u?.gender || ""}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => {
                        setValue(u);
                        setEdit(true);
                      }}
                    >
                      Edit
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleDelete(u?.name)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default App;




