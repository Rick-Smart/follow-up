// import Joi from "joi";
// import DOMPurify from "dompurify";

// // Validation schema for tickets
// const ticketSchema = Joi.object({
//   incNumber: Joi.string().required().min(10).label("INC Number"),
//   msisdn: Joi.string().required().min(10).label("MSISDN"),
//   submittedBy: Joi.string().required().label("Submitted By"),
//   description: Joi.string().required().label("Description"),
// });

// // Sanitize inputs
// export const sanitizeInputs = (inputs) => {
//   const sanitized = {};
//   for (const key in inputs) {
//     sanitized[key] = DOMPurify.sanitize(inputs[key]);
//   }
//   return sanitized;
// };

// // Validate inputs
// export const validateTicket = (data) => {
//   const { error } = ticketSchema.validate(data);
//   if (error) {
//     throw new Error(error.details[0].message);
//   }
// };

// --------------------------------------------------------------

import Joi from "joi";
import DOMPurify from "dompurify";

// Validation schema for tickets
const ticketSchema = Joi.object({
//   complaint: Joi.number().required().min(8).label("Complaint"), // New field added
  incNumber: Joi.number().required().min(9).label("INC Number"),
  msisdn: Joi.number().required().min(10).label("MSISDN"),
  submittedBy: Joi.string().required().label("Submitted By"),
  description: Joi.string().required().label("Description"),
});

// Sanitize inputs
export const sanitizeInputs = (inputs) => {
  const sanitized = {};
  for (const key in inputs) {
    sanitized[key] = DOMPurify.sanitize(inputs[key]);
  }
  return sanitized;
};

// Validate inputs
export const validateTicket = (data) => {
  const { error } = ticketSchema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
};
