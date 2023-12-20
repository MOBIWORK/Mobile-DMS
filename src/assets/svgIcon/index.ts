import iconMap from './iconMap.svg';
import ArrowDown from './arrowDown.svg';
import Trash from './trash.svg';
import MapPin from './mapPin.svg';
import Phone from './phone.svg';
import Location from './Location.svg';
import MapLocation from './mapLocation.svg';
import arrowRight from './arrowRight.svg'
export const SvgComponent = {
  iconMap,
  ArrowDown,
  Trash,
  MapPin,
  Phone,
  Location,
  MapLocation,
  arrowRight
};
export type SvgIconTypes = keyof typeof SvgComponent;
