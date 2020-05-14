export const login = (user) => {
  const response = {
    token: user.token,
    data: {
      personelNumber: user.personelNumber,
      firstName: user.firstName,
      lastName: user.lastName
    }
  };
  return response;
};

export const logout = () => {
  return new Promise(resolve => setTimeout(resolve, 100));
};