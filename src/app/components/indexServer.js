import { SearchResult } from "./indexClient";

/**
 * 
 * @param {Object} props 
 * @param {StylesObject} props.styles
 * @param {Array<OpenMeteoGeocodeResponse>} props.locations
 * 
 */
export const SuggestedLocations = async (props) => {
    

    const results = props.locations.map(result => {   
        return SearchResult({
            text: result.name,
            coords: [result.latitude, result.longitude]
        })
    });

    return <></>;
}