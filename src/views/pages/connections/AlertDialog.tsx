import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { Alert, AlertTitle, Box, Grid, IconButton, Snackbar, Stack, Typography } from '@mui/material'
import { useEffect } from 'react'
import CloseIcon from '@mui/icons-material/Close'

interface Props {
  open: boolean
  onClose: () => void
}

export default function AlertDialog({ open, onClose }: Props) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      onClose={onClose}
    >
      <Alert
        severity='error'
        sx={{
          width: '400px',
          height: '60px',
          paddingTop: '10px'
        }}
        icon={false}
        action={
          <IconButton aria-label='close' color='inherit' size='small' onClick={onClose}>
            <CloseIcon fontSize='inherit' />
          </IconButton>
        }
      >
        Connection was unsuccessful
      </Alert>
    </Snackbar>
  )
}
