import { useState, useEffect } from "react";

const Form = () => {
  const [userDetails, setUserDetails] = useState({
    name: "",
    age: "",
    comments: "",
  });

  const [ageValidityMessage, setAgeValidityMessage] = useState("");

  useEffect(() => {
    if(userDetails.age < 80 && userDetails.age >= 18) {
        setAgeValidityMessage("Valid age");
    } else if (userDetails.age === '') {
         setAgeValidityMessage("");
    } else {
        setAgeValidityMessage("Invalid age");
    }

  }, [userDetails.age]);

  const handleChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // avoids reload of the screen
    alert(`You entered : ${userDetails.name} and ${userDetails.age}`);
  };

  return (
    <div>
      <form>
        <label>
          *Enter your name:
          <input
            type="text"
            name="name"
            value={userDetails.name}
            onChange={handleChange}
          ></input>
        </label>
        <br />
        <label>
          *Enter your age:
          <input
            type="number"
            name="age"
            value={userDetails.age}
            onChange={handleChange}
          ></input>
        </label>
        <label>{ageValidityMessage}</label>
        <br />
        <label>
          Add some comments:
          <textarea name="comments" value={userDetails.comments} onChange={handleChange} />
        </label>
        <br />
        <button
          disabled={!userDetails.name || !userDetails.age}
          onClick={handleSubmit}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Form;
