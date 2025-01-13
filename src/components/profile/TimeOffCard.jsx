import React from "react";
import {
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Box,
  Tooltip,
} from "@mui/material";

export const TimeOffCard = ({ title, data }) => (
  <Card>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h4" color="primary">
        {data.remaining}h
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Tooltip
          title={`Used: ${data.used}h / Total: ${data.remaining + data.used}h`}
        >
          <LinearProgress
            variant="determinate"
            value={(data.used / (data.remaining + data.used)) * 100}
          />
        </Tooltip>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Accrual Rate: {data.accrualRate}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Next Accrual: {new Date(data.nextAccrual).toLocaleDateString()}
      </Typography>
    </CardContent>
  </Card>
);
