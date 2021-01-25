import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
            // @TODO notifications for error
            console.log({ error: data.error });
          } else {
            this.setState({ suggestions: data.items });
          }
        })
        .catch((err) => {
          // @TODO notifications for error
          console.log({ err });
        });
    }
  }, 300);

  renderSuggestion = (suggestion, { query }) => {
    const matches = match(suggestion.full_name, query);
    const parts = parse(suggestion.full_name, matches);

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
        <span> {suggestion.description}</span>
        <span>🌟 {suggestion.stargazers_count} Stars</span>
        <span> | Language: {suggestion.language}</span>
      </span>
    );
  };

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue,
    });
  };

  getSuggestionValue = (suggestion) => {
    const { saveRepo } = this.props;
    saveRepo(suggestion);
    return '';
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: 'Type A github repo name, click suggestion to save it',
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

Search.propTypes = {
  saveRepo: PropTypes.func.isRequired,
};
