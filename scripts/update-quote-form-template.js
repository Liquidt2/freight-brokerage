const emailTemplate = {
  subject: "New Quote Request from {companyName}",
  sections: [
    {
      title: "CONTACT DETAILS",
      fields: [
        { label: "Company", value: "{companyName}" },
        { label: "Contact", value: "{contactName}" },
        { label: "Email", value: "{email}" },
        { label: "Phone", value: "{phone}" }
      ]
    },
    {
      title: "SHIPMENT DETAILS",
      fields: [
        { label: "From", value: "{originCity}, {originState} {zipCode}" },
        { label: "To", value: "{destinationCity}, {destinationState} {destinationZip}" },
        { label: "Pickup", value: "{originPickupDate}" },
        { label: "Delivery", value: "{deliveryDate}" }
      ]
    },
    {
      title: "LOAD DETAILS",
      fields: [
        { label: "Type", value: "{truckTrailerType}" },
        { label: "Commodity", value: "{commodityType}" },
        { label: "Weight", value: "{weight} lbs" },
        { label: "Dimensions", value: "{dimensions}" }
      ]
    },
    {
      title: "SPECIAL REQUIREMENTS",
      fields: [
        { label: "Hazmat", value: "{isHazmat?UN: {unNumber}, Class: {hazmatClass}}" },
        { label: "Temperature Control", value: "{isTemperatureControlled?{temperature}°F}" },
        { label: "Palletized", value: "{isPalletized?{palletCount} pallets}" },
        { label: "High Value", value: "{isHighValue?Yes}" },
        { label: "Special Handling", value: "{specialHandling}" }
      ]
    }
  ],
  footer: "Best regards,\nYour Freight System\n\nThis is an automated message. Please do not reply directly."
};

// For use in Sanity Studio
console.log(JSON.stringify(emailTemplate, null, 2));
