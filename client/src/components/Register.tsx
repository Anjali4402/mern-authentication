import { Col, Container, Row } from "react-bootstrap";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import type { RegisterType, VerificationMethod } from "../types/register";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";

const FormBox = () => {
  const [validated, setValidated] = useState(false);

  const navigate = useNavigate();


  // handle Register user.
  const handleRegisterUser = async (formData: RegisterType) => {
    try {
      // if Successfull run
      const response = await axiosInstance.post("/register", formData);
      if(response?.data?.success){
        const successMsg = response?.data?.message || "User Register Successfully!"

        // show success message.
        toast.success(successMsg);

        // navigate to the OTP verification page.
        navigate(`/otp-verification/${formData.email}/${formData?.phone}`)
      }
    } catch (err) {
         // If come any error  
      const error = err as AxiosError<{ message?: string }>;
      const errorResponse =
        error?.response?.data?.message || "Something went wrong";

      const errorMesssage = errorResponse + ", Please try again!";

      // Show Error message.
      toast.error(errorMesssage);
    }
  };



  // handle submit form
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget;
    const submitter = (event.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement;
    const verificationMethod: VerificationMethod =
      submitter?.value as VerificationMethod; // "phone" or "email"

    if (form.checkValidity() === false) {
      setValidated(true);
      return;
    }

    // Form data
    const formData: RegisterType = {
      name: (
        form.elements.namedItem("validationCustomName") as HTMLInputElement
      ).value,
      email: (
        form.elements.namedItem("validationCustomEmail") as HTMLInputElement
      ).value,
      phone:
        "+91" +
        (form.elements.namedItem("validationCustomPhone") as HTMLInputElement)
          .value,
      password: (
        form.elements.namedItem("validationCustomPassword") as HTMLInputElement
      ).value,
      verificationMethod: verificationMethod,
    };

    
    handleRegisterUser(formData);

    setValidated(true);
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Row className="mb-3">
        <Form.Group as={Col} md="12" controlId="validationCustomName">
          <Form.Label>First name</Form.Label>
          <InputGroup hasValidation>
            <Form.Control
              required
              type="text"
              placeholder="First name"
              minLength={2}
            />
            <Form.Control.Feedback type="invalid">
              Please enter a valid name (min 2 characters).
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>

        <Form.Group as={Col} md="12" controlId="validationCustomEmail">
          <Form.Label>Email</Form.Label>
          <InputGroup hasValidation>
            <Form.Control
              type="email"
              placeholder="Email"
              required
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
            />
            <Form.Control.Feedback type="invalid">
              Please enter a valid email address.
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
      </Row>

      <Row className="mb-3">
        <Form.Group as={Col} md="12" controlId="validationCustomPhone">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            type="tel"
            placeholder="Phone Number"
            required
            pattern="[0-9]{10}"
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid 10-digit phone number.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group as={Col} md="12" controlId="validationCustomPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            required
            minLength={6}
          />
          <Form.Control.Feedback type="invalid">
            Password must be at least 6 characters.
          </Form.Control.Feedback>
        </Form.Group>
      </Row>

      <Row>
        <p className="text-center">
          Already have an account ?{" "}
          <span
            onClick={() => {
              navigate("/login");
            }}
            className="font-weight-bold cursor-pointer text-primary"
          >
            LOGIN
          </span>
        </p>
      </Row>

      <div className="d-flex gap-3">
        <Button type="submit" variant="success" value="phone">
          Verify By Phone
        </Button>
        <Button type="submit" variant="info" value="email">
          Verify By Email
        </Button>
      </div>
    </Form>
  );
};

const Register = () => {
  return (
    <div className="d-flex align-items-center justify-content-center bg-success vh-100">
      <Container className="p-4 bg-light rounded shadow w-50">
        <h2 className="mb-4">Register</h2>
        <FormBox />
      </Container>
    </div>
  );
};

export default Register;
