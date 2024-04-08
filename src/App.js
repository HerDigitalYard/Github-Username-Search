import { useEffect, useState } from "react";
import Search from "./components/Search";
import axios from 'axios';
import UserLayout from "./components/UserLayout";

function App() {
  const [user, getUsers] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [error, setError] = useState(false);

  useEffect(()=> {
    if(searchInput) {
      axios.get(`https://api.github.com/users/${searchInput}`)
      .then(response => {
        getUsers(response.data);
        setError(false);
      })
      .catch(error => {
        setError(true)
      })
    }
  }, [searchInput])

  const handleSearch = (searchInput) => {
    setSearchInput(searchInput)
  }

  return (
    <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-6 sm:py-12">
       <div className="relative bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto md:max-w-6xl sm:max-w-lg sm:rounded-lg sm:px-10">
          <div className="">
            <div className="divide-y divide-gray-300/50">
              <div className="space-y-6 py-8 text-base leading-7 text-gray-600">
                <h2 className="text-4xl font-extrabold dark:text-white text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">Github User Search</h2>
                <p>An advanced online playground for Tailwind CSS, including support for things like:</p>
                <Search onSearch = {handleSearch} />
                {searchInput !== '' && error !== true ? <UserLayout userData = {user} /> : error === true ? <h1 className="text-red-600 text-center">No username found on GitHub.</h1> : <h3 className="text-lg font-normal text-gray-950 lg:text-xl dark:text-gray-400">Enter Value to search github profile and more info related to profile</h3>}
              </div>
            </div>
          </div> 
      </div>
    </div>
  );
}

export default App;
