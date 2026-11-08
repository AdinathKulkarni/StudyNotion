import { AppContext } from './AppContext.js'
import { useState } from 'react';

export function AppProvider({ children }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    password: '',
    confirmPassword: '',
  });

  const [loginFormData, setLoginFormData] = useState({
    email:'',
    password: '',
    role:'',
  });

  const validateForm = () => {
    let formErrors = {};

    if(!formData.firstName.trim() || formData.firstName.length === 0) {
      formErrors.firstName = 'first name is required'
    }

    
    if(!formData.lastName.trim() || formData.lastName.length === 0) {
      formErrors.lastName = 'last name is required'
    }

    
    if(!formData.email.trim() || formData.email.length === 0) {
      formErrors.email = 'email is required'
    }

    
    if(!formData.password.trim() || formData.password.length === 0) {
      formErrors.password = 'Password is required'
    }

    
    if(!formData.confirmPassword.trim() || formData.confirmPassword.length === 0) {
      formErrors.confirmPassword = 'Pls enter password to confirm it'
    }

    if(formData.password.trim() !== formData.confirmPassword.trim()){
      formErrors.confirmPassword = 'Passwords donot match'
    }

    if(!formData.role){
      formErrors.role = 'Role is required';
    }

    return formErrors;

  }

  const validateLoginFormData = () => {
    let formErrors = {};

    if(!loginFormData.email){
      formErrors.email = 'Email is required';
    }

    if(!loginFormData.password){
      formErrors.password = 'passwords are required';
    }

    if(!loginFormData.role){
      formErrors.role = 'Role is required';
    }

    return formErrors;
  }

  const handleChange = (e) => {
    const {name, value} = e.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }))

    // console.log(value);
  }

  const handleLoginChange = (e) => {
    const {name, value} = e.target;

    setLoginFormData( (currentFormData) => ({
      ...currentFormData, 
      [name]: value,
    }))
  };

  const handleRoleChange = (role) => {
    setFormData((currentFormData) => ({
      ...currentFormData,
      role,
    }))
  }

  const handleLoginRoleChange = (role) => {
    setLoginFormData((currentFormData) => ({
      ...currentFormData,
      role,
    }))
  }

  const signupHandleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if(Object.keys(validationErrors).length === 0){
      console.log("account created successfully");
      console.log(formData);
    }else{
      console.log("Error in form Submission, login failed");
      console.log(validationErrors);
    }
  }

  const loginHandleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateLoginFormData();

    if(Object.keys(validationErrors).length === 0){
      console.log("Login successful");
      console.log(loginFormData);
      return;
    }
    else{
      console.log("Login failed");
      console.log(loginFormData);
      return;
    }
  }

  const sharedFunctions = {
    formData,
    signupHandleSubmit,
    loginHandleSubmit,
    handleChange,
    handleLoginChange,
    handleRoleChange,
    handleLoginRoleChange,
    loginFormData,
  }

  return (
    <AppContext.Provider value={sharedFunctions}>
      {children}
    </AppContext.Provider>
  )
}
