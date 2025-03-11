import * as yup from "yup";
import { Box, TextField, Button } from "@mui/material";
import { Formik, Form } from "formik";
import { inputStyle } from "../userDashboard.style";

interface Props {
  formData: {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  isUsernameEditable: boolean;
  onSubmit: (values: {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
  }) => Promise<void>;
}

const validationSchema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  username: yup
    .string()
    .test("is-username-editable", "Username is required", function (value) {
      return this.options.context?.isUsernameEditable ? !!value : true;
    }),
});

const EditUserForm = ({ formData, isUsernameEditable, onSubmit }: Props) => {
  return (
    <Formik
      initialValues={{
        username: formData.username || "",
        firstName: "",
        lastName: "",
        email: "",
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      context={{ isUsernameEditable }}
    >
      {({ values, handleChange, handleBlur, errors, touched }) => (
        <Form>
          <Box mb={3}>
            <TextField
              name="username"
              label="Username"
              value={values.username}
              onChange={handleChange}
              onBlur={handleBlur}
              fullWidth
              variant="outlined"
              sx={inputStyle}
              disabled={!isUsernameEditable}
              error={touched.username && Boolean(errors.username)}
              helperText={
                touched.username && errors.username
                  ? errors.username
                  : isUsernameEditable
                  ? "The username is permanent, choose wisely!"
                  : "You cannot change your username"
              }
            />
            <TextField
              name="firstName"
              label="First Name"
              value={values.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              fullWidth
              variant="outlined"
              sx={inputStyle}
              error={touched.firstName && Boolean(errors.firstName)}
              helperText={
                touched.firstName && errors.firstName ? errors.firstName : " "
              }
            />
            <TextField
              name="lastName"
              label="Last Name"
              value={values.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              fullWidth
              variant="outlined"
              sx={inputStyle}
              error={touched.lastName && Boolean(errors.lastName)}
              helperText={
                touched.lastName && errors.lastName ? errors.lastName : " "
              }
            />
            <TextField
              name="email"
              label="Email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              fullWidth
              variant="outlined"
              sx={inputStyle}
              error={touched.email && Boolean(errors.email)}
              helperText={touched.email && errors.email ? errors.email : " "}
            />
            <Button type="submit" variant="contained">
              Save Changes
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default EditUserForm;
