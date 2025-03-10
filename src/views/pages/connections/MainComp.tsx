// export default SecondPage
// ** Next Imports

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Type Import
import ConnectionsComponent from 'src/views/pages/connections/ConnectionsComponent'
import NewConnectionButton from 'src/views/pages/connections/NewConnectionButton'
import { useEffect, useState } from 'react'
import { useConnection } from 'src/context/ConnectionsContext'

const DialogExamples = () => {
  const { connections } = useConnection()
  return (
    <>
      <NewConnectionButton />
      <Grid container spacing={6} className='match-height'>
        {connections?.map(connection => (
          <Grid item md={3.2} sm={6} xs={12} key={connection.connectionId}>
            <ConnectionsComponent
              name={connection.connectionName}
              details={connection.bootStrapServer}
              id={connection.connectionId!}
            />
          </Grid>
        ))}
      </Grid>
    </>
  )
}

export default DialogExamples
