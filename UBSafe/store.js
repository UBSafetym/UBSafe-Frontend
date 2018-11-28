const store = {
  api_base: "https://polar-escarpment-56098.herokuapp.com/",
  alertsToCodes: {
    TERMINATED: 0,
    REACHED_DESTINATION: 1,
    MOVING_AWAY: 2,
    ALARM_TRIGGERED: 3,
    STAGNANT: 4,
    CONNECTION_LOST: 5,
    ALERT_NEARBY_USERS: 6,
    INVITED_TO_SESSION: 7,
    JOINED_SESSION: 8,
    NEAR_DESTINATION: 9
  },
  codesToAlerts: {
    0: 'TERMINATED',
    1: 'REACHED_DESTINATION',
    2: 'MOVING_AWAY',
    3: 'ALARM_TRIGGERED',
    4: 'STAGNANT',
    5: 'CONNECTION_LOST',
    6: 'ALERT_NEARBY_USERS',
    7: 'INVITED_TO_SESSION',
    8: 'JOINED_SESSION',
    9: 'NEAR_DESTINATION'
  },
  emergencyNumbers: {
    EMERGENCY: '7783200245',
    CAMPUS_SECURITY: '7783200245'
  }
};
export default store;