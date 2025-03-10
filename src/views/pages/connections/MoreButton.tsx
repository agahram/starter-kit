import * as React from 'react'
import Box from '@mui/material/Box'
import Popper, { PopperPlacementType } from '@mui/material/Popper'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import ConfigButton from './ConfigButton'
import Divider from '@mui/material/Divider'
import { useConnection } from 'src/context/ConnectionsContext'
import { ClickAwayListener } from '@mui/base'
import Icon from 'src/@core/components/icon'
import DuplicateConnection from './DuplicateConnection'

interface Props {
  id: number
  details: string
  name: string
}

export default function PositionedPopper({ id, details, name }: Props) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  const [open, setOpen] = React.useState(false)
  const [placement, setPlacement] = React.useState<PopperPlacementType>()
  const { deleteConnection, addConnections } = useConnection()

  const handleClick = (newPlacement: PopperPlacementType) => (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
    setOpen(prev => placement !== newPlacement || !prev)
    setPlacement(newPlacement)
  }

  function handleDelete() {
    deleteConnection(id)
  }

  function handleDuplicate() {
    addConnections({
      connectionName: name,
      bootStrapServer: details
    })
  }

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box sx={{ width: 300 }}>
        <Popper
          // Note: The following zIndex style is specifically for documentation purposes and may not be necessary in your application.
          sx={{ zIndex: 1200 }}
          open={open}
          anchorEl={anchorEl}
          placement={placement}
          transition
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper sx={{ padding: 2 }}>
                <Typography sx={{ p: 1 }}>
                  <Stack spacing={0.1}>
                    <Stack sx={{ marginBottom: -2 }}>
                      <ConfigButton details={details} name={name} id={id} />
                    </Stack>
                    <Divider />
                    <Stack sx={{ marginBottom: -10, marginTop: -10 }}>
                      {/* <Button
                        variant='text'
                        sx={{ mr: 2, fontWeight: 401, fontSize: 14, textTransform: 'capitalize' }}
                        onClick={() => handleDuplicate()}
                      >
                        <Icon icon='ph:copy' fontSize={23} />
                        Duplicate
                      </Button> */}
                      <DuplicateConnection details={details} name={name} id={id} />
                    </Stack>
                    <Divider />
                    <Stack sx={{ marginBottom: -2, marginTop: -2 }}>
                      <Button
                        variant='text'
                        sx={{ mr: 2, fontWeight: 401, fontSize: 14, textTransform: 'capitalize' }}
                        onClick={() => handleDelete()}
                      >
                        <Icon icon='material-symbols:delete-outline' fontSize={20} />
                        Delete
                      </Button>
                    </Stack>
                  </Stack>
                </Typography>
              </Paper>
            </Fade>
          )}
        </Popper>
        <Grid container justifyContent='flex-start'>
          <Grid item container alignItems='flex-end' direction='column'>
            <Grid item>
              <Button onClick={handleClick('right-end')} sx={{ fontWeight: 1000 }}>
                ...
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </ClickAwayListener>
  )
}
