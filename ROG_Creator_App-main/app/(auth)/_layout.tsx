import React from 'react';
import { Stack } from 'react-native-auto-route';

const AuthLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
};

export default AuthLayout;
