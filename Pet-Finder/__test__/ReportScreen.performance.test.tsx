import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ReportPetScreen from '../app/(tabs)/ReportScreen'; 

describe('Performance Tests for ReportScreen', () => {
  it('renders the ReportScreen quickly', () => {
    const startTime = performance.now();
    const { getByText } = render(<ReportPetScreen />);
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    console.log('Render time:', renderTime, 'ms');
    expect(renderTime).toBeLessThan(500);
  });

  it('handles form submission quickly', async () => {
    const { getByPlaceholderText, getByText } = render(<ReportPetScreen />);

    const petNameInput = getByPlaceholderText('Enter pet name');
    const locationInput = getByPlaceholderText('Enter location');
    const contactNameInput = getByPlaceholderText('Name');
    const contactPhoneInput = getByPlaceholderText('Phone');
    const contactEmailInput = getByPlaceholderText('Email');

    fireEvent.changeText(petNameInput, 'Buddy');
    fireEvent.changeText(locationInput, 'Central Park');
    fireEvent.changeText(contactNameInput, 'John Doe');
    fireEvent.changeText(contactPhoneInput, '1234567890');
    fireEvent.changeText(contactEmailInput, 'john@example.com');

    const submitButton = getByText('Submit');

    const startSubmitTime = performance.now();
    fireEvent.press(submitButton);
    const endSubmitTime = performance.now();
    const submissionTime = endSubmitTime - startSubmitTime;
    console.log('Submission handling time:', submissionTime, 'ms');
    expect(submissionTime).toBeLessThan(400);
  });
});
