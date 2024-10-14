import * as yup from "yup";
import { Box, Button, Grid, TextField, Typography, Link } from "@mui/material";
import { Form, Formik } from "formik";
import { useAuth } from "../../../context/LoginContext/LoginContext";
import { Link as RouterLink } from "react-router-dom";
import { paths } from "../../../paths";

const emailSchema = yup.object().shape({
  email: yup
    .string()
    .email("Wprowadź poprawny adres E-Mail")
    .required("E-Mail jest wymagany"),
});

interface Values {
  email: string;
}

const initValues: Values = {
  email: "",
};

const ForgotPassword = () => {
  const { handleSendResetPasswordEmail } = useAuth();

  const handleSubmit = ({ email }: Values) =>
    handleSendResetPasswordEmail(email);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography component="h1" variant="h5" sx={{ my: 2 }}>
        Reset Password
      </Typography>
      <Typography component="p">
        Type your email address and we will send you a link to reset your
      </Typography>
      <Formik
        initialValues={initValues}
        onSubmit={handleSubmit}
        validationSchema={emailSchema}
      >
        {({
          values,
          handleChange,
          handleSubmit,
          handleBlur,
          errors,
          touched,
        }) => (
          <Form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <TextField
              margin="normal"
              fullWidth
              id="email"
              label="Adres e-mail"
              name="email"
              autoComplete="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(touched.email) && Boolean(errors.email)}
              helperText={touched.email && errors.email}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Send email
            </Button>
          </Form>
        )}
      </Formik>
      <Grid container>
        <Grid item xs>
          <Link component={RouterLink} to={paths.LOGIN}>
            Back to login
          </Link>
        </Grid>
        <Grid item>
          <Link component={RouterLink} to={paths.REGISTER}>
            Don't have an account? Sign up
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ForgotPassword;
