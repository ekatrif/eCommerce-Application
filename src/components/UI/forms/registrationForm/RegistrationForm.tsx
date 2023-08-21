import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Container from '../../container/Container';
import { removeLoginError } from '../../../../store/auth/reducer';
import Form from '../form/Form';
import H1 from '../../titles/h1/H1';
import Input from '../../input/Input';
import Button from '../../button/Button';
import H3 from '../../titles/h3/H3';
import { useAppDispatch } from '../../../../store';
import { ErrorMessages } from '../form/type';
import ErrorMessage from '../../ErrorMessage/ErrorMessage';
import validatePassword from '../../../../utils/validation/password-validation';
import { IRegisterRequest } from '../../../../api/types';
import ENV from '../../../../api/env';
import { register } from '../../../../api/auth';
import Popup from '../../popup/Popup';

const RegistrationForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [postCode, setPostCode] = useState('');
  const [popupActive, setPopupActive] = useState(false);
  const [emailVisited, setEmailVisited] = useState(false);
  const [passwordVisited, setPasswordVisited] = useState(false);
  const [firstNameVisited, setFirstNameVisited] = useState(false);
  const [lastNameVisited, setLastNameVisited] = useState(false);
  const [birthDayVisited, setBirthDayVisited] = useState(false);
  const [cityVisited, setCityVisited] = useState(false);
  const [streetVisited, setStreetVisited] = useState(false);
  const [postCodeVisited, setPostCodeVisited] = useState(false);
  const [emailError, setEmailError] = useState(ErrorMessages.EmptyEmail);
  const [passwordError, setPasswordError] = useState(ErrorMessages.EmptyPassword);
  const [firstNameError, setFirstNameError] = useState(ErrorMessages.EmptyFirstName);
  const [lastNameError, setLastNameError] = useState(ErrorMessages.EmptyLastName);
  const [birthDayError, setBirthDayError] = useState(ErrorMessages.EmptyBirthDay);
  const [cityError, setCityError] = useState(ErrorMessages.EmptyCity);
  const [streetError, setStreetError] = useState(ErrorMessages.EmptyStreet);
  const [postCodeError, setPostCodeError] = useState(ErrorMessages.EmptyPostCode);
  const [formValid, setFormValid] = useState(false);

  const dispatch = useAppDispatch();

  const handleRegister = async (data: IRegisterRequest): Promise<void> => {
    const token = await register();

    await fetch(`${ENV.Host}/${ENV.ProjectKey}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.access_token}`,
      },
      body: JSON.stringify(data),
    });

    setPopupActive(true);
    setTimeout(() => setPopupActive(false), 2000);
  };

  useEffect(() => {
    if (
      emailError ||
      passwordError ||
      firstNameError ||
      lastNameError ||
      birthDayError ||
      cityError ||
      streetError ||
      postCodeError
    ) {
      setFormValid(false);
    } else {
      setFormValid(true);
    }
  }, [emailError, passwordError, firstNameError, lastNameError, birthDayError, cityError, streetError, postCodeError]);

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
    dispatch(removeLoginError());
    setPassword(target.value);

    const passwordStatus = validatePassword(e);
    if (passwordStatus !== 'valid') {
      setPasswordError(passwordStatus as React.SetStateAction<ErrorMessages>);
    } else {
      setPasswordError(ErrorMessages.NoErrors);
    }
  };

  const firstNameHandler = (e: React.ChangeEvent): void => {
    const target = e.target as HTMLInputElement;
    setFirstName(target.value);
    const criterion = /^[a-zA-Z]{1,}$/;
    if (!criterion.test(String(target.value))) {
      setFirstNameError(ErrorMessages.NotValidFirstName);
    } else {
      setFirstNameError(ErrorMessages.NoErrors);
    }
  };

  const lastNameHandler = (e: React.ChangeEvent): void => {
    const target = e.target as HTMLInputElement;
    setLastName(target.value);
    const criterion = /^[a-zA-Z]{1,}$/;
    if (!criterion.test(String(target.value))) {
      setLastNameError(ErrorMessages.NotValidLastName);
    } else {
      setLastNameError(ErrorMessages.NoErrors);
    }
  };

  const birthDayHandler = (e: React.ChangeEvent): void => {
    const target = e.target as HTMLInputElement;
    const today = new Date();
    const birthDate = new Date(target.value);
    const msInYear = 31536000000;
    const age = Math.trunc((+today - +birthDate) / msInYear);
    setBirthDay(target.value);
    if (age < 13) {
      setBirthDayError(ErrorMessages.NotValidBirthDay);
    } else {
      setBirthDayError(ErrorMessages.NoErrors);
    }
  };

  const cityHandler = (e: React.ChangeEvent): void => {
    const target = e.target as HTMLInputElement;
    setCity(target.value);
    const criterion = /^[a-zA-Z]{1,}$/;
    if (!criterion.test(String(target.value))) {
      setCityError(ErrorMessages.NotValidCity);
    } else {
      setCityError(ErrorMessages.NoErrors);
    }
  };

  const streetHandler = (e: React.ChangeEvent): void => {
    const target = e.target as HTMLInputElement;
    setStreet(target.value);
    const criterion = /^[a-zA-Z0-9!@#$%^&*]{1,}$/;
    if (!criterion.test(String(target.value))) {
      setStreetError(ErrorMessages.NotValidStreet);
    } else {
      setStreetError(ErrorMessages.NoErrors);
    }
  };

  const postCodeHandler = (e: React.ChangeEvent): void => {
    const target = e.target as HTMLInputElement;
    setPostCode(target.value);
    const criterion = /^[0-9]{5}$/;
    if (!criterion.test(String(target.value))) {
      setPostCodeError(ErrorMessages.NotValidPostCode);
    } else {
      setPostCodeError(ErrorMessages.NoErrors);
    }
  };

  const blurHandler = (e: React.FocusEvent): void => {
    switch ((e.target as HTMLInputElement).name) {
      case 'email':
        setEmailVisited(true);
        break;
      case 'password':
        setPasswordVisited(true);
        break;
      case 'firstName':
        setFirstNameVisited(true);
        break;
      case 'lastName':
        setLastNameVisited(true);
        break;
      case 'birthDay':
        setBirthDayVisited(true);
        break;
      case 'city':
        setCityVisited(true);
        break;
      case 'street':
        setStreetVisited(true);
        break;
      case 'postCode':
        setPostCodeVisited(true);
        break;
      default:
        break;
    }
  };

  return (
    <Container>
      <Form id="registrationForm">
        <H1 text="Registration" />
        {emailVisited && emailError && <ErrorMessage>{emailError}</ErrorMessage>}
        <Input
          value={email}
          onBlur={(e): void => blurHandler(e)}
          onChange={(e): void => emailHandler(e)}
          name="email"
          type="text"
          placeholder="Email"
        />
        {passwordVisited && passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}
        <Input
          value={password}
          onBlur={(e): void => blurHandler(e)}
          onChange={(e): void => passwordHandler(e)}
          name="password"
          type="password"
          placeholder="Password"
        />
        {firstNameVisited && firstNameError && <ErrorMessage>{firstNameError}</ErrorMessage>}
        <Input
          value={firstName}
          onBlur={(e): void => blurHandler(e)}
          onChange={(e): void => firstNameHandler(e)}
          name="firstName"
          type="text"
          placeholder="First name"
        />
        {lastNameVisited && lastNameError && <ErrorMessage>{lastNameError}</ErrorMessage>}
        <Input
          value={lastName}
          onBlur={(e): void => blurHandler(e)}
          onChange={(e): void => lastNameHandler(e)}
          name="lastName"
          type="text"
          placeholder="Last name"
        />
        <H3 text="Date of birth:" />
        {birthDayVisited && birthDayError && <ErrorMessage>{birthDayError}</ErrorMessage>}
        <Input
          value={birthDay}
          onBlur={(e): void => blurHandler(e)}
          onChange={(e): void => birthDayHandler(e)}
          name="birthDay"
          type="date"
        />
        <H3 text="Address:" />
        <select name="country">
          <option value="US">United States</option>
          <option value="DE">Germany</option>
        </select>
        {cityVisited && cityError && <ErrorMessage>{cityError}</ErrorMessage>}
        <Input
          value={city}
          onBlur={(e): void => blurHandler(e)}
          onChange={(e): void => cityHandler(e)}
          name="city"
          type="text"
          placeholder="City"
        />
        {streetVisited && streetError && <ErrorMessage>{streetError}</ErrorMessage>}
        <Input
          value={street}
          onBlur={(e): void => blurHandler(e)}
          onChange={(e): void => streetHandler(e)}
          name="street"
          type="text"
          placeholder="Street"
        />
        {postCodeVisited && postCodeError && <ErrorMessage>{postCodeError}</ErrorMessage>}
        <Input
          value={postCode}
          onBlur={(e): void => blurHandler(e)}
          onChange={(e): void => postCodeHandler(e)}
          name="postCode"
          type="text"
          placeholder="Post code"
        />
        <Button
          onClick={(): Promise<void> =>
            handleRegister({
              email,
              password,
              firstName,
              lastName,
              birthDay,
              addresses: [
                {
                  country: 'US',
                  city,
                  street,
                  postCode,
                },
              ],
            })
          }
          disabled={!formValid}
          text="Register"
        />
        <div>
          Already have an account? <Link to="/login">Log in</Link>!
        </div>
      </Form>
      <Popup active={popupActive} setActive={setPopupActive} />
    </Container>
  );
};

export default RegistrationForm;
