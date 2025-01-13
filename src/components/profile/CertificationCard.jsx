// src/components/profile/CertificationCard.jsx
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Box,
} from "@mui/material";
import { School as TrainingIcon } from "@mui/icons-material";

export const CertificationCard = ({ certifications }) => (
  <Card>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        Certifications
      </Typography>
      <List>
        {certifications.map((cert, index) => (
          <ListItem key={index}>
            <ListItemIcon>
              <TrainingIcon />
            </ListItemIcon>
            <ListItemText
              primary={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {cert.name}
                  <Chip
                    size="small"
                    label={cert.status}
                    color={cert.status === "active" ? "success" : "error"}
                  />
                </Box>
              }
              secondary={`Valid until: ${new Date(
                cert.expiryDate
              ).toLocaleDateString()}`}
            />
          </ListItem>
        ))}
      </List>
    </CardContent>
  </Card>
);
