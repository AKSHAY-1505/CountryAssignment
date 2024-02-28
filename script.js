let allCountriesList = [];

let dataFetched = false;

const countryList = document.getElementById("countryList");

class Country {
  constructor(png, regex, official, capital, languages) {
    this.png = png;
    this.regex = regex;
    this.official = official;
    this.capital = capital;
    this.languages = languages;
  }
}

// backend - get everything
async function getResponse() {
  const response = await fetch(
    "https://restcountries.com/v3.1/all?fields=name,flags,capital,languages,postalCode",
    {
      method: "GET",
    }
  );

  const data = await response.json(); // Extracting data as a JSON Object from the response

  for (let {
    flags: { png },
    postalCode: { regex },
    name: { official },
    capital,
    languages,
  } of data) {
    let newCountry = new Country(png, regex, official, capital, languages);

    allCountriesList.push(newCountry);
  }

  dataFetched = true;
}

async function searchWithPostalCode(postalCode) {
  !dataFetched ? await getResponse() : null;

  const filteredCountries = allCountriesList.filter((country) =>
    country.regex !== undefined ? postalCode.match(country.regex) : false
  );

  return filteredCountries;
}

function createCountryContainer(png, official, capital, languages) {
  const countryToBeAdded = document.createElement("div");
  countryToBeAdded.classList.add("country-item");

  countryToBeAdded.innerHTML = `
            
            <img class="countryimg" src=${png} alt="" />
            <div class="details">
            <h1 id="countryName">${official}</h1>
            <h3>Capital: ${capital}</h3>
            </div>
            <h3> Language : ${languages[Object.keys(languages)[0]]} </h3>
      `;

  return countryToBeAdded;
}

async function addCountries(postalCode) {
  const filteredCountries = await searchWithPostalCode(postalCode);

  for (let { png, official, capital, languages } of filteredCountries) {
    const countryToBeAdded = createCountryContainer(
      png,
      official,
      capital,
      languages
    );
    countryList.append(countryToBeAdded);
  }
}

//======================================

function displayWarning() {
  const warningContainer = document.getElementById("warningContainer");

  const warning = document.createElement("div");
  warning.innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>Error!</strong> Postal Code cannot be empty.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
        `;

  warningContainer.append(warning);
}

document.forms["searchCountryForm"].addEventListener("submit", (e) => {
  e.preventDefault();

  let postalCode = document.getElementById("postalCode").value;

  postalCode === "" ? displayWarning() : addCountries(postalCode);

  document.querySelector("#postalCode").value = "";
});
