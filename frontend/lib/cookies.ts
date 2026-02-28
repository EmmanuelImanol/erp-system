export const setCookie = (name: string, value: string, days: number) => {
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}`;
};

export const removeCookie = (name: string) => {
  document.cookie = `${name}=; path=/; max-age=0`;
};