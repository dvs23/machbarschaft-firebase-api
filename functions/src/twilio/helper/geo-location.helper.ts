import { Client, GeocodeResponse, Status } from "@googlemaps/google-maps-services-js";
import { firestore } from 'firebase-admin';
import { logger, LogLevel } from './logger.helper';

export const getGeoPosByLocation = async (address: string, language: string): Promise<firestore.GeoPoint> => {
    return new Promise((resolve, reject) => {
        new Client({})
            .geocode({
                params: {
                    address,
                    language,
                    key: process.env.GOOGLE_GEO_API_KEY || ''
                },
                timeout: 5000
            }).then((r: GeocodeResponse) => {
                logger('', '', `Found Address via Google Geo API`, r.data);
                if (r.data.status === Status.OK) {
                    resolve(new firestore.GeoPoint(
                        r.data.results[ 0 ].geometry.location.lat,
                        r.data.results[ 0 ].geometry.location.lng
                    ));
                } else {
                    logger('', '', `Failed Find Address via Google Geo API: Status Not OK`, r.statusText, LogLevel.ERROR);
                    reject();
                }
            })
            .catch(e => {
                logger('', '', `Failed Find Address via Google Geo API: `, e, LogLevel.ERROR);
                reject(e);
            });
    });
};