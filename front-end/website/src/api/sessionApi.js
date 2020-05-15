export const login = (user) => {
  const response = {
    data: {
      personelNumber: user.personelNumber,
      isAdmin: user.isAdmin,
      firstName: user.firstName,
      lastName: user.lastName
    }
  };
  return response;
};

export const logout = () => {
  return new Promise(resolve => setTimeout(resolve, 10));
};