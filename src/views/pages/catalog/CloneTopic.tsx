import * as React from 'react'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import DialogTitle from '@mui/material/DialogTitle'
import Dialog from '@mui/material/Dialog'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import Stack from '@mui/material/Stack'
import { useState } from 'react'
import Card from '@mui/material/Card'
import { useTopic } from 'src/context/TopicsContext'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'

interface Props {
  name: string
}

export default function SimpleDialogDemo({ name }: Props) {
  const { cloneTopics } = useTopic()
  const [open, setOpen] = useState(false)
  const [cloneTopic, setCloneTopic] = useState({
    oldName: '',
    newName: ''
  })

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleTopicCreation = () => {
    if (cloneTopic.newName === '') {
      toast('New Name is required')
    } else {
      cloneTopics(name, cloneTopic.newName)
      setCloneTopic({
        oldName: '',
        newName: ''
      })
      handleClose()
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: string) => {
    setCloneTopic({
      ...cloneTopic,
      [key]: event.target.value
    })
  }

  return (
    <div>
      <Button
        variant='text'
        sx={{ mr: 2, fontWeight: 500, fontSize: 14, padding: 1, textTransform: 'inherit' }}
        onClick={() => handleClickOpen()}
      >
        <Icon icon='ph:copy' />
        Duplicate
      </Button>
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle sx={{ justifyContent: 'center' }}>Create a new topic</DialogTitle>
        <List sx={{ pt: 0, width: 500, display: 'flex', marginTop: -5, justifyContent: 'center' }}>
          <Stack>
            <p>Clone existing topic in your environment.</p>
            <p>Old name</p>
            <div>
              <form noValidate autoComplete='off'>
                <FormControl sx={{ width: '45ch' }}>
                  <OutlinedInput
                    placeholder='oldName'
                    // defaultValue={name}
                    value={name}
                    onChange={e => handleInputChange(e, 'oldName')}
                    disabled
                  />
                </FormControl>
              </form>
            </div>
          </Stack>
        </List>
        <Stack sx={{ pt: 0, width: 500, padding: 5 }}>
          <p>Enter new name</p>
          <div>
            <form noValidate autoComplete='off'>
              <FormControl sx={{ width: '45ch' }}>
                <OutlinedInput
                  placeholder='newName'
                  value={cloneTopic.newName}
                  onChange={e => handleInputChange(e, 'newName')}
                />
              </FormControl>
            </form>
          </div>
        </Stack>
        <br />
        <Stack spacing={1} sx={{ padding: 5 }}>
          <Stack spacing={1} direction='row' sx={{ justifyContent: 'right' }}>
            <Button variant='contained' onClick={handleClose}>
              Cancel
            </Button>
            <Button variant='contained' onClick={handleTopicCreation}>
              Confirm
            </Button>
          </Stack>
        </Stack>
      </Dialog>
    </div>
  )
}
