import { API_KEY } from '@env'
import axios from 'axios'


export const apiMap = {
    getAddress(lat:number|undefined,lon:number|undefined){
        return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat}+ ${','} +${lon}&key=AIzaSyD7wudnhwE2hOpibBPNq7LPHqLPkdp6WvU`)
    }
}