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

export default function request(url) {
  return new Promise((resolve, reject) => {
    const userID = parseInt(url.substr('/users/'.length), 10);
    process.nextTick(
      () =>
        users[userID]
          ? resolve(users[userID])
          : reject({
              error: 'User with ' + userID + ' not found.',
            }),
    );
  });
}