export enum UserType {
  USER = 1,
  EMPLOYER = 2,
  ADMIN = 3,
}

export enum GenderType {
  Male = 1,
  Female = 2,
  Both = 3,
  PreferNotToSay = 4,
}

export const getGenderLabel = (gender?: number) => {
  switch (gender) {
    case 1:
      return "Male";
    case 2:
      return "Female";
    case 3:
      return "Prefer not to say";
    default:
      return "N/A";
  }
};