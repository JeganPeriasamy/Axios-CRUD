// THIS IS THE USER CONTEXT
//  Importing the all needs
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Creating the context with the data needed
const UserContext = createContext({
  data: [],
  name: "",
  email: "",
  phone: "",
  setData: () => {},
  setName: () => {},
  setEmail: () => {},
  setPhone: () => {},
  AddtoTable: () => {},
  handleFormSubmit: () => {},
  handleUpdate: () => {},
  handleDelete: () => {},
});

// Storing Mock API in the variable 
const API = "https://jsonplaceholder.typicode.com/users";

//UseContext
export const useUserContext = () => useContext(UserContext);

// Creating the Provider
export function UserContextProvider({ children }) {

  // State function to store data 
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Adding the data to the Table 
  const AddtoTable = (newData) => {
    setData((prevData) => [...prevData, newData]); // using the spread operator (...) to create a new array instead of mutating the existing array.
    //Setting the new data to the table 
  };

  // Declaration of UseNavigate 
  let navigate = useNavigate();

  // To handle the Submitting data 
  // Two arguments, e (presumably an event object) and userData.
  const handleFormSubmit = (e, userData) => {

    e.preventDefault(); // prevents the form from being submitted in the default manner,
    axios
      .post(API, userData) // <-- The same 'API' URL is used for all form submissions
      .then((response) => {
        console.log(response);
        AddtoTable(response.data); // Adding to the table 
        navigate("/ListPages"); 
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    // Setting to the default value
    setName(""); 
    setEmail("");
    setPhone("");
  };

  // HandleUpdate Receives the id with updated data 
  const handleUpdate = (id, updatedData) => {
    axios
      .put(`${API}/${id}`, updatedData) // Putting the the data to the API with respect to id 
      .then((response) => {
        const updatedUser = response.data;
        setData((prevData) =>
          prevData.map((user) => (user.id === id ? updatedUser : user))
        );
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };

  // Delete Function 
  const handleDelete = (id) => {
    axios
      .delete(`${API}/${id}`)
      .then(() => {
        setData((prevData) => prevData.filter((user) => user.id !== id));
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };

  useEffect(() => {
    axios
      .get(API)
      .then((response) => {
        console.log(response);
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const value = {
    data,
    name,
    email,
    phone,
    setName,
    setData,
    AddtoTable,
    handleFormSubmit,
    setEmail,
    setPhone,
    handleUpdate,
    handleDelete,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}