import React from 'react'
import { Ref, useState, forwardRef, ReactElement } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Fade, { FadeProps } from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Icon from 'src/@core/components/icon'
import TestConnection from './TestConnection'
import { useConnection } from 'src/context/ConnectionsContext'

interface Props {
  details: string
  name: string
  id: number
}

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

export default function ConfigButton({ details, name, id }: Props) {
  const { editConnection } = useConnection()
  const [show, setShow] = useState<boolean>(false)
  const [updateConnection, setUpdateConnection] = useState({
    name: name,
    boot_server: details,
    id: id
  })

  function handleClick() {
    setShow(true)
  }

  function handleUpdate() {
    if (updateConnection) {
      editConnection({
        connectionName: updateConnection.name,
        bootStrapServer: updateConnection.boot_server,
        connectionId: id
      })
    }
    setShow(false)
  }
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: string) => {
    setUpdateConnection({
      ...updateConnection,
      [key]: event.target.value
    })
  }
  return (
    <>
      <Button variant='text' onClick={() => handleClick()} sx={{ mr: 2, fontWeight: 401, fontSize: 13 }}>
        <svg xmlns='http://www.w3.org/2000/svg' width='1.3em' height='3em' viewBox='0 0 24 24'>
          <path
            fill='currentColor'
            d='m9.25 22l-.4-3.2q-.325-.125-.612-.3t-.563-.375L4.7 19.375l-2.75-4.75l2.575-1.95Q4.5 12.5 4.5 12.338v-.675q0-.163.025-.338L1.95 9.375l2.75-4.75l2.975 1.25q.275-.2.575-.375t.6-.3l.4-3.2h5.5l.4 3.2q.325.125.613.3t.562.375l2.975-1.25l2.75 4.75l-2.575 1.95q.025.175.025.338v.674q0 .163-.05.338l2.575 1.95l-2.75 4.75l-2.95-1.25q-.275.2-.575.375t-.6.3l-.4 3.2zm2.8-6.5q1.45 0 2.475-1.025T15.55 12t-1.025-2.475T12.05 8.5q-1.475 0-2.488 1.025T8.55 12t1.013 2.475T12.05 15.5'
          ></path>
        </svg>
        Configuration
        {/* <Typography sx={{ fontSize: 13, fontWeight: 600 }}>Configuration</Typography> */}
      </Button>
      <Dialog
        fullWidth
        open={show}
        maxWidth='md'
        scroll='body'
        onClose={() => setShow(false)}
        TransitionComponent={Transition}
        onBackdropClick={() => setShow(false)}
      >
        <DialogContent
          sx={{
            position: 'relative',
            pb: theme => `${theme.spacing(8)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <IconButton
            size='small'
            onClick={() => setShow(false)}
            sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
          >
            <Icon icon='mdi:close' />
          </IconButton>
          <Box sx={{ mb: 8, textAlign: 'center' }}>
            <Typography variant='h5' sx={{ mb: 3, lineHeight: '2rem' }}>
              Apache Kafka connection
            </Typography>
            <Typography variant='body2'>Edit or delete the connection details for Apache Kafka cluster</Typography>
          </Box>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                defaultValue={updateConnection.name}
                label='Connection Name'
                placeholder={updateConnection.name}
                value={updateConnection.name}
                onChange={e => handleInputChange(e, 'name')}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body2'>Configure your Apache Kafka connection manually</Typography>
            </Grid>
            <Grid item sm={6} xs={12}>
              <TestConnection bootStrapServer={updateConnection.boot_server} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                defaultValue={updateConnection.boot_server}
                label='Bootstrap Servers'
                placeholder={updateConnection.boot_server}
                value={updateConnection.boot_server}
                onChange={e => handleInputChange(e, 'boot_server')}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Button variant='outlined' onClick={() => setShow(false)}>
            Cancel
          </Button>
          <Button variant='contained' sx={{ mr: 2 }} onClick={() => handleUpdate()}>
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
