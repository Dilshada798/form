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
          <label>Email:</label>
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
          {errors.password && <p className="error">{errors.password}</p>}
        </div>

        <button type="submit">Submit</button>
      </form>
    </div >
  );
}

export default MyForm;


// import React, { useState } from 'react';

// const MyForm: React.FC = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//   });

//   const [formErrors, setFormErrors] = useState({
//     name: '',
//     email: '',
//     password: '',
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const validateForm = () => {
//     const errors: Record<string,  string> = {};
 
//     if (!formData.name.trim()) {
//       errors.name = 'Name is required';
//     }
//     if (!formData.email.trim()) {
//       errors.email = 'Email is required';
//     } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i.test(formData.email)) {
//       errors.email = 'Invalid email address';
//     }
//     if (!formData.password.trim()) {
//       errors.password = 'Password is required';
//     } else if (formData.password.length < 8) {
//       errors.password = 'Password must be at least 8 characters';
//     }

//     setFormErrors(errors);

//     return Object.keys(errors).length === 0;
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     if (validateForm()) {
//       console.log('Form submitted:', formData);
//     }
//   };

//   return (
//     <div>
//       <h2>Form</h2>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label htmlFor="name">Name:</label>
//           <input
//             type="text"
//             id="name"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//           />
//           <span className="error">{formErrors.name}</span>
//         </div>
//         <div>
//           <label htmlFor="email">Email:</label>
//           <input
//             type="email"
//             id="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//           />
//           <span className="error">{formErrors.email}</span>
//         </div>
//         <div>
//           <label htmlFor="password">Password:</label>
//           <input
//             type="password"
//             id="password"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//           />
//           <span className="error">{formErrors.password}</span>
//         </div>
//         <button type="submit">Submit</button>
//       </form>
//     </div>
//   );
// };

// export default MyForm;

