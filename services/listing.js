import axios from 'axios';
import {
  reject
} from 'q';
// import {
//   resolve
// } from 'dns';
// import {
//   reject
// } from 'q';
var conf;
const api = "https://spleetcms.herokuapp.com/api/v1/"

let user = JSON.parse(localStorage.getItem("user"));
if (user) {
  axios.interceptors.request.use(function (config) {
    const token = user.token;
    config.headers.Authorization = token
    conf = config.headers;
    return config;
  });

}

const attrubute = {}

// create listing
export async function createListing() {
  let data;
  await axios.post(api + 'listings/property-listing-type/create', attrubute)
    .then(listing => {
      data = listing.data
    })
    .catch(function (error) {
      throw error
    });
  return data
}

// get property type data
export async function propertyTypeData() {
  let data;
  await axios.get(api + "listings/property-types-and-categories").then(propTypeData => {
      data = propTypeData.data
    })
    .catch(function (error) {
      throw error
    })
  return data
}

// add property type
export async function propertyType(routeId, propTypeValueId, spaceType, liveInLL, aCompany, step, level) {
  let data;
  await axios.put(api + "listings/property-listing-type/update/" + routeId, {
      propertyTypeCategoryId: propTypeValueId,
      spaceType: spaceType,
      liveInLandlord: liveInLL,
      organization: aCompany,
      current_step: step,
      level: level
    }).then(propTypeUpdate => {
      data = propTypeUpdate.data
    })
    .catch(function (error) {
      throw error
    })
  return data
}

// return all property
export async function AllPropertyTypeReturned(routeId) {
  let data;
  await axios.get(api + "listings/property-listing-type/" + routeId).then(propType => {
      data = propType.data
    })
    .catch(function (error) {
      throw error
    })
  return data
}

// get rooms
export async function getRooms(routeId) {
  let data;
  await axios.get(api + "listings/rooms/" + routeId).then(returnRooms => {
      data = returnRooms
    })
    .catch(function (err) {
      throw err
    })
  return data
}

// add room
export async function addRoom(routeId, masterBed, bathroomType, amenities, images, name) {
  let data;
  await axios.post(api + "listings/rooms/create/" + routeId, {
    propertyListingId: routeId,
    isMasterBedroom: masterBed,
    bathroomTypeId: bathroomType,
    amenities: amenities,
    images: images,
    name: name
  }).then(addRooms => {
    data = addRooms.data
  }).catch(function (err) {
    throw err
  })
  return data
}

// delete room
export async function deleteRoom(roomId) {
  let data;
  await axios.delete(api + "listings/room/delete/" + roomId).then(deleteRooms => {
    data = deleteRooms.data
  }).catch(function (err) {
    throw err
  })
  return data
}

// get bathrooms
export async function getBathrooms() {
  let data;
  await axios.get(api + "listings/bathroom-types").then(getBaths => {
    data = getBaths
  }).catch(function (err) {
    throw err
  })
  return data
}

// update room for editing a room
export async function updateRoom(roomId, masterBed, BathroomTypeId, amenities, images, name) {
  let data;
  await axios.put(api + "listings/room/update/" + roomId, {
    isMasterBedroom: masterBed,
    bathroomTypeId: BathroomTypeId,
    amenities: amenities,
    images: images,
    name: name
  }).then(updateRoom => {
    data = updateRoom
  }).catch(function (err) {
    throw err
  })
  return data
}

// add description
export async function addDescription(routeId, description, yourSpace, availability, neighbourhood, getAround, step, level) {
  let data;
  await axios.put(api + "listings/description/" + routeId, {
    description: description,
    more_info: yourSpace,
    availability: availability,
    neighbourhood: neighbourhood,
    getting_around: getAround,
    current_step: step,
    level: level
  }).then(postDescription => {
    data = postDescription
  }).catch(function (err) {
    throw err
  })
  return data
}

// return getDescription
export async function getDescription(routeId) {
  let data;
  await axios.get(api + "listings/description/" + routeId).then(getDescription => {
    data = getDescription
  }).catch(function (err) {
    throw err
  })
  return data
}

// image upload
async function roomImage(formData) {
  const url = `${api}listings/rooms/images/`;
  let data = await axios.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      "Authorization": user.token
    }
  })
  return data
}
export {
  roomImage
}

// return room amenities
export async function roomAmenities() {
  let data;
  await axios.get(api + "listings/room-amenities").then(roomAmenities => {
    data = roomAmenities
  }).catch(function (err) {
    throw err
  })
  return data
}

// update room level on submit
export async function continueFromRoom(routeId, level, step) {
  let data;
  await axios.put(api + "listings/rooms/update/" + routeId, {
    level: level,
    current_step: step
  }).then(continueFromRoom => {
    data = continueFromRoom
  }).catch(function (err) {
    throw err
  })
  return data
}

// update level and step on submit
export async function saveAndExit(routeId, level, step) {
  let data;
  await axios.put(api + "listings/save/exit/" + routeId, {
    level: level,
    currentStep: step
  }).then(saveAndExit => {
    data = saveAndExit
  }).catch(function (err) {
    throw err
  })
  return data
}

// Get features and amenities
export async function getAmenities() {
  let data;
  await axios.get(api + "listings/all-amenities").then(getAllAmenities => {
    data = getAllAmenities
  }).catch(function (err) {
    throw err
  })
  return data
}

// return submitted amenities
export async function returnAmenities(routeId) {
  let data;
  await axios.get(api + "listings/amenities/" + routeId).then(returnAmenities => {
    data = returnAmenities
  }).catch(function (err) {
    throw err
  })
  return data
}

// submit amenities
export async function submitAmenities(routeId, amenities, level, step) {
  let data;
  await axios.put(api + "listings/amenities/update/" + routeId, {
    amenity: amenities,
    level: level,
    current_step: step,
  }).then(allAmenities => {
    data = allAmenities
  }).catch(function (err) {
    throw err
  })
  return data
}

// property Listing Images
export async function propertyImages(routeId, images, step, level) {
  let data;
  await axios.put(api + "listings/images/update/" + routeId, {
    images: images,
    current_step: step,
    level: level
  }).then(postImages => {
    data = postImages
  }).catch(function (err) {
    throw err
  })
  return data
}

//Get all property listing Images
export async function getPropertyImages(routeId) {
  let data;
  await axios.get(api + "listings/images/" + routeId).then(getImages => {
    data = getImages
  }).catch(function (err) {
    throw err
  })
  return data
}

// Listing Name
export async function addListingName(routeId, name, step, level) {
  let data;
  await axios.put(api + "listings/name/update/" + routeId, {
    name: name,
    current_step: step,
    level: level
  }).then(addListingName => {
    data = addListingName
  }).catch(function (err) {
    throw err
  })
  return data
}

// Return Listing Name
export async function getListingName(routeId) {
  let data;
  await axios.get(api + "listings/name/" + routeId).then(listingName => {
    data = listingName
  }).catch(function (err) {
    throw err
  })
  return data
}

// getCountries
export async function getCountries() {
  let data;
  await axios.get(api + "listings/countries").then(countries => {
    data = countries
  }).catch(function (err) {
    throw err
  })
  return data;
}

//get states
export async function getStates(countryId) {
  let data;
  data = await axios.get(api + "listings/states/" + countryId);
  // data = await axios.get(api + "listings/states/" + countryId).then(states => {
  //   data = states
  // }).catch(function (err) {
  //   throw err
  // })
  return data
}

// Create Location
export async function postLocation(routeId, streetAddress, landmark, country, countryId, lat, log, state, stateId, city, level, step) {
  let data;
  await axios.post(api + "listings/location/create/" + routeId, {
    street_address: streetAddress,
    neighbourhood: landmark,
    country: country,
    country_code: countryId,
    latitude: lat,
    longitude: log,
    state: state,
    state_code: stateId,
    city: city,
    level: level,
    current_step: step
  }).then(postLocation => {
    data = postLocation
  }).catch(function (err) {
    throw err
  })
  return data;
}

// get location
export async function getLocation(routeId) {
  let data;
  await axios.get(api + "listings/location/" + routeId).then(getLocation => {
    data = getLocation
  }).catch(function (err) {
    throw err
  })
  return data
}

//update location
export async function updateLocation(routeId, streetAddress, landmark, country, countryId, lat, log, state, stateId, city, level, step) {
  let data;
  await axios.put(api + "listings/location/update/" + routeId, {
    street_address: streetAddress,
    neighbourhood: landmark,
    country: country,
    country_code: countryId,
    latitude: lat,
    longitude: log,
    state: state,
    state_code: stateId,
    city: city,
    level: level,
    current_step: step
  }).then(updateLocation => {
    data = updateLocation
  }).catch(function (err) {
    throw err
  })
  return data
}


// Get members rules
export function getMembersRules() {
  // return new Promise((resolve, reject) => {
  //   axios.get(`${api}listings/rules/all`, {
  //     headers: header
  //   }).then((data) => resolve(data)).catch((err) => reject(err))
  // })
  return axios.get(`${api}listings/rules/all`).then((data) => {
    return data
  }).catch((err) => {
    return err;
  })
}

// Get selected rules
export function getSelectedRules(routeId) {
  return axios.get(`${api}listings/rule/${routeId}`).then((data) => {
    return data
  }).catch((err) => {
    return err;
  })
}


//Post selected Rules
export function selectedRules(routeId, selectRules) {
  return axios.put(`${api}listings/rule/${routeId}/create`, {
    rules: selectRules
  }).then((data) => {
    return data
  }).catch((err) => {
    return err
  })
}

// Get all plans
export function getAllPlans() {
  return axios.get(`${api}listings/plans/all`).then((data) => {
    return data
  }).catch((err) => {
    return err;
  })
}

//Post selected plans
export function selectPlans(routeId, rentBefore, plans) {
  return axios.put(`${api}listings/plan/${routeId}/create`, {
    rented_out_before: rentBefore,
    plans: plans
  }).then((data) => {
    return data
  }).catch((err) => {
    return err
  })
}

// Get selected plan
export function getSelectedPlan(routeId) {
  return axios.get(`${api}listings/plan/${routeId}`).then((data) => {
    return data
  }).catch((err) => {
    return err;

  })
}

// updateCalendar
export function updateCalendar(routeId, keepCalendarUpdated, minNightValue, maxNightValue, advanceBook, arrivalNotice, checkinFrom, checkinTo) {
  return axios.put(`${api}listings/apartment/${routeId}/calendar/settings`, {
    calendar_up_to_date: keepCalendarUpdated,
    minimum_night: minNightValue,
    maximum_night: maxNightValue,
    book_in_advance: advanceBook,
    notice_period: arrivalNotice,
    preferred_check_in_time_from: checkinFrom,
    preferred_check_in_time_to: checkinTo,
  }).then(data => {
    return data
  }).catch(err => {
    return err
  })
}

//return updateCalendar data
export function returnUpdateCalendar(routeId) {
  return axios.get(`${api}listings/apartment/${routeId}/calendar/settings`).then(data => {
    return data
  }).catch(err => {
    return err
  })
}

//entire pricing
export function entirePrice(apartmentId, price, manageCLeaning, howOftenCleaning, cleaningCost, manageMaintenance, maintenanceCost, gasCost) {
  return axios.put(`${api}listings/apartment/${apartmentId}/price`, {
    rental_subscription: price,
    cleaning_by_spleet: manageCLeaning,
    cleaning_frequency: howOftenCleaning,
    cleaning_fee: cleaningCost,
    maintenance_by_spleet: manageMaintenance,
    maintenance_fee: maintenanceCost,
    gas_and_power_supply_fee: gasCost
  }).then(data => {
    return data
  }).catch(err => {
    return err
  })
}

// create Pricing
export function createPricing(routeId) {
  return axios.put(`${api}listings/price/${routeId}/create`, {}).then(data => {
    return data
  }).catch(err => {
    return err
  })
}

// dls discount
export function dlsDiscount(routeId, sevenToFourteenDiscount, fourteenToTwentyOneDiscount, TwentyOneAboveDiscount) {
  return axios.put(`${api}listings/apartment/${routeId}/price/discount/daily/add`, {
    daily_above_seven_days: sevenToFourteenDiscount,
    daily_above_fourteen_days: fourteenToTwentyOneDiscount,
    daily_above_twenty_one_days: TwentyOneAboveDiscount,
  }).then(data => {
    return data
  }).catch(err => {
    return err
  })
}

// co-shared pricing
export function sharedPrice(apartmentId, price) {
  return axios.put(`${api}listings/room/apartment/${apartmentId}/price`, {
    rental_subscription: price
  }).then(data => {
    return data
  }).catch(err => {
    return err
  })
}

//co-shared other details
export function updateShareDetails(routeId, manageCLeaning, howOftenCleaning, cleaningCost, manageMaintenance, maintenanceCost, gasCost) {
  return axios.put(`${api}listings/rooms/apartments/${routeId}/price`, {
    cleaning_by_spleet: manageCLeaning,
    cleaning_frequency: howOftenCleaning,
    cleaning_fee: cleaningCost,
    maintenance_by_spleet: manageMaintenance,
    maintenance_fee: maintenanceCost,
    gas_and_power_supply_fee: gasCost
  }).then(data => {
    return data
  }).catch(err => {
    return err
  })
}

// rls discount
export function rlsDiscount(routeId, quarterly, biannually) {
  return axios.put(`${api}listings/apartment/${routeId}/price/discount/rls/add`, {
    quarterly,
    biannually
  }).then(data => {
    return data
  }).catch(err => {
    return err
  })
}

// get all particular user listings
export function getAllListings(userId) {
  return axios.get(`${api}listings/all/${userId}`).then(data => {
    return data
  }).catch(err => {
    return err
  })
}

// Person info for kyc
export function getPersonDetail(userId) {
  return axios.get(`${api}user/kyc/personal-kyc/${userId}`).then(data => {
    return data
  }).catch(err => {
    return err
  })
}

// add Person info for kyc
export function personDetail(userId, fname, lname, gender, dob, relationshipStatus, noKids, personalAdd, landmark, country, state, city) {
  return axios.put(`${api}user/kyc/personal-kyc/${userId}`, {
    first_name: fname,
    last_name: lname,
    gender: gender,
    dob: dob,
    relationship_status: relationshipStatus,
    no_of_kids: noKids,
    full_address: personalAdd,
    landmark: landmark,
    country: country,
    state: state,
    city: city
  }).then(data => {
    return data
  }).catch(err => {
    return err
  })
}

// add Person info for kyc
export function companyDetail(userId, employmentStatus, jobTitle, salary, companyName, managerName, managerNumber, manageEmail, managerAdd, landmark, country, state, city) {
  return axios.put(`${api}user/kyc/work-kyc/${userId}`, {
    emplopyment_status: employmentStatus,
    job_title: jobTitle,
    monthly_salary: salary,
    company_or_business_name: companyName,
    business_partner_or_manager_fullname: managerName,
    business_partner_or_manager_phone: managerNumber,
    business_partner_or_manager_email: manageEmail,
    company_or_employee_full_address: managerAdd,
    landmark: landmark,
    country: country,
    state: state,
    city: city
  }).then(data => {
    return data
  }).catch(err => {
    return err
  })
}

// get company info for kyc
export function getCompanyDetail(userId) {
  return axios.get(`${api}user/kyc/work-kyc/${userId}`).then(data => {
    return data
  }).catch(err => {
    return err
  })
}

// add next of kin info for kyc
export function nextOfKinDetail(userId, fname, lname, email, phone, relationship, address, landmark, country, state, city) {
  return axios.put(`${api}user/kyc/next-of-kin/${userId}`, {
    first_name: fname,
    last_name: lname,
    email: email,
    phone: phone,
    relationship_with_next_of_kin: relationship,
    full_address: address,
    landmark: landmark,
    country: country,
    state: state,
    city: city
  }).then(data => {
    return data
  }).catch(err => {
    return err
  })
}

// get naxt of kin for kyc
export function getNextOfKin(userId) {
  return axios.get(`${api}user/kyc/next-of-kin/${userId}`).then(data => {
    return data
  }).catch(err => {
    return err
  })
}

// image upload
export function uploadId(image) {
  console.log(image)
  return axios.post(`${api}listings/images/upload/base64`, {
    image
  }, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }).then(data => {
    return data
  }).catch(err => {
    return err
  })

}

// add idendtification
export function addIdentification(userId, idUrl, selfie, typeOfId) {
  return axios.put(`${api}user/kyc/identification-kyc/${userId}`, {
    id_url: idUrl,
    selfie_url: selfie,
    type_of_id: typeOfId,
  }).then(data => {
    return data
  }).catch(err => {
    return err
  })
}

// get banks for kyc
export function getBanks() {
  return axios.get(`${api}user/bank-list/NG`).then(data => {
    return data
  }).catch(err => {
    return err
  })
}

// get user Bank details
export function getUserBankDetails(accountNumber, bankCode) {
  return axios.get(`${api}user/bank-account-details?recipientaccount=${accountNumber}&destbankcode=${bankCode}`).then(data => {
    return data;
  }).catch(err => {
    return err
  })
}

// add payment details
export function addPayment(userId, bankName, bankCode, accountNumber, bvn, accountName) {
  return axios.put(`${api}user/kyc/payment-kyc/${userId}`, {
    bank_name: bankName,
    bank_code: bankCode,
    account_number: accountNumber,
    bvn: bvn,
    account_name: accountName
  }).then(data => {
    return data
  }).catch(err => {
    return err
  })
}

// get payment details
export function getPaymentDetails(userId) {
  return axios.get(`${api}user/kyc/payment-kyc/${userId}`).then(data => {
    return data;
  }).catch(err => {
    return err
  })
}

// delete listing
export function deleteListing(listingId) {
  return axios.delete(`${api}listings/property-listing-type/${listingId}`).then(data => {
    return data;
  }).catch(err => {
    return err
  })
}
