import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { compose } from 'ramda'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import DefaultContainer from 'components/default-container'
import BetInput from 'components/bet-input'
import Spacer from 'components/spacer'

import { saveTempBet } from '../services'
import { showAnnounce } from './../../announce/actions'
import { ADD_BET_MUTATION } from './../mutations'
import * as queries from './../bet-list/queries'
import { trackEvent, events } from '../../tracking'
import withNavigate from '../../navigation/withNavigate'
import withIsLoggedIn from '../../user/auth/withIsLoggedIn'

class NewBet extends Component {
  constructor () {
    super()
    this.handleBetConfirm = this.handleBetConfirm.bind(this)
  }

  componentDidMount () {
    trackEvent(events.pageLoaded, { page: 'newBet' })
  }

  async handleBetConfirm (bet) {
    if (!this.props.isLoggedIn) {
      saveTempBet(bet)
      await this.props.goToPage(`/anonymous-login`)
      return
    }

    this.props.showAnnounce('New bet created')
    const result = await this.props.addBet(bet)
    await this.props.goToPage(`/bet/${result.data.addBet.id}`)
  }

  render () {
    return (
      <DefaultContainer>
        <Spacer top={6}>
          <BetInput
            starter='I bet'
            middle='that'
            onConfirm={this.handleBetConfirm}
          />
        </Spacer>
      </DefaultContainer>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      showAnnounce
    },
    dispatch
  )
}

export default compose(
  graphql(ADD_BET_MUTATION, {
    props: ({ mutate }) => ({
      addBet: ({ statement, quantity }) =>
        mutate({ variables: { statement, quantity } })
    }),
    options: () => ({
      refetchQueries: [
        {
          query: queries.BET_LIST
        }
      ]
    })
  }),
  connect(
    null,
    mapDispatchToProps
  ),
  withNavigate,
  withIsLoggedIn
)(NewBet)
