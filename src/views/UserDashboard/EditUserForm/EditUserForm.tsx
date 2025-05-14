import * as yup from "yup";
import { Box, TextField, Button, Typography } from "@mui/material";
import { Formik, Form } from "formik";
import { inputStyle } from "../userDashboard.style";
import { colors } from "../../../theme/colors";
import { useAuth } from "../../../context/LoginContext/LoginContext";
import { EditableUserFields } from "../../../api/types";

const validationSchema = yup.object({
  firstName: yup.string(),
  lastName: yup.string(),
  email: yup.string().email("Invalid email"),
  username: yup
    .string()
    .test("is-username-editable", "Username is required", function (value) {
      return this.options.context?.isUsername ? !!value : true;
    }),
});

const EditUserForm = () => {
  const { userData, updateUserProfile } = useAuth();

  if (!userData) return null;

  const isUsername = !userData.username;

  const handleSubmit = async (values: EditableUserFields): Promise<void> => {
    if (!userData) return;
    await updateUserProfile(values);
  };

  return (
    <Formik<EditableUserFields>
      initialValues={{
        username: userData.username || "",
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, handleChange, handleBlur, errors, touched }) => (
        <Form>
          <Box mb={3}>
            {isUsername && (
              <Typography color={colors.warning} sx={{ mb: 2 }}>
                To finish setting up your account, please choose a username.
              </Typography>
            )}
            <TextField
              name="username"
              label="Username"
              value={values.username}
              onChange={handleChange}
              onBlur={handleBlur}
              fullWidth
              variant="outlined"
              sx={inputStyle}
              disabled={!isUsername}
              error={touched.username && Boolean(errors.username)}
              helperText={
                touched.username && errors.username
                  ? errors.username
                  : isUsername
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
