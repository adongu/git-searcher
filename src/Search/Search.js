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

  escapeRegexCharacters = (str) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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

  onSuggestionsFetchRequested = ({ value }) => {
    debounce(
      fetch(`https://api.github.com/repos/${value}`)
        .then((response) => response.json())
        .then((data) => this.setState({ suggestions: data.results })),
      300
    );
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: "Type 'c'",
      value,
      onChange: this.onChange,
    };

    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        inputProps={inputProps}
      />
    );
  }
}
