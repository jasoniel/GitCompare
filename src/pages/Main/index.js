import React from 'react';
import moment from 'moment';
import { Container, Form } from './styles';
import logo from '../../assets/logo.png';
import api from '../../services/api';
import CompareList from '../../components/CompareList';

export default class Main extends React.Component {
  state = {
    repositories: [],
    repositoryInput: '',
    repositoryError: false,
    loading: false,
  };

  handleAddRepository = async (e) => {
    e.preventDefault();

    const { repositories, repositoryInput } = this.state;

    this.setState({ loading: true });
    try {
      const { data: respository } = await api.get(`/repos/${repositoryInput}`);
      respository.lastCommit = moment(respository.pushed_at).fromNow();

      this.setState({
        repositoryInput: '',
        repositories: [...repositories, respository],
        repositoryError: false,
      });
    } catch (err) {
      this.setState({ repositoryError: true });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const {
      repositories, repositoryError, repositoryInput, loading,
    } = this.state;
    return (
      <Container>
        <img src={logo} alt="Github Compare" />

        <Form hasError={repositoryError} onSubmit={this.handleAddRepository}>
          <input
            type="text"
            placeholder="usuário/repositório"
            value={repositoryInput}
            onChange={e => this.setState({ repositoryInput: e.target.value })}
          />
          <button type="submit">{loading ? <i className="fa fa-spinner fa-pulse" /> : 'OK'}</button>
        </Form>

        <CompareList repositories={repositories} />
      </Container>
    );
  }
}
