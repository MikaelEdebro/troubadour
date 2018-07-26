import React from 'react'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'

const songListItem = ({ song, clicked, actionComponent }) => {
  return (
    <Card style={{ marginBottom: '10px' }}>
      <CardHeader
        action={actionComponent}
        title={
          <div
            onClick={clicked}
            style={{ cursor: 'pointer', fontSize: '18px', lineHeight: '22px' }}
          >
            {song.artist + ' - ' + song.title}
          </div>
        }
        style={{ padding: '12px 22px' }}
      />
    </Card>
  )
}

export default songListItem
