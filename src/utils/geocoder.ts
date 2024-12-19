import Geocoder from 'react-native-geocoding';
import { CustomerLocation } from 'src/models/user/CustomerSettings';
import { WaitingList } from 'src/models/user/WaitingList';
import { GOOGLE_MAPS_API_KEY } from 'src/services/maps-config';

const initGeocoder = () => {
  Geocoder.init(GOOGLE_MAPS_API_KEY);
};

const operatingStates = ['Texas'];

const checkIfIsOperatingInLocation = (location: CustomerLocation): Promise<{ isOperating: boolean; locationData: WaitingList }> => {
  return new Promise((resolve, reject) => {
    let state = '';
    let city = '';
    let postalCode = '';
    const latitude = location.latitude;
    const longitude = location.longitude;

    Geocoder.from(latitude, longitude)
      .then(json => {
        console.log('json', json);
        
        city = json.results[0]?.address_components.find(component => 
          component.types.includes("locality") || component.types.includes("administrative_area_level_2")
        )?.long_name || '';
        
        state = json.results[0]?.address_components.find(component => 
          component.types.includes("administrative_area_level_1")
        )?.long_name || '';
        
        postalCode = json.results[0]?.address_components.find(component => 
          component.types.includes("postal_code")
        )?.long_name || '';

        const waitingList: WaitingList = {
          email: '',
          latitude,
          longitude,
          city,
          state,
          postalCode
        };

        console.log('waitingList', waitingList)

        if (operatingStates.includes(state)) {
          resolve({ isOperating: true, locationData: waitingList });
        } else {
          resolve({ isOperating: false, locationData: waitingList });
        }
      })
      .catch(error => {
        reject(error);
      });
  });
}

const isPointInPolygon = (point: number[], polygon: number[][]) => {
  const [x, y] = point;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];

    // Check if the point is within the vertical bounds of the edge
    const intersect = ((yi > y) !== (yj > y)) &&
      (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi);

    if (intersect) inside = !inside;
  }

  return inside;
}

export { initGeocoder, checkIfIsOperatingInLocation };
