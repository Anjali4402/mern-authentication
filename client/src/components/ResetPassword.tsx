import { Col, Container, Row } from "react-bootstrap";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import type { ResetPasswordType } from "../types/ResetPassword";

const FormBox = () => {
  const [validated, setValidated] = useState(false);

  // handle submit form
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      setValidated(true);
      return;
    }

    // Form data
    const formData: ResetPasswordType = {
      password: (
        form.elements.namedItem("validationCustomPassword") as HTMLInputElement
      ).value,
      confirmPassword: (
        form.elements.namedItem(
          "validationCustomConfirmPassword"
        ) as HTMLInputElement
      ).value,
    };

    setValidated(true);
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
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

      <Row className="mb-3">
        <Form.Group
          as={Col}
          md="12"
          controlId="validationCustomConfirmPassword"
        >
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="confirmPassword"
            placeholder="Enter Confirm Password"
            required
            minLength={6}
          />
          <Form.Control.Feedback type="invalid">
            Password must be at least 6 characters.
          </Form.Control.Feedback>
        </Form.Group>
      </Row>

      <div className="d-flex gap-3 align-items-center justify-content-center">
        <Button type="submit" variant="success">
          Submit
        </Button>
      </div>
    </Form>
  );
};

const ResetPassword = () => {
  return (
    <div className="d-flex align-items-center justify-content-center bg-success vh-100">
      <Container className="p-4 bg-light rounded shadow w-50">
        <h2 className="mb-4 text-center">Reset Password</h2>
        <FormBox />
      </Container>
    </div>
  );
};

export default ResetPassword;
