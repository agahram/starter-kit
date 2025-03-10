import { Box, Button, Dialog, DialogTitle, FormControl, List, OutlinedInput, Stack, TextField } from '@mui/material'
import { set } from 'nprogress'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Produce, useBrowser } from 'src/context/BrowserContext'

interface Props {
  topicName: string
  initialKey: string
  initialValue: string
}

export default function ReproduceComp({ topicName, initialKey, initialValue }: Props) {
  const { produceMessage, consumeMessages, handlePagination, getRecordsCount } = useBrowser()
  const [open, setOpen] = useState(false)
  const [newRecords, setNewRecords] = useState({ key: '', value: '' })

  const [header, setHeader] = useState({
    key: '',
    value: ''
  })
  const [reProduceClick, setReProduceClick] = useState(false)

  const [isProduced, setIsProduced] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }
  useEffect(() => {
    setNewRecords({ key: initialKey, value: initialValue })
  }, [open])

  const handleClose = () => {
    setOpen(false)
    setNewRecords({
      key: '',
      value: ''
    })
    setHeader({
      key: '',
      value: ''
    })
  }

  // const handleNewRecord = () => {
  //   setReProduceClick(true)
  // }
  // useEffect(() => {
  //   if (topicName && newRecords.key && newRecords.value && header) {
  //     produceMessage({
  //       topic: topicName,
  //       key: newRecords.key,
  //       value: newRecords.value,
  //       headers: [
  //         {
  //           key: header.key,
  //           value: header.value
  //         }
  //       ]
  //     })
  //     setOpen(false)
  //     setReProduceClick(false)
  //   }
  // }, [reProduceClick])

  // useEffect(() => {
  //   if (topicName) {
  //     getRecordsCount(topicName)
  //     setIsProduced(false)
  //   }
  // }, [isProduced])

  const handleNewRecord = () => {
    if (topicName) {
      produceMessage({
        topic: topicName,
        key: newRecords.key,
        value: newRecords.value,
        headers: [
          {
            key: header.key,
            value: header.value
          }
        ]
      })
      setOpen(false)
      setNewRecords({
        key: '',
        value: ''
      })
      setHeader({
        key: '',
        value: ''
      })
    }
  }

  const handleHeaderChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: string) => {
    setHeader({
      ...header,
      [key]: event.target.value
    })
  }
  return (
    <div>
      <Box sx={{ marginRight: 1 }}>
        <Button variant='outlined' color='secondary' onClick={handleClickOpen} sx={{ marginTop: 3 }}>
          <svg xmlns='http://www.w3.org/2000/svg' width='2em' height='2em' viewBox='0 0 32 32'>
            <path
              fill='currentColor'
              d='M16 3C8.832 3 3 8.832 3 16s5.832 13 13 13s13-5.832 13-13S23.168 3 16 3m0 2c6.087 0 11 4.913 11 11s-4.913 11-11 11S5 22.087 5 16S9.913 5 16 5m-1 5v5h-5v2h5v5h2v-5h5v-2h-5v-5z'
            ></path>
          </svg>
          &nbsp;Re-produce
        </Button>
      </Box>
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle sx={{ justifyContent: 'center' }}>Reproduce existing records</DialogTitle>
        <List sx={{ pt: 0, width: 500, display: 'flex', marginTop: -5, justifyContent: 'center' }}>
          <Stack>
            <p>Key (string)</p>
            <div>
              <form noValidate autoComplete='off'>
                <FormControl sx={{ width: '45ch' }}>
                  <TextField
                    value={newRecords.key}
                    onChange={e => setNewRecords({ ...newRecords, key: e.target.value })}
                  />
                </FormControl>
              </form>
            </div>
            <p>Value (string)</p>
            <div>
              <form noValidate autoComplete='off'>
                <FormControl sx={{ width: '45ch' }}>
                  <TextField
                    value={newRecords.value}
                    onChange={e => setNewRecords({ ...newRecords, value: e.target.value })}
                  />
                </FormControl>
              </form>
            </div>
          </Stack>
        </List>
        <Stack spacing={1} sx={{ padding: 5 }}>
          <Stack spacing={1} direction='row' sx={{ justifyContent: 'right' }}>
            <Button variant='contained' onClick={handleClose}>
              Cancel
            </Button>
            <Button variant='contained' onClick={handleNewRecord}>
              Confirm
            </Button>
          </Stack>
        </Stack>
      </Dialog>
    </div>
  )
}
