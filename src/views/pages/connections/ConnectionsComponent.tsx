// ** React Imports
import {
  JSXElementConstructor,
  ReactElement,
  ReactFragment,
  ReactPortal,
  Ref,
  forwardRef,
  use,
  useEffect,
  useState
} from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import MoreButton from './MoreButton'
import NewConnection from './NewConnectionButton'
import { useConnection } from 'src/context/ConnectionsContext'
import { margin } from '@mui/system'
import { left } from '@popperjs/core'
import toast from 'react-hot-toast'
import ViewCluster from './ViewCluster'
import { ThemeContext } from '@emotion/react'
import { Alert, Box, DialogActions, DialogContent, Fade, FadeProps, Grid, Snackbar } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import Icon from 'src/@core/components/icon'
import Loader from '../catalog/Loader'
import TestConnection from './TestConnection'
import AlertDialog from './AlertDialog'

interface Props {
  name: string
  details: string
  id: number
}

const DialogEditUserInfo = ({ name, details, id }: Props) => {
  // ** States
  const [open, setOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const { checkConnection, setTestConnection, getConnections, connections, testConnection } = useConnection()
  const context = useConnection()

  const Transition = forwardRef(function Transition(
    props: FadeProps & { children?: ReactElement<any, any> },
    ref: Ref<unknown>
  ) {
    return <Fade ref={ref} {...props} />
  })

  useEffect(() => {
    if ((details === context.isConnected) === true) {
      setIsConnected(true)
    } else {
      setIsConnected(false)
    }
  }, [context.isConnected])

  function handleClickDisconnect() {
    context.setIsConnected('')
  }

  async function handleClickConnect() {
    handleClickDisconnect()
    // console.log('details', details)
    setOpen(false)
    setIsLoading(true)
    let data = await checkConnection(details)

    if (data?.ok) {
      setTestConnection(data?.status === 200)
      setIsConnected(true)
      setIsLoading(false)
    } else {
      setOpen(true)
      // toast('Cannot connect')
      setIsLoading(false)
    }
  }

  return (
    <>
      <AlertDialog open={open} onClose={() => setOpen(false)} />
      <Card>
        <>
          {isLoading ? (
            <Box>
              <Loader />
            </Box>
          ) : (
            <>
              <CardContent sx={{ textAlign: 'center', '& svg': { mb: 2 }, marginTop: -5 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'end' }}>
                    <Box sx={{ display: 'flex', paddingTop: 5 }}>
                      <Icon icon='mdi:apache-kafka' fontSize={40} />
                    </Box>
                    <Box sx={{ mx: 2, paddingBottom: 2 }}>
                      <Typography sx={{ fontSize: 15, fontWeight: 600 }}>{name}</Typography>
                      <Typography sx={{ fontSize: 10, fontWeight: 600 }}>KAFKA</Typography>
                    </Box>
                  </Box>
                  <MoreButton id={id} name={name} details={details} />
                </Box>
                <Stack direction='row' sx={{ mb: 4 }}>
                  <Stack spacing={0.1}>
                    <Typography sx={{ mr: 3, fontWeight: 600, fontSize: 14 }}>Details</Typography>
                    <Typography sx={{ mr: 3, fontSize: 14 }}>{details}</Typography>
                  </Stack>
                </Stack>
                <br />
                <br />
                <br />
                <br />
                <br />
                {isConnected ? (
                  <Stack spacing={1.5}>
                    <ViewCluster name={name} />
                    <Button
                      variant='contained'
                      sx={{ mr: 2, color: 'white' }}
                      onClick={() => handleClickDisconnect()}
                      fullWidth
                    >
                      Disconnect
                    </Button>
                  </Stack>
                ) : (
                  <>
                    <Button
                      variant='outlined'
                      sx={{ mr: 2, fontWeight: 401 }}
                      onClick={() => handleClickConnect()}
                      fullWidth
                    >
                      Connect
                    </Button>
                  </>
                )}
              </CardContent>
            </>
          )}
        </>
      </Card>
    </>
  )
}

export default DialogEditUserInfo

{
  /* {!context.isConnected ? (
                  <>
                    
                  </>
                ) : (
                  <></>
                )} */
}
