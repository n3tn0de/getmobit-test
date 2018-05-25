import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom'

import * as actions from '../../actions/devices';

import DevicesTable from '../../components/DevicesTable/DevicesTable'

import styles from './DevicesList.scss'

class DevicesList extends Component {
  constructor(props) {
    super(props)

    const search = new URLSearchParams(document.location.search).get('search')
    this.state ={
      search: search || '',
    }
  }

  componentDidMount() {
    document.title = 'Device List'
    this.props.actions.devices.paginate(
      this.props.match.params.page,
      null,
      this.state.search
    )
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.search !== this.state.search ||
      prevProps.match.params.page !== this.props.match.params.page
    ) {
      this.props.actions.devices.paginate(
        this.props.match.params.page,
        null,
        this.state.search
      )
    }
  }

  updateSearch = (event) => {
    this.setState({
      ...this.state,
      search: event.target.value,
    }, () => {
      this.props.actions.devices.paginate(
        1,
        null,
        this.state.search
      )
    })
  }

  handleSubmit = event => {
    event.preventDefault();
  }

  render() {
    return(
      <div className={styles.main}>
        <form onSubmit={this.handleSubmit}>
          <input
            className={styles.search}
            type="text"
            name="search"
            placeholder="Search"
            autoFocus
            value={this.state.search}
            onChange={this.updateSearch}
          />
        </form>
        <div className={styles.pagination}>
          { this.props.match.params.page > 1 &&
              <Link
                className={styles.link}
                to={`/${this.props.match.params.page - 1}?search=${this.state.search}`}
              >
                Prev page
              </Link>
          }
          { (this.props.match.params.page || 1) < this.props.devices.pagesTotal &&
              <Link
                className={styles.link}
                to={`/${+(this.props.match.params.page || 1) + 1}?search=${this.state.search}`}
              >
                Next page
              </Link>
          }
        </div>
        { this.props.devices.error ?
            this.props.devices.error.message === '404' ?
              <p>No devices found ¯\_(⊙_ʖ⊙)_/¯</p> :
              <p>
                Unable to get devices ┻━┻ ヘ╰( •̀ε•́ ╰)
                ({this.props.devices.error.message})
              </p> :
            <DevicesTable devices={this.props.devices.devices} />
        }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  devices: state.devices,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    devices: bindActionCreators(actions, dispatch),
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(DevicesList);
