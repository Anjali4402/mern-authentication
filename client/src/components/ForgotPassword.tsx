import { Col, Container, Row } from "react-bootstrap";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import type { ForgotPasswordType } from "../types/ForgotType";

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
    const formData: ForgotPasswordType = {
      email: (
        form.elements.namedItem("validationCustomEmail") as HTMLInputElement
      ).value,
    };


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


      <div className="d-flex gap-3 align-items-center justify-content-center">
        <Button type="submit" variant="success">
          Submit
        </Button>
      </div>
    </Form>
  );
};

const ForgotPassword = () => {
  return (
    <div className="d-flex align-items-center justify-content-center bg-success vh-100">
      <Container className="p-4 bg-light rounded shadow w-50">
        <h2 className="mb-4 text-center">Forgot Password</h2>
        <FormBox />
      </Container>
    </div>
  );
};

export default ForgotPassword;
