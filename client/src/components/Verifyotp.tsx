import React, { useState, useRef } from "react";
import { Button, Container } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../api/axiosInstance";
import type { AxiosError } from "axios";
import type { VerifyOTPType } from "../types/verifyOTP";

const Verifyotp: React.FC = () => {

  // params
  const params = useParams();

  // Get email and phone number from params.
  const { email, phone } = params;

  const navigate = useNavigate();

  // store api key
  const [otpKeys, setOtpKeys] = useState<string[]>(["", "", "", "", ""]);
  const inputRefs = useRef<HTMLInputElement[]>([]);


  // handle verify otp api.
  const verifyUser = async (formData: VerifyOTPType) => {
    try {
      const response = await axiosInstance.post("/otp-verification", formData);

      if (response?.data?.success) {
        const successMsg =
          response?.data?.message || "OTP verify successfully !";

        // show success message.
        toast.success(successMsg);

        navigate("/login");
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



  // Handle typing inside OTP input
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    const value = event.target.value.replace(/[^0-9]/g, ""); // only numbers

    const newOtp = [...otpKeys];
    newOtp[idx] = value;
    setOtpKeys(newOtp);

    if (value && idx < otpKeys.length - 1) {
      inputRefs.current[idx + 1]?.focus();
    }
  };



  // Handle backspace and delete
  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    idx: number
  ) => {
    if (event.key === "Backspace" || event.key === "Delete") {
      event.preventDefault(); // prevent browser default
      const newOtp = [...otpKeys];

      if (newOtp[idx]) {
        // if current box has value → clear it
        newOtp[idx] = "";
        setOtpKeys(newOtp);
      } else if (idx > 0) {
        // if empty → move focus back and clear previous
        inputRefs.current[idx - 1]?.focus();
        newOtp[idx - 1] = "";
        setOtpKeys(newOtp);
      }
    }
  };


  // submit validate
  const handleValidate = () => {
    const otp = otpKeys.join("");
    if (otp.length === otpKeys.length && otp.includes("")) {

      const formData: VerifyOTPType = {
        email: email ? email : "",
        otp: otp,
        phone: phone ? phone : "",
      };
      verifyUser(formData);
    } else {
      toast.error("Please enter full OTP");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center bg-success vh-100">
      <Container
        className="container h-100s w-100"
        style={{ maxWidth: "500px", margin: "0 auto" }}
      >
        <div className="position-relative">
          <div className="card text-center p-3">
            <h6>
              Please enter the one time password <br /> to verify your account
            </h6>
            <div>
              <span>A code has been sent to</span>{" "}
              <small id="maskedNumber">*****{phone?.slice(10)}</small>
            </div>

            {/* OTP Inputs */}
            <div className="d-flex flex-row justify-content-center mt-3">
              {otpKeys.map((val, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  value={val}
                  ref={(el) => {
                    if (el) inputRefs.current[idx] = el;
                  }}
                  onChange={(e) => handleChange(e, idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  className="m-2 text-center form-control rounded"
                  style={{ width: "50px", fontSize: "20px" }}
                />
              ))}
            </div>

            <div className="mt-4">
              <Button
                id="validateBtn"
                variant="success"
                onClick={handleValidate}
              >
                Validate
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Verifyotp;
