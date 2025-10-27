import type { ShootDetailsData } from '@/screens/ShootDetailsScreen/ShootDetailsScreen.types';

export type ShootStackParamList = {
  Shoot: undefined;
  ShootDetails: {
    shootData?: ShootDetailsData;
  };
  CountdownScreen: undefined;
  DeliveryDeadlineScreen: undefined;
};

