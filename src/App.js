import { useEffect, useState } from "react";
import Search from "./components/Search";
import axios from 'axios';
import UserLayout from "./components/User_Layout";

function App() {
  const [user, getUsers] = useState([]);
  const [searchInput, setSearchInput] = useState('');

  useEffect(()=> {
    axios.get(`https://api.github.com/users/herdigitalyard`)
    .then(response => {
      getUsers(response.data);
    })
    .catch(error => {
      console.error(error);
    })
  }, [])

  return (
    <div className="container">
      <h3>Github User Search</h3>
      <Search input = {searchInput} />
      <UserLayout userData = {user} />
    </div>
  );
}

export default App;
