import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import { IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import MuiModal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "none",
  borderRadius: "16px",
  boxShadow: 24,
  p: 4,
  pt: 6,
  pb: 5,
  outline: "none",
};

type Props = {
  children: React.ReactNode;
  open: boolean;
  handleClose: () => void;
  showPoweredBy?: boolean;
};

export default function Modal({
  children,
  open,
  handleClose,
  showPoweredBy = true,
}: Props) {
  return (
    <MuiModal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <Box sx={style}>
          <IconButton
            onClick={handleClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
          {children}
          {showPoweredBy && (
            <Typography
              variant="caption"
              display="block"
              sx={{
                position: "absolute",
                left: "50%",
                bottom: 10,
                transform: "translateX(-50%)",
                color: "black",
                width: "100%",
                textAlign: "center",
              }}
            >
              Powered by ZeroDev
            </Typography>
          )}
        </Box>
      </Fade>
    </MuiModal>
  );
}
