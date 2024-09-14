import React, { useState, useEffect } from 'react';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [searchClicked, setSearchClicked] = useState(false); // New state to track search button clicks

  // Fetch country data from the local JSON file
  useEffect(() => {
    fetch('/countries.json') // Ensure this path is correct for the local server
      .then((response) => response.json())
      .then((data) => setCountries(data));
  }, []);

  // Filter countries based on user query
  useEffect(() => {
    if (query === '') {
      setFilteredCountries([]);
    } else {
      const results = countries.filter((country) =>
        country.country.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCountries(results);
    }
  }, [query, countries]);

  // Handle user input change
  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setSelectedCountry(null); // Clear selected country when typing a new query
    setSearchClicked(false); // Reset searchClicked when user types
  };

  // Handle search button click
  const handleSearchClick = () => {
    if (filteredCountries.length > 0) {
      setSelectedCountry(filteredCountries[0]); // Select the first filtered country
      setSearchClicked(true); // Set searchClicked to true
      setQuery(''); // Clear search query after selection
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (country) => {
    setSelectedCountry(country);
    setQuery(country.country); // Update the search bar with the selected country name
    setFilteredCountries([]); // Clear suggestions
    setSearchClicked(false); // Reset searchClicked since selection was made
  };

  // Render selected country details based on searchClicked
  const displayCountryDetails = () => {
    if (!selectedCountry || !searchClicked) return null; // Only show details if search button was clicked

    const { country, capital, population, official_language, currency } = selectedCountry;

    return (
      <div className="country-details">
        <h2>{country}</h2>
        <p><strong>Capital:</strong> {capital}</p>
        <p><strong>Population:</strong> {population.toLocaleString()}</p>
        <p><strong>Official Language(s):</strong> {Array.isArray(official_language) ? official_language.join(', ') : official_language}</p>
        <p><strong>Currency:</strong> {currency}</p>
      </div>
    );
  };

  return (
    <div className="search-bar-container">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search for a country..."
        className="search-input"
      />
      <button onClick={handleSearchClick} className="search-button">Search</button>
      {query && filteredCountries.length > 0 && (
        <ul className="autocomplete-list">
          {filteredCountries.map((country, index) => (
            <li key={index} onClick={() => handleSuggestionClick(country)}>
              {country.country}
            </li>
          ))}
        </ul>
      )}

      {/* Display country details after clicking the search button */}
      {displayCountryDetails()}
    </div>
  );
};

export default SearchBar;
