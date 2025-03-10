import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Grid from '@mui/material/Grid'
import Icon from 'src/@core/components/icon'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import React, { Ref, useState, forwardRef, ReactElement } from 'react'
import Fade, { FadeProps } from '@mui/material/Fade'
import Stack from '@mui/material/Stack'
import { useConnection } from 'src/context/ConnectionsContext'

interface Props {
  bootStrapServer: string
}

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

export default function TestConnection({ bootStrapServer }: Props) {
  const [show, setShow] = useState<boolean>(false)
  const { checkConnection, testConnection, setTestConnection } = useConnection()

  async function handleClickConnect() {
    setTestConnection(false)
    setShow(true)
    let data = await checkConnection(bootStrapServer)
    // console.log('DATA', data)
    if (data?.ok) {
      setTestConnection(data?.status === 200)
    }
    // console.log(testConnection)
  }
  return (
    <>
      <Button variant='contained' sx={{ mr: 2 }} onClick={async () => await handleClickConnect()}>
        Test connection
      </Button>
      <Dialog
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
            pb: theme => `${theme.spacing(5)} !important`,
            px: theme => [`${theme.spacing(3)} !important`, `${theme.spacing(70)} !important`],
            pt: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          {testConnection ? (
            <>
              <Box sx={{ mb: 8, textAlign: 'center' }}>
                <Typography variant='h6' sx={{ mb: 3, lineHeight: '2rem' }}>
                  Connection check successful
                </Typography>
              </Box>
              <Grid item xs={12}>
                <Stack direction='row' spacing={2}>
                  <svg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 20 20'>
                    <path fill='currentColor' d='m0 11l2-2l5 5L18 3l2 2L7 18z'></path>
                  </svg>
                  <Typography variant='body2'>Connection to Kafka was successful</Typography>
                </Stack>
              </Grid>
            </>
          ) : (
            <>
              <Box sx={{ mb: 8, textAlign: 'center' }}>
                <Typography variant='h6' sx={{ mb: 3, lineHeight: '2rem' }}>
                  Connection check unsuccessful
                </Typography>
              </Box>
              <Grid item xs={12}>
                <Stack direction='row' spacing={2}>
                  <svg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 16 16'>
                    <path
                      fill='currentColor'
                      d='M15.854 12.854L11 8l4.854-4.854a.503.503 0 0 0 0-.707L13.561.146a.499.499 0 0 0-.707 0L8 5L3.146.146a.5.5 0 0 0-.707 0L.146 2.439a.499.499 0 0 0 0 .707L5 8L.146 12.854a.5.5 0 0 0 0 .707l2.293 2.293a.499.499 0 0 0 .707 0L8 11l4.854 4.854a.5.5 0 0 0 .707 0l2.293-2.293a.499.499 0 0 0 0-.707'
                    ></path>
                  </svg>
                  <Typography variant='body2'>Connection to Kafka was unsuccessful</Typography>
                </Stack>
              </Grid>
            </>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          {testConnection ? (
            <Button variant='contained' sx={{ mr: 2 }} onClick={() => setShow(false)}>
              Confirm
            </Button>
          ) : (
            <>
              <Button variant='contained' sx={{ mr: 2 }} onClick={() => handleClickConnect()}>
                Try again
              </Button>
              <Button variant='contained' sx={{ mr: 2 }} onClick={() => setShow(false)}>
                Cancel
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </>
  )
}
