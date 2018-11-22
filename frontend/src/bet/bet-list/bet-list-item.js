import React, { Component } from 'react'

import styled from 'styled-components'

import timeAgo from '../../utils/time-ago'

import Distribute from 'components/distribute'
import Avatar from 'components/avatar'
import Spacer from 'components/spacer'
import Text from 'components/text'
import Placeholder from 'components/placeholder'
import { colors } from 'components/variables'
import { getIntroText } from '../phrase-generator'
import { getBetStatus, betStatuses } from 'shared/bet/status'

export const getStatusText = betStatus => {
  switch (betStatus) {
    case betStatuses.WAITING_FOR_OPONENT:
      return (
        <Text size='size0' dimmed shortLineHeight>
          Waiting for an opponent
        </Text>
      )
    case betStatuses.AVAILABLE_BET:
      return (
        <Text size='size0' dimmed shortLineHeight>
          Available
        </Text>
      )
    case betStatuses.WAITING_FOR_USER_RESPONSE:
      return (
        <Text size='size0' dimmed shortLineHeight>
          Waiting for result
        </Text>
      )
    case betStatuses.WAITING_FOR_OPONENT_RESPONSE:
      return (
        <Text size='size0' dimmed shortLineHeight>
          Waiting for opponent result
        </Text>
      )
    case betStatuses.LOST:
      return (
        <Text
          size='size0'
          color={colors.body}
          fontWeight='black'
          shortLineHeight
        >
          Lost
        </Text>
      )
    case betStatuses.WON:
      return (
        <Text
          size='size0'
          color={colors.primary}
          fontWeight='black'
          shortLineHeight
        >
          Won
        </Text>
      )
    case betStatuses.DISPUTED:
      return (
        <Text
          size='size0'
          color={colors.error}
          fontWeight='black'
          shortLineHeight
        >
          Dispute
        </Text>
      )
  }

  console.error('Unkown bet state')
}

const Root = styled.div`
  padding: 24px 0;
  border-bottom: 1px solid ${colors.grey3};
  overflow: hidden;
`

const Main = styled.div`
  display: flex;
`

const Footer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
`

const BetText = styled.div`
  flex: 1;
`

const FooterElementWrapper = styled.div`
  flex: 0 1 auto;
`

class BetListItem extends Component {
  renderPlaceholder () {
    return (
      <Spacer bottom={4}>
        <Spacer top={2}>
          <Placeholder fullWidth height={2} />
        </Spacer>
        <Spacer top={2}>
          <Distribute align='center' space={3 / 2}>
            <Avatar size={3} />
            <Placeholder width={10} height={1} />
          </Distribute>
        </Spacer>
      </Spacer>
    )
  }

  render () {
    const { currentUser, bet, placeholder } = this.props

    if (placeholder) return this.renderPlaceholder()

    const otherUser = [bet.user, bet.user2]
      .filter(x => !!x)
      .filter(user => user.id !== currentUser.id)[0]

    return (
      <Root onClick={this.props.onClick} data-qa='bet-list-item'>
        <Main>
          <BetText>
            {getIntroText(
              currentUser,
              bet.user,
              bet.user2,
              bet.quantity,
              bet.statement.statement,
              'size2'
            )}
          </BetText>
          <Spacer left={1} />
          {otherUser
            ? <Avatar size={4} user={otherUser} />
            : <Avatar size={4} unknown />}
        </Main>
        <Spacer top={1} />
        <Footer>
          <FooterElementWrapper>
            <Text size='size0' dimmed shortLineHeight>
              {getStatusText(getBetStatus(bet, currentUser))}
            </Text>
          </FooterElementWrapper>
          <Spacer left={2} />
          <FooterElementWrapper>
            <Text size='size0' dimmed shortLineHeight textAlign='right'>
              {timeAgo(new Date(bet.createdAt))}
            </Text>
          </FooterElementWrapper>
        </Footer>
      </Root>
    )
  }
}

export default BetListItem
