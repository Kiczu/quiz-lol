import { Box, Button, TextField } from "@mui/material";
import { Formik, Form } from "formik";
import * as yup from "yup";

interface Props {
  onSubmit: (password: string) => Promise<void> | void;
  onCancel?: () => void;
}

const schema = yup.object({
  password: yup.string().required("Current password is required"),
});

const ReauthPasswordForm = ({ onSubmit, onCancel }: Props) => (
  <Formik
    initialValues={{ password: "" }}
    validationSchema={schema}
    onSubmit={async ({ password }, { setSubmitting }) => {
      await onSubmit(password);
      setSubmitting(false);
    }}
  >
    {({ values, handleChange, handleBlur, errors, touched, isSubmitting }) => (
      <Form>
        <Box>
          <TextField
            name="password"
            label="Current Password"
            type="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            fullWidth
            error={touched.password && Boolean(errors.password)}
            helperText={
              touched.password && errors.password ? errors.password : " "
            }
            sx={{ mb: 2 }}
            autoFocus
            disabled={isSubmitting}
          />
          <Box display="flex" gap={2} justifyContent="flex-end">
            {onCancel && (
              <Button
                variant="outlined"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              Confirm
            </Button>
          </Box>
        </Box>
      </Form>
    )}
  </Formik>
);

export default ReauthPasswordForm;
