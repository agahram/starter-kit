import React from 'react'
import { Ref, useState, forwardRef, ReactElement } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Switch from '@mui/material/Switch'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import Fade, { FadeProps } from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Icon from 'src/@core/components/icon'
import TestConnection from './TestConnection'
import ConnectionsComponent from './ConnectionsComponent'
import { useConnection } from 'src/context/ConnectionsContext'
import Stack from '@mui/material/Stack'
import useMediaQuery from '@mui/material/useMediaQuery'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

export default function NewConnection() {
  const [show, setShow] = useState<boolean>(false)
  const { connections, addConnections } = useConnection()
  const [newConnection, setNewConnection] = useState({
    name: '',
    boot_server: '',
    id: 0
  })
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: string) => {
    setNewConnection({
      ...newConnection,
      [key]: event.target.value
    })
  }
  function handleClick() {
    setShow(true)
  }
  function handleCreation() {
    if (newConnection.name !== '' && newConnection.boot_server !== '') {
      addConnections({
        connectionName: newConnection.name,
        bootStrapServer: newConnection.boot_server
      })
      setNewConnection({
        name: '',
        boot_server: '',
        id: 0
      })
    }
    setShow(false)
  }
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'right', justifyContent: 'right' }}>
        <Button
          variant='contained'
          sx={{ mr: 3, color: 'white', alignContent: 'flex-end', marginBottom: 2, width: 280 }}
          onClick={() => handleClick()}
        >
          <svg xmlns='http://www.w3.org/2000/svg' width='2em' height='1.7em' viewBox='0 0 24 24'>
            <path
              fill='currentColor'
              d='M18 12.998h-5v5a1 1 0 0 1-2 0v-5H6a1 1 0 0 1 0-2h5v-5a1 1 0 0 1 2 0v5h5a1 1 0 0 1 0 2'
            ></path>
          </svg>
          Add Connection
        </Button>
      </Box>
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
                label='Connection Name'
                value={newConnection.name}
                onChange={e => handleInputChange(e, 'name')}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body2'>Configure your Apache Kafka connection manually</Typography>
            </Grid>
            <Grid item sm={6} xs={12}>
              <TestConnection bootStrapServer={newConnection.boot_server} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Bootstrap Server'
                value={newConnection.boot_server}
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
          <Button variant='contained' sx={{ mr: 2 }} onClick={() => handleCreation()}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
