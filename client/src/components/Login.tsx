import { Col, Container, Row } from "react-bootstrap";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { useNavigate } from "react-router-dom";
import type { LoginType } from "../types/Login";

const FormBox = () => {
  const [validated, setValidated] = useState(false);

  const navigate = useNavigate();
 

  // handle submit form
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget;
    // const submitter = (event.nativeEvent as SubmitEvent)
    //   .submitter as HTMLButtonElement;
    // const verificationMethod: VerificationMethod =
    // submitter?.value as VerificationMethod; // "phone" or "email"

    if (form.checkValidity() === false) {
      setValidated(true);
      return;
    }

    // Form data
    const formData: LoginType = {
      // name: (
      //   form.elements.namedItem("validationCustomName") as HTMLInputElement
      // ).value,
      email: (
        form.elements.namedItem("validationCustomEmail") as HTMLInputElement
      ).value,
      // phone:
      //   "+91" +
      //   (form.elements.namedItem("validationCustomPhone") as HTMLInputElement)
      //     .value,
      password: (
        form.elements.namedItem("validationCustomPassword") as HTMLInputElement
      ).value,
      // verificationMethod: verificationMethod,
    };

    console.log(formData);

    setValidated(true);
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Row className="mb-3">
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
          Don't have an account ?{" "}
          <span
            onClick={() => {
              navigate("/register");
            }}
            className="font-weight-bold cursor-pointer text-primary"
          >
            SIGN UP
          </span>
        </p>
      </Row>

      <div className="d-flex gap-3 align-items-center justify-content-center">
        <Button type="submit" variant="success">
          Submit
        </Button>
      </div>
    </Form>
  );
};

const Login = () => {
  return (
    <div className="d-flex align-items-center justify-content-center bg-success vh-100">
      <Container className="p-4 bg-light rounded shadow w-50">
        <h2 className="mb-4 text-center">Login</h2>
        <FormBox />
      </Container>
    </div>
  );
};

export default Login;
