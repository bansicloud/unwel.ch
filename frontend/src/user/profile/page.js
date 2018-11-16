import React, { Component, Fragment } from 'react'
import styled from 'styled-components'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { compose, always } from 'ramda'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import SettingsIcon from 'react-feather/dist/icons/settings'
import DefaultContainer from 'components/default-container'
import Distribute from 'components/distribute'
import Spread from 'components/spread'
import Text from 'components/text'
import Avatar from 'components/avatar'
import Placeholder from 'components/placeholder'
import Spacer from 'components/spacer'
import Button from 'components/button'
import { colors } from 'components/variables'

import { BasicStats, WonLostPie, WonLostBar } from './stats'

import { trackEvent, events } from '../../tracking'
import { goToPage } from './../../navigation/actions'

export const QUERY = gql`
  query($userId: String!) {
    currentUser {
      id
      name
      isAnonymous
      avatar
    }
    user(id: $userId) {
      id
      name
      avatar
      stats {
        betsAccepted
        betsCreated
        betsDisputed
        betsWon
        betsLost
      }
      statsAgainstYou {
        betsAccepted
        betsCreated
        betsDisputed
        betsWon
        betsLost
      }
    }
  }
`
const Root = styled(DefaultContainer)``

const SaveAccountWrapper = styled.div``

const Split = styled.div`
  background: ${colors.grey3};
  height: 1px;
  margin: 16px 0;
`

class Profile extends Component {
  constructor (props) {
    super(props)

    this.state = { selectedTab: 'bets' }

    this.handleSettingsIconClick = this.handleSettingsIconClick.bind(this)
    this.saveAccountHandler = this.saveAccountHandler.bind(this)
  }

  componentDidMount () {
    trackEvent(events.pageLoaded, { page: 'profile' })
  }

  handleSettingsIconClick () {
    this.props.goToPage('/settings')
  }

  saveAccountHandler () {
    this.props.goToPage('/save-account')
  }

  render () {
    const { user, currentUser, loading } = this.props.data

    if (loading || !user) {
      return (
        <Root>
          <Placeholder fullWidth />
        </Root>
      )
    }

    const isCurrentUser = currentUser.id === user.id
    const isAnonymous = currentUser.isAnonymous

    return (
      <Root>
        <Spacer top={3} bottom={3}>
          <Spread align='center'>
            <Distribute space={2} align='center'>
              <Avatar size={7} user={user} />
              <Text size='size3' fontWeight='bold'>
                {user.name}
                {"'"}s profile
              </Text>
            </Distribute>
            {isCurrentUser && (
              <SettingsIcon onClick={this.handleSettingsIconClick} />
            )}
          </Spread>
        </Spacer>

        <Split />

        {isCurrentUser &&
          isAnonymous && (
          <SaveAccountWrapper>
            <Text size='size1'>
                You are using a temporal account on this device. Create an
                account to access unwelch from anywhere.
            </Text>
            <Spacer top={1} />
            <Button type='level2' fullWidth onClick={this.saveAccountHandler}>
                Create account
            </Button>
          </SaveAccountWrapper>
        )}

        <Split />

        <BasicStats stats={user.stats} />

        <Split />

        <WonLostPie stats={user.stats} />

        {!isCurrentUser && (
          <Fragment>
            <Split />
            <div>
              <Text size='size3' fontWeight='regular'>
                You vs {user.name}
              </Text>
              <Spacer top={2}>
                <WonLostBar stats={user.statsAgainstYou} />
              </Spacer>
            </div>
          </Fragment>
        )}
      </Root>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      goToPage
    },
    dispatch
  )
}

export default compose(
  connect(
    always({}),
    mapDispatchToProps
  ),
  graphql(QUERY)
)(Profile)
