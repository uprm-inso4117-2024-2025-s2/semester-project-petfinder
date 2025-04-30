import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ReportPetScreen from '../../../app/(tabs)/ReportScreen';
import { Alert } from 'react-native';

jest.spyOn(Alert, 'alert');

describe('ReportPetScreen Input Validation', () => {
  it('prevents submission with empty required fields for lost pets', async () => {
    const { getByTestId, getByPlaceholderText } = render(<ReportPetScreen />);

    fireEvent.press(getByTestId('buttonSubmitReport'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Required Field Missing',
        'Please fill out the Last Seen Location.'
      );
    });
  });

  it('displays error when only some contact fields are filled', async () => {
    const { getByPlaceholderText, getByTestId } = render(<ReportPetScreen />);

    fireEvent.changeText(getByPlaceholderText('Enter location'), 'Mayagüez Pueblo');
    fireEvent.press(getByTestId('buttonPickDateTime'));
    fireEvent(getByTestId('datePicker'), 'onConfirm', new Date());

    fireEvent.changeText(getByPlaceholderText('Name'), 'Ana');
    fireEvent.changeText(getByPlaceholderText('Phone'), '7875550000');
    // Email left blank

    fireEvent.press(getByTestId('buttonSubmitReport'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Required Field Missing',
        'Please fill out your Contact Information (Name, Phone, Email).'
      );
    });
  });

  it('allows successful submission when all required fields are filled (lost pet)', async () => {
    const { getByPlaceholderText, getByTestId } = render(<ReportPetScreen />);

    fireEvent.changeText(getByPlaceholderText('Enter pet name'), 'Fido');
    fireEvent.changeText(getByPlaceholderText('Enter location'), 'Añasco');
    fireEvent.press(getByTestId('buttonPickDateTime'));
    fireEvent(getByTestId('datePicker'), 'onConfirm', new Date());
    fireEvent.changeText(getByPlaceholderText('Enter description'), 'Small white dog');

    fireEvent.changeText(getByPlaceholderText('Name'), 'Ana');
    fireEvent.changeText(getByPlaceholderText('Phone'), '7875550000');
    fireEvent.changeText(getByPlaceholderText('Email'), 'ana@example.com');

    fireEvent.press(getByTestId('buttonSubmitReport'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Submitted!',
        'Your report has been submitted.'
      );
    });
  });

  it('shows error if pet condition is missing for found pets', async () => {
    const { getByText, getByPlaceholderText, getByTestId } = render(<ReportPetScreen />);

    fireEvent.press(getByText('Found/Stray'));
    fireEvent.changeText(getByPlaceholderText('Enter location'), 'Plaza Colón');
    fireEvent.press(getByTestId('buttonPickDateTime'));
    fireEvent(getByTestId('datePicker'), 'onConfirm', new Date());

    fireEvent.changeText(getByPlaceholderText('Name'), 'Luis');
    fireEvent.changeText(getByPlaceholderText('Phone'), '9399991234');
    fireEvent.changeText(getByPlaceholderText('Email'), 'luis@example.com');

    fireEvent.press(getByTestId('buttonSubmitReport'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Required Field Missing',
        'Please select the Pet Condition.'
      );
    });
  });
});
