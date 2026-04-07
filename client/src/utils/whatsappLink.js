export const generateWhatsAppLink = (number, message) => {
  // Remove any non-numeric characters from the number
  const cleanNumber = number.replace(/\D/g, '');
  
  // Encode the message
  const encodedMessage = encodeURIComponent(message);
  
  // Return the WhatsApp API link
  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
};
