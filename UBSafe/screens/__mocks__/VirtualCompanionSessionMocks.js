const users = {
  1: {
    Age: 22,
    Gender: "Female",
    Preferences: {
      AgeMax: 80,
      AgeMax: 0,
      FemaleCompanionsOkay: true,
      MaleCompanionsOkay: true,
      OtherCompanionsOkay: true,
      Proximity: 100
    },
    UserID: 1,
    UserName: "Liberal Female"
  },
  2: {
    Age: 22,
    Gender: "Male",
    Preferences: {
      AgeMax: 80,
      AgeMax: 0,
      FemaleCompanionsOkay: false,
      MaleCompanionsOkay: true,
      OtherCompanionsOkay: false,
      Proximity: 100
    },
    UserID: 1,
    UserName: "Conservative Male"
  },
  3: {
    Age: 22,
    Gender: "Male",
    Preferences: {
      AgeMax: 80,
      AgeMax: 0,
      FemaleCompanionsOkay: false,
      MaleCompanionsOkay: true,
      OtherCompanionsOkay: true,
      Proximity: 100
    },
    UserID: 1,
    UserName: "Love Shy Male"
  },
  4: {
    Age: 22,
    Gender: "Other",
    Preferences: {
      AgeMax: 80,
      AgeMax: 0,
      FemaleCompanionsOkay: false,
      MaleCompanionsOkay: false,
      OtherCompanionsOkay: false,
      Proximity: 100
    },
    UserID: 1,
    UserName: "Why even use the app?"
  },
  5: {
    Age: 22,
    Gender: "Other",
    Preferences: {
      AgeMax: 22,
      AgeMax: 22,
      FemaleCompanionsOkay: false,
      MaleCompanionsOkay: true,
      OtherCompanionsOkay: false,
      Proximity: 100
    },
    UserID: 1,
    UserName: "Female seeking strange dong"
  }
};

const mock_suggestions = {
  1: [
    users[2], users[3], users[4], users[5]
  ],
  2: [
    users[3]
  ],
  3: [
    users[2], users[4], users[5]
  ],
  4: []
}

export const getCompanions =  function getCompanions(userID) {
  return new Promise((resolve, reject) => {
    process.nextTick(
      () => 
      users[userID] ? resolve(mock_suggestions[userID])
        : reject({
            error: 'Could not find companions',
          }),
    );
  });
}

export const savePreferences = function savePreferences(userID) {
  return new Promise((resolve, reject) => {
    process.nextTick(
      () => 
      users[userID] ? resolve('200')
        : reject({
            error: 'Could not find user',
          }),
    );
  });
}

export const onSelectionsChange = function onSelectionsChange(){

}