import React, { Component } from 'react';
import './styles.css';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import debounce from 'lodash.debounce';

export default class Search extends Component {
  constructor() {
    super();

    this.state = {
      value: '',
      suggestions: [],
    };
  }

  onSuggestionsFetchRequested = debounce(({ value }) => {
    if (value.length) {
      fetch(`https://api.github.com/search/repositories?q=${value}&per_page=10`)
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            console.log({ error: data.error });
          } else {
            this.setState({ suggestions: data.items });
          }
        })
        .catch((err) => {
          console.log({ err });
        });
    }
  }, 300);

  escapeRegexCharacters = (str) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  renderSuggestion = (suggestion, { query }) => {
    const matches = match(suggestion.name, query);
    const parts = parse(suggestion.name, matches);

    return (
      <span>
        {parts.map((part) => {
          const className = part.highlight
            ? 'react-autosuggest__suggestion-match'
            : null;

          return (
            <span className={className} key={`${Math.random()}-${part.text}`}>
              {part.text}
            </span>
          );
        })}
      </span>
    );
  };

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue,
    });
  };

  getSuggestions = (value) => {
    const escapedValue = this.escapeRegexCharacters(value.trim());

    if (escapedValue === '') {
      return [];
    }

    const regex = new RegExp(`^${escapedValue}`, 'i');

    // @TODO github name
    return [].filter((repo) => regex.test(repo.name));
  };

  getSuggestionValue = (suggestion) => {
    return suggestion.name;
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: 'Type A github repo name',
      value,
      onChange: this.onChange,
    };

    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={debounce(this.onSuggestionsFetchRequested)}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        inputProps={inputProps}
      />
    );
  }
}
