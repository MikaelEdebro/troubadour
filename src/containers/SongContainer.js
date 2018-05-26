import React from 'react'
import ReactDOM from 'react-dom'

import Song from 'components/Song/Song'
import SongControls from 'components/Song/SongControls'
import Wrapper from 'hoc/Wrapper'
import './SongContainer.css'

class SongContainer extends React.Component {
  state = {
    fontSize: 15,
    showControls: true,
    isScrolling: false,
    isPaused: false,
    intervalRunning: false,
  }
  scrollInterval = null

  changeFontSize = value => {
    this.setState(prevState => ({ fontSize: prevState.fontSize + value }))
  }

  play = () => {
    this.toggleControls(false)
    this.setState({ isPaused: false, isScrolling: true })

    const INTERVAL_TIME = 20
    const { seconds } = this.props.song
    const songDiv = ReactDOM.findDOMNode(this.songDiv)
    const songPosition = songDiv.getBoundingClientRect()
    const wrapperPosition = this.scrollWrapper.getBoundingClientRect()

    const totalPixelsToScroll = songPosition.height - wrapperPosition.height
    const pixelsToScrollPerSecond = totalPixelsToScroll / seconds
    const pixelsToScrollPerInterval = pixelsToScrollPerSecond / (1000 / INTERVAL_TIME)

    if (!this.state.intervalRunning) {
      this.setState({ intervalRunning: true })
      let scrollAmount = pixelsToScrollPerInterval

      this.scrollInterval = setInterval(() => {
        console.log('interval')
        if (this.state.isPaused) {
          return
        }
        scrollAmount += pixelsToScrollPerInterval
        this.scrollWrapper.scrollTop = scrollAmount

        const shouldStopScrolling =
          parseInt(songDiv.getBoundingClientRect().bottom, 10) <=
          parseInt(this.scrollWrapper.getBoundingClientRect().bottom, 10)
        if (shouldStopScrolling) {
          clearInterval(this.scrollInterval)
          this.setState({ isPaused: false, isScrolling: false, intervalRunning: false })

          setTimeout(() => {
            this.resetScroll()
            this.toggleControls(true)
          }, 1000)
        }
      }, INTERVAL_TIME)
    }
  }

  pause = () => {
    this.setState({ isPaused: true, isScrolling: false })
  }

  replay = () => {
    console.log('replay')
    clearInterval(this.scrollInterval)
    this.setState({ isPaused: true, isScrolling: false, intervalRunning: false })
    this.resetScroll()
    setTimeout(() => {
      this.play()
    }, 1500)
  }

  resetScroll = () => {
    this.scrollWrapper.scroll({
      top: 0,
      behavior: 'smooth',
    })
  }

  toggleControls = value => {
    this.setState({ showControls: value })
  }

  render() {
    return (
      <Wrapper>
        <div
          className={['scroll-panel', !this.state.showControls ? 'full-height' : null].join(' ')}
          style={{ fontSize: this.state.fontSize + 'px' }}
          ref={el => (this.scrollWrapper = el)}
        >
          <Song
            song={this.props.song}
            ref={el => (this.songDiv = el)}
            clicked={() => this.toggleControls(!this.state.showControls)}
          />
        </div>
        <SongControls
          show={this.state.showControls}
          increaseFont={() => this.changeFontSize(1)}
          decreaseFont={() => this.changeFontSize(-1)}
          play={this.play}
          pause={this.pause}
          replay={this.replay}
          isPaused={this.state.isPaused}
          isScrolling={this.state.isScrolling}
        />
      </Wrapper>
    )
  }
}

export default SongContainer