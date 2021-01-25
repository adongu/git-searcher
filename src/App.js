import './App.css';
import React, { Component } from 'react';
import Search from './Search/Search';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      repos: [],
    };
  }

  componentDidMount() {
    this.fetchSavedRepos();
  }

  fetchSavedRepos = () => {
    // @TODO create util file for ajax calls
    fetch(`http://localhost:8080/repo/`)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          // @TODO notifications for error
          console.log({ error: data.error });
        } else {
          this.setState({ repos: data.repos });
        }
      })
      .catch((err) => {
        // @TODO notifications for error
        console.log({ err });
      });
  };

  saveRepo = (repo) => {
    // @TODO create util file for ajax calls
    // eslint-disable-next-line camelcase
    const { id, full_name, stargazers_count, language, url, created_at } = repo;
    const data = JSON.stringify({
      id: String(id),
      fullName: full_name,
      createdAt: created_at,
      stargazersCount: stargazers_count,
      language,
      url,
    });

    fetch('http://localhost:8080/repo/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data,
    })
      .then((res) => {
        return res.json();
      })
      .then(() => {
        alert('Successfully Saved Repository');
        this.fetchSavedRepos();
      })
      .catch((err) => {
        // @TODO notifications for error
        console.log({ err });
      });
  };

  deleteRepo = (e) => {
    fetch(`http://localhost:8080/repo/${e.target.id}`, {
      method: 'DELETE',
    })
      .then((res) => {
        return res;
      })
      .then(() => {
        alert('Successfully Deleted Repository');
        this.fetchSavedRepos();
      })
      .catch((err) => {
        // @TODO notifications for error
        console.log({ err });
      });
  };

  render() {
    const { repos } = this.state;
    return (
      <div className="App">
        <Search saveRepo={this.saveRepo} />

        <section>
          Saved repos
          {repos.map((repo) => {
            return (
              <div key={repo.fullName}>
                {repo.fullName}
                <button
                  id={repo.id}
                  type="button"
                  onClick={this.deleteRepo}
                  tooltip="Delete repository"
                >
                  Delete
                </button>
              </div>
            );
          })}
        </section>
      </div>
    );
  }
}
