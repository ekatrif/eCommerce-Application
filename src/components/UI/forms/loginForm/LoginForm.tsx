import React, { useState, useEffect } from 'react';
import Form from '../form/Form';
import H1 from '../../titles/h1/H1';
import Input from '../../input/Input';
import Container from '../../container/Container';
import Button from '../../button/Button';
import ErrorMessage from '../../error-message/ErrorMessage';
import { useAppDispatch } from '../../../../store';
import { loginUser } from '../../../../store/auth/actions';

export const enum ErrorMessages {
  NoErrors = '',
  EmptyEmail = 'Please enter email',
  EmptyPassword = 'Please enter password',
  EmptyFirstName = 'Please enter first name',
  EmptyLastName = 'Please enter last name',
  EmptyBirthDay = 'Please enter birth day',
  EmptyCity = 'Please enter city',
  EmptyStreet = 'Please enter street',
  EmptyPostCode = 'Please enter post code',
  NotValidEmail = 'Email is not valid',
  NotValidPassword = 'Password must contain more than 8 characters, at least 1 uppercase letter, 1 lowercase letter and 1 digit.',
  NotValidFirstName = 'First name: must contain at least one character and not contain special characters or numbers',
  NotValidLastName = 'Last name: must contain at least one character and not contain special characters or numbers.',
  NotValidBirthDay = 'You must be over 13 years old',
  NotValidStreet = 'Street: must contain at least one character',
  NotValidCity = 'City: must contain at least one character and not contain special characters or numbers.',
  NotValidPostCode = 'The index of your country must contain 5 digits',
}

const LoginForm: React.FC = () => {
  const [username, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailVisited, setEmailVisited] = useState(false);
  const [passwordVisited, setPasswordVisited] = useState(false);
  const [emailError, setEmailError] = useState(ErrorMessages.EmptyEmail);
  const [passwordError, setPasswordError] = useState(ErrorMessages.EmptyPassword);
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!emailError && !passwordError) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [emailError, passwordError]);

  const emailHandler = (e: React.ChangeEvent): void => {
    const target = e.target as HTMLInputElement;
    setEmail(target.value);
    const re =
      // eslint-disable-next-line no-useless-escape
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (!re.test(String(target.value).toLowerCase())) {
      setEmailError(ErrorMessages.NotValidEmail);
    } else {
      setEmailError(ErrorMessages.NoErrors);
    }
  };

  const passwordHandler = (e: React.ChangeEvent): void => {
    const target = e.target as HTMLInputElement;
    setPassword(target.value);
    if (target.value.length < 5 || target.value.length > 10) {
      setPasswordError(ErrorMessages.NotValidPassword);
    } else {
      setPasswordError(ErrorMessages.NoErrors);
    }
  };

  const sendData = (e: React.FormEvent): void => {
    e.preventDefault();
    dispatch(loginUser({ username, password }));
  };

  const blurHandler = (e: React.FocusEvent): void => {
    const target = e.target as HTMLInputElement;
    const { name } = target;
    switch (name) {
      case 'email':
        setEmailVisited(true);
        break;
      case 'password':
        setPasswordVisited(true);
        break;
      default:
        break;
    }
  };

  return (
    <Container width="30%">
      <Form id="loginForm">
        <H1 text="Login page" />
        {emailVisited && emailError && <ErrorMessage>{emailError}</ErrorMessage>}
        <Input
          value={username}
          onBlur={(e): void => blurHandler(e)}
          onChange={(e): void => emailHandler(e)}
          name="email"
          type="text"
          placeholder="Enter your email"
        />
        {passwordVisited && passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}
        <Input
          value={password}
          onBlur={(e): void => blurHandler(e)}
          onChange={(e): void => passwordHandler(e)}
          name="password"
          type="password"
          placeholder="Enter your password"
        />
        <Button onClick={(e): void => sendData(e)} disabled={buttonDisabled} text="Login" />
      </Form>
    </Container>
  );
};

export default LoginForm;
