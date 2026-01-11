import React, { useState } from 'react';

function MyForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (formData.name.trim() === '') {
      newErrors.name = 'Name is required';
    }

    const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.match(email)) {
      newErrors.email = 'Invalid email address';
    }

    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      console.log('Form submitted:', formData);
    } else {
      console.log('Form has errors');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h1>Form Validation</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            onChange={handleChange}
            value={formData.name}
          />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>

        <div>
          <label>Email </label>
          <input
            type="email"
            name="email"
            onChange={handleChange}
            value={formData.email}
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            onChange={handleChange}
            value={formData.password}
          />
          <div>
            <label>password:</label>
            <input 
            type='password'
            name='password'
            onChange={handleChange}
            value={formData.pas}
            >
            </input>
          </div>
          {errors.password && <p className="error">{errors.password}</p>}
        </div>

        <button type="submit">Submit</button>
        <button type="onclick ">onclick</button>
        <button type='clear'> clear</button>
        <button type='onDelete'>delete</button>
        <button type='onadd'>Adding </button>
        <button type='onUpdate'>update </button>
        <button type='onRemove'>remove </button>
        <MyForm>
          <h1>this is the form </h1>
        <p>this is the form 0of validation using the library of react zustand. it will validate the form with authentication and verification.</p>
        </MyForm>
      </form>
    </div >
  );
}

export default MyForm;


