import './App.css';
import { useState } from 'react';

function App() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [age, setAge] = useState("")
  const [location, setLocation] = useState("")
  const [showError, setShowError] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [success, setSuccess] = useState(false)
  const [id, setId] = useState("");


  const onChangeUsername = event => {
    setUsername(event.target.value)
  }
  
  const onChangeEmail = event => {
    setEmail(event.target.value)
  }

  const onChangeAge = event => {
    setAge(event.target.value)
  }

  const onChangeLocation = event => {
    setLocation(event.target.value)
  }



const onClickLocateMe = () => {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(async function (position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            const nominatimApiUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

            try {
                const response = await fetch(nominatimApiUrl);
                const data = await response.json();

                if (data.display_name) {
                    const locationName = data.display_name;
                    setLocation(locationName)
                } else {
                    setLocation("")
                    alert("Location not found.")
                }
            } catch (error) {
                setLocation("")
                alert("Error fetching location data.")
            }
        });
      } else {
          setLocation("")
          alert("Geolocation is not supported by your browser.")
      }
};



  const onSubmitForm = async event => {
    event.preventDefault()

    if (username !== "" && email !== "" && age !== "" && location !== ""){
      setShowError(false)
      const userData = {
        username, email, age, location
      }

      const options = {
        method: "POST", 
        headers: {
          "Content-Type" : "application/json"
        },
        body: JSON.stringify(userData)
      }

      // const response = await fetch("http://localhost:4000/user-details", options)

      const response = await fetch("https://micro-service-a.onrender.com/user-details", options)
      const data = await response.json()
      if (response.ok === true) {
        setSuccess(true)
        setId(data.id)
      } else {
        setShowError(true)
        setErrorMsg(data.error);
      }
    } else {
      setShowError(true)
      setErrorMsg("Please enter all the required fields")
    }
    
  }

  const renderForm = () => (
    <>
      <h1 className='heading'>User Details</h1>
      <form className='my-form' onSubmit={onSubmitForm}>
        {showError && <p className='error'>{errorMsg}</p>}
        <label className="label" htmlFor="username">USERNAME</label>
        <input type="text" id="username" value={username} onChange={onChangeUsername} className="input-box" />

        <label className="label" htmlFor="email">EMAIL</label>
        <input type="text" id="email" value={email} onChange={onChangeEmail} className="input-box" />

        <label className="label" htmlFor="age">AGE</label>
        <input type="number" id="age" value={age} onChange={onChangeAge} className="input-box" />

      <div className='location-con'>
        <div className='location-input'>
          <label className="label" htmlFor="location">LOCATION</label>
          <input type="text" id="location" value={location} onChange={onChangeLocation} className="input-box" />
        </div>
        <button onClick={onClickLocateMe} className='locate-button' type='button'>Locate me</button>
      </div>

        <button type="submit" className="submit-button">Submit</button>
      </form>
    </>
  )

  const renderID = () => (
    <>
      <h1 className='success'>Details Submitted Successfully!</h1>
      <p className='id'>Your ID: {id}</p>
    </>
  )

  return (
    <div className="container">
      {success ? renderID() : renderForm()}
    </div>
  );
}

export default App;
