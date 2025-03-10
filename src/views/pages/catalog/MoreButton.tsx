import * as React from 'react'
import Box from '@mui/material/Box'
import Popper, { PopperPlacementType } from '@mui/material/Popper'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import { useTopic } from 'src/context/TopicsContext'
import CloneTopic from './CloneTopic'
import EditTopic from './EditTopic'
import { ClickAwayListener } from '@mui/base'
import Icon from 'src/@core/components/icon'

interface Props {
  name: string
}

export default function PositionedPopper({ name }: Props) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  const [open, setOpen] = React.useState(false)
  const [placement, setPlacement] = React.useState<PopperPlacementType>()
  const { deleteTopic } = useTopic()

  const handleClick = (newPlacement: PopperPlacementType) => (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
    setOpen(prev => placement !== newPlacement || !prev)
    setPlacement(newPlacement)
  }

  function handleDelete() {
    deleteTopic(name)
  }

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box sx={{ width: 300 }}>
        {open ? (
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
                <Paper sx={{ padding: 2.5 }}>
                  <Stack spacing={0.1}>
                    <EditTopic name={name} />
                    <Divider />
                    <Stack sx={{ marginBottom: -10, marginTop: -10 }}>
                      <CloneTopic name={name} />
                    </Stack>
                    <Divider />
                    <Stack sx={{ marginBottom: -2, marginTop: -2 }}>
                      <Button
                        variant='text'
                        sx={{ mr: 2, fontWeight: 401, fontSize: 13, padding: 0.2, textTransform: 'capitalize' }}
                        onClick={() => handleDelete()}
                      >
                        {/* <svg xmlns='http://www.w3.org/2000/svg' width='1.3em' height='3em' viewBox='0 0 24 24'>
                            <path
                              fill='currentColor'
                              d='M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM9 17h2V8H9zm4 0h2V8h-2zM7 6v13z'
                            ></path>
                          </svg> */}
                        <Icon icon='material-symbols:delete-outline' />
                        Delete
                      </Button>
                    </Stack>
                  </Stack>
                </Paper>
              </Fade>
            )}
          </Popper>
        ) : null}
        <Grid container alignItems='flex-end'>
          <Grid item container direction='column'>
            <Grid item>
              <Button onClick={handleClick('right-end')} sx={{ marginTop: -2, fontWeight: 1000 }}>
                ...
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </ClickAwayListener>
  )
}
