export interface ShootAddon {
  name: string;
}

export interface ShootSong {
  title: string;
  artist: string;
  thumbnail: string;
}

export interface ShootDetailsData {
  id?: string;
  title: string;
  location: string;
  date: string;
  time: string;
  category: string;
  earnings: string;
  distance: string;
  eta: string;
  shootHours: string;
  reelsRequired: string;
  instantDelivery: string;
  addons: string[];
  description: string;
  songs: ShootSong[];
  isFromUpcoming?: boolean;
}

