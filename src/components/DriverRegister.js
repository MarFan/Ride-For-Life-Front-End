import React, { useEffect } from 'react';
import { Form, withFormik } from "formik";
import * as Yup from "yup";
import styled from "styled-components";
import {connect} from 'react-redux';

import mailIcon from '../images/mail.png';
import userIcon from '../images/user.png';
import locationIcon from '../images/compass.png';
import phoneIcon from '../images/phoneHeadset.png';
import cashIcon from '../images/cash.png';
import lockIcon from '../images/lock.png';

import TextIn from './TextIn';
import SubmitBtn from './SubmitBtn';

// *@* redux actions
import {driverReg, clear_drvRegMovePage} from '../actions';

const StyledH1 = styled.h1`
  width:fit-content;
  margin:0 auto;
  margin-top:10px;
  font-size:30px;
`;

const FormCtrDiv = styled.div`
  margin-top:20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;


const StyledH3 = styled.h3`
  width:fit-content;
  margin:0 auto;
  margin-top:10px;
`;


const DriverRegister = (props) => {
  const {
    //Formik bindings
    errors, touched, //status,
    //Redux state bindings
    drvRegState, drvRegErrMsg, drvRegMove,
    //Redux action bindings
    clear_drvRegMovePage, 
    //React router props
    history,
  } = props;

  // For debugging use only
  // const [data, setData] = useState({});
  

  //Saves data into local state for debugging use only
  // useEffect(() => {
  //   status && setData(status);
  // }, [status]);


  useEffect(() => {
    if(drvRegMove) {
      history.push('/');
    }

    //When the redux state flag drvRegMove becomes true, it indicates that we 
    //have to move from automatically to another page. The if statement above do
    //this, and after they have done their work, we need to make drvRegMove false.
    if(drvRegMove) {
      clear_drvRegMovePage(); 
    }

  }, [drvRegMove]);

  // *@* This set the messages to the user to keep him
  // aware of the state of the page
  function formStatus(formState,errMsg="") {
    switch(formState) {
      case 0:
        return "";
      case 1: 
        return "Transferring data to server. Please wait...";
      case 2: 
        return `Transferring to login page. Please wait...`;  
      case 3:
        return errMsg;
      default:
        return "Unknown Error";      
    }
  }

  


  return ( <>
    (<StyledH1>Driver Registration Page</StyledH1>)

    <FormCtrDiv>
      <Form>

        <TextIn 
          fieldName="name" fieldType="text" fieldPlaceHolder="Name" 
          iconImg={userIcon} imgTxt="User Icon"
          touched={touched.name} errors={errors.name}
        />

        <TextIn 
          fieldName="plot" fieldType="text" fieldPlaceHolder="Location Plot" 
          iconImg={locationIcon} imgTxt="Location Icon"
          touched={touched.plot} errors={errors.plot}
        />

        <TextIn 
          fieldName="phoneNo" fieldType="text" fieldPlaceHolder="DonorPhoneNo" 
          iconImg={phoneIcon} imgTxt="Phone Icon"
          touched={touched.phoneNo} errors={errors.phoneNo}
        />

        <TextIn 
          fieldName="email" fieldType="email" fieldPlaceHolder="Email" 
          iconImg={mailIcon} imgTxt="Email Icon"
          touched={touched.email} errors={errors.email}
        />

        <TextIn 
          fieldName="price" fieldType="text" fieldPlaceHolder="Price" 
          iconImg={cashIcon} imgTxt="Cash Icon"
          touched={touched.price} errors={errors.price}
        />

        <TextIn 
          fieldName="password" fieldType="password" fieldPlaceHolder="Password" 
          iconImg={lockIcon} imgTxt="Password Icon"
          touched={touched.password} errors={errors.password}
        />

        <SubmitBtn textDisplay={"Register"}/>
        

      </Form>
        
    </FormCtrDiv>

    {/* *@* This is for message of page state to user*/}
    <StyledH3>{formStatus(drvRegState, drvRegErrMsg)}</StyledH3>


      {/* The following code is for testing purposes only */}
      {/* comment out in customer version of the code */}
      {/* <p>{`The donor ID is: ${data.donorId}`}</p> */}
      {/* <p>{`The name is: ${data.name}`}</p>
      <p>{`The plot location is: ${data.plot}`}</p>
      <p>{`The phoneNo is: ${data.phoneNo}`}</p>
      <p>{`The email is: ${data.email}`}</p>
      <p>{`The price is: ${data.price}`}</p>
      <p>{`The password is: ${data.password}`}</p> */}
   
      


    </>

  );
    
 
 } //End of DriverRegister function
 
 
 
const FormikDriverRegister = withFormik({
  
  mapPropsToValues({ name, plot, phoneNo, email, price, password, }) {
    return {
      name: name || "",
      plot: plot || "",
      phoneNo: phoneNo || "",
      email: email || "",
      price: price || "",
      password: password || "",
    };
  },

  validationSchema: Yup.object().shape({
    name: Yup.string().required("Please input a name"),
    plot: Yup.string().required("Please input a plot location"),
    phoneNo: Yup.string().required("Please input a phone number"),
    email: Yup.string().required("Please input an email address").email("Please enter a valid email"),
    price: Yup.number().required("Please input a price").typeError("Please input only digits not other chars")
      .integer("Please input only integers"),
    password: Yup.string().required("Please input a password").min(3,"Min of 3 chars for the password"),
  }),
  
  handleSubmit(values, formikBag) {
    // console.log("This is values",values);
    // console.log("This is formikBag",formikBag);
    // console.log("This is props in formikBag",formikBag.props);

    const { setStatus, resetForm } = formikBag;
    const {driverReg} = formikBag.props;
    resetForm();
    setStatus(values);
    
    // *@* Redux action call
    driverReg(values);

    //I don't need the if statements here, as it seems Formik will not execute handleSubmit until
    //touched is true and there are no errors
    

  },
  
  
})(DriverRegister); 

function mapStateToProps(state) {
  return {
    drvRegState: state.drvRegState,
    drvRegErrMsg: state.drvRegErrMsg,
    drvRegMove: state.drvRegMove,
  };
}

export default connect(mapStateToProps,
  {driverReg, clear_drvRegMovePage}
)(FormikDriverRegister);