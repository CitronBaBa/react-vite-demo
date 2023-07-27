import { useLazyQuery, useQuery } from '@apollo/client';
import { useState } from 'react';
import Select from 'react-select';
import { GET_ALL_COUNTRIES, GET_COUNTRY_EMOJI } from './graphql/queries';

const App = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [countryEmoji, setCountryEmoji] = useState('');
  const [error, setError] = useState('');
  const [cache, setCache] = useState({});

  const [getCountryEmoji, { loading }] = useLazyQuery(GET_COUNTRY_EMOJI, {
    onCompleted: (data) => {
      const { emoji } = data.country;
      setCountryEmoji(emoji);
      updateCache(selectedOption.value, emoji);
    },
    onError: () => {
      setError('Invalid country code');
      setCountryEmoji('');
    },
  });

  const { data: allCountriesData } = useQuery(GET_ALL_COUNTRIES);

  const updateCache = (code, emoji) => {
    setCache((prevCache) => ({ ...prevCache, [code]: emoji }));
  };

  const handleInputChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    setCountryEmoji('');
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedOption) {
      const code = selectedOption.value.toUpperCase();
      if (cache[code]) {
        setCountryEmoji(cache[code]);
      } else {
        fetchCountryEmoji(code);
      }
    }
  };

  const fetchCountryEmoji = async (code) => {
    setError('');
    try {
      const response = await getCountryEmoji({ variables: { code } });
      const { emoji } = response.data.country;
      setCountryEmoji(emoji);
      updateCache(code, emoji);
    } catch (error) {
      setError('Invalid country code');
      setCountryEmoji('');
    }
  };

  const options =
    allCountriesData && allCountriesData.countries
      ? allCountriesData.countries.map((country) => ({
          value: country.code,
          label: `${country.name} (${country.code})`,
        }))
      : [];

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Country Code:
          <Select
            value={selectedOption}
            onChange={handleInputChange}
            options={options}
          />
        </label>
        <button type="submit">Get Emoji</button>
      </form>
      {loading && <p>Loading...</p>}
      {countryEmoji && <p>Country Emoji: {countryEmoji}</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default App;
