// export default SecondPage
// ** Next Imports
import { GetStaticProps, InferGetStaticPropsType } from 'next/types'

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Third Party Components
import axios from 'axios'

// ** Type Import
import { PricingDataType } from 'src/@core/components/plan-details/types'
import ConnectionsComponent from 'src/views/pages/connections/ConnectionsComponent'
import NewConnectionButton from 'src/views/pages/connections/NewConnectionButton'
import { useState } from 'react'
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
