const fs = require('fs').promises;

init();

async function init() {
  await createFiles();
  //console.log(await getCitiesCount('MG'));
  await topFiveStatesWithMoreCities();
  await topFiveStatesWithLessCities();
  await compareCitiesNameSizeByState();
}

async function createFiles() {
  //ler arquivo estados.json
  let data = await fs.readFile('./files/Estados.json');
  const states = JSON.parse(data);

  //ler arquivo cidades.json
  data = await fs.readFile('./files/Cidades.json');
  const cities = JSON.parse(data);

  //para cada stado do arquivo Estados.json cria um arquivo json com as cidades do arquivo Cidades.json
  for (state of states) {
    const stateCities = cities.filter((city) => city.Estado === state.ID); //filte para retornar todas as cidades que estão iterando

    await fs.writeFile(
      `./states/${state.Sigla}.json`,
      JSON.stringify(stateCities)
    );
  }
}

//Criar um método que recebe como parâmetro o UF do estado, realize a leitura do arquivo JSON correspondente e retorne a quantidade de cidades daquele estado.

async function getCitiesCount(uf) {
  //leitura do arquivo
  const data = await fs.readFile(`./states/${uf}.json`);

  const cities = JSON.parse(data);

  return cities.length;
}

//Criar um método que imprima no console um array com o UF dos cinco estados que mais possuem cidades, seguidos da quantidade, em ordem decrescente.

async function topFiveStatesWithMoreCities() {
  const states = JSON.parse(await fs.readFile('./files/Estados.json'));

  const list = [];

  for (state of states) {
    const count = await getCitiesCount(state.Sigla);
    list.push({ uf: state.Sigla, count });
  }

  list.sort((a, b) => {
    if (a.count < b.count) return 1;
    else if (a.count > b.count) return -1;
    else return 0;
  });

  const result = [];

  list
    .slice(0, 5)
    .forEach((item) => result.push(' ' + item.uf + ' - ' + item.count));

  console.log('Cinco Estados com maior quantidade de cidades:' + result + ' ');
}

//Criar um método que imprima no console um array com o UF dos cinco estados que menos possuem cidades, seguidos da quantidade, em ordem decrescente.

async function topFiveStatesWithLessCities() {
  const states = JSON.parse(await fs.readFile('./files/Estados.json'));

  const list = [];

  for (state of states) {
    const count = await getCitiesCount(state.Sigla);
    list.push({ uf: state.Sigla, count });
  }

  list.sort((b, a) => {
    if (a.count < b.count) return 1;
    else if (a.count > b.count) return -1;
    else return 0;
  });

  const result = [];

  list
    .slice(0, 5)
    .forEach((item) => result.push(' ' + item.uf + ' - ' + item.count));

  console.log('Cinco Estados com menor quantidade de cidades:' + result);
}

//Criar um método que imprima no console um array com a cidade de maior nome de cada estado, seguida de seu UF. Em caso de empate, considerar a ordem alfabética para ordená-los e então retornar o primeiro.
//Criar um método que imprima no console um array com a cidade de menor nome de cada estado, seguida de seu UF. Em caso de empate, considerar a ordem alfabética para ordená-los e então retorne o primeiro.
//Criar um método que imprima no console a cidade de maior nome entre todos os estados, seguido do seu UF. Em caso de empate, considerar a ordem alfabética para ordená-los e então retornar o primeiro.
//Criar um método que imprima no console a cidade de menor nome entre todos os estados, seguido do seu UF. Em caso de empate, considerar a ordem alfabética para ordená-los e então retornar o primeiro.

//método para localizar didades com maiores nomes
async function citiesBiggestName(uf) {
  const cities = JSON.parse(await fs.readFile(`./states/${uf}.json`));

  let result;

  cities.forEach((city) => {
    if (!result) result = city;
    else if (city.Nome.length > result.Nome.length) result = city;
    else if (
      city.Nome.length === result.Nome.length &&
      city.Nome.toLowerCase() < result.Nome.toLowerCase()
    )
      result = city;
  });

  return result;
}

//método para localizar didades com menores nomes
async function citiesSmallestName(uf) {
  const cities = JSON.parse(await fs.readFile(`./states/${uf}.json`));

  let result;

  cities.forEach((city) => {
    if (!result) result = city;
    else if (city.Nome.length < result.Nome.length) result = city;
    else if (
      city.Nome.length === result.Nome.length &&
      city.Nome.toLowerCase() > result.Nome.toLowerCase()
    )
      result = city;
  });

  return result;
}

async function compareCitiesNameSizeByState() {
  const states = JSON.parse(await fs.readFile('./files/Estados.json'));
  const resultCitiesBiggestName = [];
  const resultCitiesSmallestName = [];

  for (state of states) {
    const biggestName = await citiesBiggestName(state.Sigla);
    resultCitiesBiggestName.push(' ' + biggestName.Nome + ' - ' + state.Sigla);

    const smallestName = await citiesSmallestName(state.Sigla);
    resultCitiesSmallestName.push(
      ' ' + smallestName.Nome + ' - ' + state.Sigla
    );
  }

  console.log('Cidades com maiores nomes:' + resultCitiesBiggestName);
  console.log('Cidades com menores nomes:' + resultCitiesSmallestName);

  let cityBiggestName;

  resultCitiesBiggestName.forEach((city) => {
    if (!cityBiggestName) cityBiggestName = city;
    else if (city.length > cityBiggestName.length) cityBiggestName = city;
    else if (
      city.length === cityBiggestName.length &&
      city.toLowerCase() < cityBiggestName.toLowerCase()
    )
      cityBiggestName = city;
  });

  let citySmallestName;

  resultCitiesSmallestName.forEach((city) => {
    if (!citySmallestName) citySmallestName = city;
    else if (city.length < citySmallestName.length) citySmallestName = city;
    else if (
      city.length === citySmallestName.length &&
      city.toLowerCase() < citySmallestName.toLowerCase()
    )
      citySmallestName = city;
  });

  console.log('Cidade com maior Nome: ' + cityBiggestName);
  console.log('Cidade com menor Nome: ' + citySmallestName);

  // const citieBiggestName = resultCitiesBiggestName.slice(0, 1);
  // console.log('Cidade com maior Nome' + citieBiggestName);

  // const citieSmallestName = resultCitiesSmallestName.slice(0, 1);
  // console.log('Cidade com maior Nome' + citieSmallestName);
}
