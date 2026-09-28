import { Alert, Box, Button, CircularProgress, Typography } from "@mui/material";
import { ReactNode } from "react";

import { errorMessage, loader } from "../../theme/layout";

type Props<T> = {
  round: T | null;
  isLoading: boolean;
  hasError: boolean;
  onRetry: () => void;
  children: (round: T) => ReactNode;
};

const RoundContent = <T,>({ round, isLoading, hasError, onRetry, children }: Props<T>) => {
  if (isLoading) return <CircularProgress sx={loader} />;

  if (!round) {
    return (
      <Box sx={errorMessage}>
        <Typography component="p">Could not load a round. Please try again.</Typography>
        <Button onClick={onRetry}>Try again</Button>
      </Box>
    );
  }

  return (
    <>
      {hasError && <Alert severity="error">Could not send your answer. Choose it again to retry.</Alert>}
      {children(round)}
    </>
  );
};

export default RoundContent;
