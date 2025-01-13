import Joi from "joi";
import DOMPurify from "dompurify";

// Enhanced validation schema for tickets
export const ticketSchema = Joi.object({
  incNumber: Joi.string()
    .pattern(/^[0-9]{9,}$/)
    .required()
    .messages({
      "string.pattern.base": "INC Number must be at least 9 digits",
      "any.required": "INC Number is required",
    }),
  msisdn: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .required()
    .messages({
      "string.pattern.base": "MSISDN must be between 10-15 digits",
      "any.required": "MSISDN is required",
    }),
  submittedBy: Joi.string().trim().min(2).max(50).required().messages({
    "string.min": "Submitted By must be at least 2 characters",
    "string.max": "Submitted By cannot exceed 50 characters",
    "any.required": "Submitted By is required",
  }),
  description: Joi.string().trim().min(10).max(500).required().messages({
    "string.min": "Description must be at least 10 characters",
    "string.max": "Description cannot exceed 500 characters",
    "any.required": "Description is required",
  }),
  priority: Joi.string()
    .valid("low", "normal", "high")
    .default("normal")
    .messages({
      "any.only": "Priority must be low, normal, or high",
    }),
});

// Sanitize inputs
export const sanitizeInputs = (inputs) => {
  const sanitized = {};
  for (const key in inputs) {
    sanitized[key] = DOMPurify.sanitize(inputs[key]);
  }
  return sanitized;
};

// Comprehensive ticket validation function
export const validateTicket = (ticketData) => {
  // Perform validation
  const { error, value } = ticketSchema.validate(ticketData, {
    abortEarly: false, // collect all errors
    convert: true, // convert types
  });

  // If there are validation errors
  if (error) {
    // Transform Joi error into a more readable format
    const formattedErrors = error.details.reduce((acc, curr) => {
      acc[curr.path[0]] = curr.message;
      return acc;
    }, {});

    return {
      isValid: false,
      errors: formattedErrors,
    };
  }

  // If validation passes, return sanitized data
  return {
    isValid: true,
    data: value,
  };
};
