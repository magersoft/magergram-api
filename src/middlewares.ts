export const isAuthenticated = (request): void => {
  if (!request.user) {
    throw Error('You need to log in to perform this action');
  }
  return;
};
