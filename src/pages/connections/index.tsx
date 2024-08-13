// export default SecondPage
// ** Next Imports

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Type Import
import ConnectionsComponent from 'src/views/pages/connections/ConnectionsComponent'
import NewConnectionButton from 'src/views/pages/connections/NewConnectionButton'
import { useEffect, useState } from 'react'
import { useConnection } from 'src/context/ConnectionsContext'
import MainComp from 'src/views/pages/connections/MainComp'

const DialogExamples = () => {
  const { connections, getConnections } = useConnection()
  useEffect(() => {
    getConnections()
  }, [])
  return (
    <>
      <MainComp />
    </>
  )
}

export default DialogExamples
