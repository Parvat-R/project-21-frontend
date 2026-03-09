const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// ADMIN ENDPOINTS

export const adminEndpoints = {
  GET_ALL_ADMINS: BASE_URL + "/api/admin",
}

// AUTH ENDPOINTS
export const endpoints = {
  SIGNIN_API: BASE_URL + "/api/auth/signin",
  SIGNUP_API: BASE_URL + "/api/auth/signup",
};



// EVENT ENDPOINTS
export const eventEndpoints = {
  GET_ALL_EVENTS: BASE_URL + "/api/event",
  CREATE_EVENT: BASE_URL + "/api/event",
  GET_EVENT_BY_ID: (id: string) => `${BASE_URL}/api/event/${id}`,
  UPDATE_EVENT_BY_ID: (id: string) => `${BASE_URL}/api/event/${id}`,
  DELETE_EVENT_BY_ID: (id: string) => `${BASE_URL}/api/event/${id}`,
};


// Event Mod Endpoints
export const eventModEndpoints = {
  GET_ALL_EVENT_MODS: BASE_URL + "/api/event-mod",
  CREATE_EVENT_MOD: BASE_URL + "/api/event-mod",
  UPDATE_EVENT_MOD_BY_ID: (id: string) => `${BASE_URL}/api/event-mod/${id}`,
}


// FEEDBACK ENDPOINTS
export const feedbackEndpoints = {
  CREATE_FEEDBACK: BASE_URL + "/api/feedback",
  GET_FEEDBACKS_BY_USER_ID: (userId: string) => `${BASE_URL}/api/feedback/user/${userId}`,
  GET_FEEDBACKS_BY_EVENT_ID: (eventId: string) => `${BASE_URL}/api/feedback/event/${eventId}`,
}


// Registration Endpoints


// User Endpoints
export const userEndpoints = {
  GET_ALL_USERS: BASE_URL + "/api/user",
  CREATE_USER: BASE_URL + "/api/user",
  GET_USER_BY_ID: (id: string) => `${BASE_URL}/api/user/${id}`,
}