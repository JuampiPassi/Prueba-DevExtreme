let s = 123456789;
const random = function() {
  s = (1103515245 * s + 12345) % 2147483647;
  return s % (10 - 1);
};

export const generateData = function(count) {
  let i;
  const surnames = ['Smith', 'Johnson', 'Brown', 'Taylor', 'Anderson', 'Harris', 'Clark', 'Allen', 'Scott', 'Carter'];
  const names = ['James', 'John', 'Robert', 'Christopher', 'George', 'Mary', 'Nancy', 'Sandra', 'Michelle', 'Betty','Brad','Michael','Bob','Adam','Paul','Sasha','Jonas','Donald','Chris','Leon','Camila'];
  const gender = ['Male', 'Female'];
  const items = [];
  const startBirthDate = Date.parse('1/1/1975');
  const endBirthDate = Date.parse('1/1/1992');

  for (i = 0; i < count; i += 1) {
    const birthDate = new Date(startBirthDate + Math.floor(
      (random() * (endBirthDate - startBirthDate)) / 10,
    ));
    birthDate.setHours(12);

    const nameIndex = random();
    
    const item = {
      id: i + 1,
      firstName: names[Math.floor(Math.random() * (20 - 10 + 1)) + 10],
      lastName: surnames[random()],
      gender: gender[Math.floor(nameIndex / 5)],
      birthDate,
      salary: Math.floor(Math.random() * (1500 - 1000 + 1)) + 1000,
    };
    items.push(item);
  }
  return items;
};
