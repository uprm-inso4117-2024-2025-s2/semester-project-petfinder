function validateLostReport(input) {
  const requiredFields = [
    'pet_id',
    'owner_id',
    'description',
    'photo',
    'lost_at',
    'location',
    'status'
  ];

  for (const field of requiredFields) {
    if (!input[field]) {
      throw new Error(`Missing field: ${field}`);
    }
  }

  if (input.description.length > 500) {
    throw new Error('Description too long');
  }

  return { status: 'valid' };
}

module.exports = {
  validateLostReport
};
