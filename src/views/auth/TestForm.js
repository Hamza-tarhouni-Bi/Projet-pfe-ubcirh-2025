import React from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";


const TestForm = () => {
  return (
    <div className="container">
      <div className="screen">
        <div className="screen__content">
          <form className="login">
            <div className="login__field">
              <i className="login__icon fas fa-user"></i>
              <input type="text" className="login__input" placeholder="User name / Email" />
            </div>
            <div className="login__field">
              <i className="login__icon fas fa-lock"></i>
              <input type="password" className="login__input" placeholder="Password" />
            </div>
            <button className="button login__submit">
              <span className="button__text">Log In Now</span>
              <i className="button__icon fas fa-chevron-right"></i>
            </button>
          </form>
          <div className="social-login">
            <h3>log in via</h3>
            <div className="social-icons">
              <a href="#" className="social-login__icon fab fa-instagram"></a>
              <a href="#" className="social-login__icon fab fa-facebook"></a>
              <a href="#" className="social-login__icon fab fa-twitter"></a>
            </div>
          </div>
        </div>
        <div className="screen__background">
          <span className="screen__background__shape screen__background__shape4"></span>
          <span className="screen__background__shape screen__background__shape3"></span>
          <span className="screen__background__shape screen__background__shape2"></span>
          <span className="screen__background__shape screen__background__shape1"></span>
        </div>
      </div>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css?family=Raleway:400,700');
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: Raleway, sans-serif;
          }
          body {
            background: linear-gradient(90deg, #C7C5F4, #776BCC);
          }
          .container {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
          }
          .screen {
            background: linear-gradient(90deg, #5D54A4, #7C78B8);
            position: relative;
            height: 600px;
            width: 360px;
            box-shadow: 0px 0px 24px #5C5696;
          }
          .screen__content {
            z-index: 1;
            position: relative;
            height: 100%;
          }
          .login {
            width: 320px;
            padding: 30px;
            padding-top: 156px;
          }
          .login__field {
            padding: 20px 0px;
            position: relative;
          }
          .login__icon {
            position: absolute;
            top: 30px;
            color: #7875B5;
          }
          .login__input {
            border: none;
            border-bottom: 2px solid #D1D1D4;
            background: none;
            padding: 10px;
            padding-left: 24px;
            font-weight: 700;
            width: 75%;
            transition: .2s;
          }
          .login__input:active,
          .login__input:focus,
          .login__input:hover {
            outline: none;
            border-bottom-color: #6A679E;
          }
          .login__submit {
            background: #fff;
            font-size: 14px;
            margin-top: 30px;
            padding: 16px 20px;
            border-radius: 26px;
            border: 1px solid #D4D3E8;
            text-transform: uppercase;
            font-weight: 700;
            display: flex;
            align-items: center;
            width: 100%;
            color: #4C489D;
            box-shadow: 0px 2px 2px #5C5696;
            cursor: pointer;
            transition: .2s;
          }
          .login__submit:active,
          .login__submit:focus,
          .login__submit:hover {
            border-color: #6A679E;
            outline: none;
          }
          .button__icon {
            font-size: 24px;
            margin-left: auto;
            color: #7875B5;
          }
          .social-login {
            position: absolute;
            height: 140px;
            width: 160px;
            text-align: center;
            bottom: 0px;
            right: 0px;
            color: #fff;
          }
          .social-icons {
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .social-login__icon {
            padding: 20px 10px;
            color: #fff;
            text-decoration: none;
            text-shadow: 0px 0px 8px #7875B5;
          }
          .social-login__icon:hover {
            transform: scale(1.5);
          }
        `}
      </style>
    </div>
  );
};

export default TestForm;
