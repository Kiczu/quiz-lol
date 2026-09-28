import * as yup from "yup";

export const passwordSchema = yup
  .string()
  .required("Password is required")
  .min(8, "Password must be at least 8 characters")
  .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
  .matches(/[0-9]/, "Password must contain at least one number")
  .matches(/[^\w]/, "Password must contain at least one special character");

export const confirmPasswordSchema = (field: string) => yup
  .string()
  .required("Confirm password is required")
  .oneOf([yup.ref(field)], "Passwords must match");
