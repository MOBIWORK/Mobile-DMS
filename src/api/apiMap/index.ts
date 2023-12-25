import {apiMap} from './apiMap';

export const apiDecodeMap = (
  lat: number | undefined,
  lon: number | undefined,
) => apiMap.getAddress(lat, lon).then(res => res.data);
