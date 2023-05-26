/**
 * @typedef {Object} StylesObject
 * @property {string} [key: string]
 * 
*/

/**
 * @typedef {Object} OpenMeteoGeocodeResponse
 * @property {number} id - Unique ID for this location (Integer)
 * @property {string} name - Location name. Localized following the &language= parameter, if possible (String)
 * @property {number} latitude - Geographical WGS84 latitude coordinate of this location (Floating point)
 * @property {number} longitude - Geographical WGS84 longitude coordinate of this location (Floating point)
 * @property {number} elevation - Elevation above mean sea level of this location (Floating point)
 * @property {string} timezone - Time zone using time zone database definitions (String)
 * @property {string} feature_code - Type of this location. Following the GeoNames feature_code definition (String)
 * @property {string} country_code - 2-Character FIPS country code. E.g. DE for Germany (String)
 * @property {string} country - Country name. Localized following the &language= parameter, if possible (String)
 * @property {number} country_id - Unique ID for this country (Integer)
 * @property {number} population - Number of inhabitants (Integer)
 * @property {string[]} postcodes - List of postcodes for this location (String array)
 * @property {string} admin1 - Name of the first hierarchical administrative area this location resides in. Localized following the &language= parameter, if possible (String)
 * @property {string} admin2 - Name of the second hierarchical administrative area this location resides in. Localized following the &language= parameter, if possible (String)
 * @property {string} admin3 - Name of the third hierarchical administrative area this location resides in. Localized following the &language= parameter, if possible (String)
 * @property {string} admin4 - Name of the fourth hierarchical administrative area this location resides in. Localized following the &language= parameter, if possible (String)
 * @property {number} admin1_id - Unique ID for the first hierarchical administrative area (Integer)
 * @property {number} admin2_id - Unique ID for the second hierarchical administrative area (Integer)
 * @property {number} admin3_id - Unique ID for the third hierarchical administrative area (Integer)
 * @property {number} admin4_id - Unique ID for the fourth hierarchical administrative area (Integer)
*/