import React, { useState } from "react";

export default function Search() {
  const [input, setInput] = useState("");

  return (
    <>
      <div className="d-flex">
        <input
          className="form-control me-2"
          type="search"
          value={input}
          placeholder="Search"
          aria-label="Search"
          onChange={(e) => {
            setInput(e.target.value);
          }}
        />
        <button
          className="btn btn-outline-success"
          type="submit"
          onClick={() => {
            console.log("input ->", input);
            setInput("");
          }}
        >
          Search
        </button>
      </div>
    </>
  );
}
