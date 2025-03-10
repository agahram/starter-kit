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

export default function DuplicateConnection({ details, name, id }: Props) {
  const { editConnection, addConnections } = useConnection()
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
      addConnections({
        connectionName: name,
        bootStrapServer: details
      })
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
      <Button
        variant='text'
        sx={{ mr: 2, fontWeight: 401, fontSize: 14, textTransform: 'capitalize' }}
        onClick={() => handleClick()}
      >
        <Icon icon='ph:copy' fontSize={23} />
        Duplicate
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
                label='Bootstrap Server'
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
