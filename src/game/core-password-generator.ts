export interface CorePasswordMetadata {
  password: string;
  length: number;
  sum: number;
  vowelCount: number;
  hasDuplicateChars: boolean;
}

export function generateCorePassword(): CorePasswordMetadata {
  // Generate the password string
  const password = "ABCD"; // to randomise later

  // Define metadata of the password string
  return {
    password,
    length: password.length,
    sum: getPasswordSum(password),
    vowelCount: getVowelCount(password),
    hasDuplicateChars: hasDuplicateChars(password),
  };
}

function getPasswordSum(password: string) {
  return password
    .split("")
    .reduce((sum, char) => sum + (char.charCodeAt(0) - 64), 0);
}

function getVowelCount(password: string) {
  const vowels = ["A", "E", "I", "O", "U"];

  let count = 0;
  password.split("").forEach((char) => {
    if (vowels.includes(char)) count++;
  });

  return count;
}

function hasDuplicateChars(password: string) {
  const charSet = new Set<string>();

  let hasDupes = false;
  password.split("").forEach((char) => {
    if (charSet.has(char)) hasDupes = true;
    charSet.add(char);
  });

  return hasDupes;
}
