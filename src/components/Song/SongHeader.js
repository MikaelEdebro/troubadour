import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Logo from 'components/Layout/Logo'
import Icon from '@material-ui/core/Icon'
import * as actions from 'store/actions'

const SongHeaderWrapper = styled.header`
  position: absolute;
  display: flex;
  background-color: #fafafa;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 0;
  margin-bottom: 5px;
  width: 100%;
  height: 50px;
  transition: all 0.5s ease-out;
  transform: ${props => (props.show ? 'initial' : 'translateY(-50px)')};
  z-index: 100;
`
class SongHeader extends React.Component {
  goBack() {
    this.props.setEditMode(false)
    this.props.history.goBack()
  }
  render() {
    return (
      <SongHeaderWrapper show={this.props.show}>
        <Icon style={{ fontSize: 30 }} onClick={this.props.history.goBack} title="Go Back">
          arrow_back_ios
        </Icon>
        <Logo />
      </SongHeaderWrapper>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  setEditMode: value => dispatch(actions.setEditMode(value)),
})

export default connect(null, mapDispatchToProps)(withRouter(SongHeader))
