export function generateCorePassword(): string {
  // Generate the password string
  const pwLength = 4;
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let password = "";
  for (let i = 0; i < pwLength; i++) {
    const rnd = Math.floor(Math.random() * letters.length);
    password += letters[rnd];
  }

  // Define metadata of the password string
  return password;
}
