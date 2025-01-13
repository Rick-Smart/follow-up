// src/components/ProfilePictureUpload.jsx
import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Input,
  Typography,
} from "@mui/material";
import { uploadProfilePicture } from "../utils/userController";
import { useUserContext } from "../contexts/UserContext";

const ProfilePictureUpload = ({ open, onClose }) => {
  const { currentUser, updateUser } = useUserContext();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  const handleFileChange = (event) => {
    if (event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setUploadError(null);
    }
  };

  const handleUpload = async () => {
    if (selectedFile && currentUser) {
      try {
        // Validate file size (e.g., max 5MB)
        if (selectedFile.size > 5 * 1024 * 1024) {
          setUploadError("File is too large. Maximum size is 5MB.");
          return;
        }

        // Validate file type
        const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
        if (!allowedTypes.includes(selectedFile.type)) {
          setUploadError(
            "Invalid file type. Please upload a JPEG, PNG, or GIF."
          );
          return;
        }

        const downloadURL = await uploadProfilePicture(
          currentUser.uid,
          selectedFile
        );

        // Update user context
        updateUser({
          ...currentUser,
          profilePicture: downloadURL,
        });

        // Close the dialog
        onClose();
      } catch (error) {
        setUploadError("Upload failed. Please try again.");
        console.error("Upload failed", error);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Upload Profile Picture</DialogTitle>
      <DialogContent>
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          fullWidth
          margin="normal"
        />
        {uploadError && (
          <Typography color="error" variant="body2">
            {uploadError}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleUpload} disabled={!selectedFile} color="primary">
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProfilePictureUpload;
