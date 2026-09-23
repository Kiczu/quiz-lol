import { Box, Button } from "@mui/material";
import { Formik, Form } from "formik";
import * as yup from "yup";

import FormTextField from "../FormTextField/FormTextField";
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
    onSubmit={async ({ password }) => {
      await onSubmit(password);
    }}
  >
    {({ isSubmitting }) => (
      <Form>
        <Box>
          <FormTextField
            name="password"
            label="Current Password"
            type="password"
            fullWidth
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
