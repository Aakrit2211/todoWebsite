import React, { useState } from "react";

function InputArea(props) {
  const [inputText, setInputText] = useState("");

  function handleChange(event) {
    const newValue = event.target.value;
    setInputText(newValue);
  }

  function handleClick(){
   if(inputText.trim().length!==0) {props.onAdd(inputText);
    setInputText("")}
  }

  return (
    <div className="form">
      <input onChange={handleChange} type="text" value={inputText} />
      <button
        onClick={handleClick}
      >
        <span>Add</span>
      </button>
    </div>
  );
}

export default InputArea