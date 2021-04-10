const authRoles = {
  sa: "ADMIN",
  nurse: "NURSE",
  mother: "MOTHER",
  coder: "REVIEWER",
  assistant: "ASSISTANT",
};

const getUserRole = (type, staffType) => {
  if (type === "MOTHER") {
    return "MOTHER";
  } else {
    return staffType;
  }
};

export default authRoles;
export { getUserRole };
