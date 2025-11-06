import type { ShootDetailsData } from '@/screens/AppScreens/Shoot/ShootDetailsScreen/ShootDetailsScreen.types';

export type ShootStackParamList = {
  Shoot: undefined;
  ShootDetails: {
    shootData?: ShootDetailsData;
  };
  CountdownScreen: undefined;
  DeliveryDeadlineScreen: undefined;
};

