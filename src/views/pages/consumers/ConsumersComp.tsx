import { Box, Button, Card, Stack, Typography, styled, useMediaQuery } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import React, { useEffect, useState } from 'react'
import CustomChip from 'src/@core/components/mui/chip'
import { Consumer, useConsumer } from 'src/context/ConsumersContext'
import { log } from 'console'
import { color, useTheme } from '@mui/system'
import SearchComp from '../catalog/SearchComp'
import Loader from '../catalog/Loader'
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip'

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 12
  }
}))

const columns: GridColDef[] = [
  {
    flex: 0.1,
    field: 'group',
    minWidth: 280,
    headerName: 'Consumer group'
  },
  {
    flex: 0.25,
    minWidth: 80,
    field: 'state',
    headerName: 'State',
    renderCell: ({ row }: any) => {
      if (row.state === 'Stable') {
        return <CustomChip label='stable' skin='light' color='success' />
      } else if (row.state === 'Empty') {
        return <CustomChip label='empty' skin='light' color='warning' />
      } else if (row.state === 'Rebalancing') {
        return <CustomChip label='rebalancing' skin='light' color='info' />
      } else if (row.state === 'Dead') {
        return <CustomChip label='dead' skin='light' color='error' />
      }
    }
  },
  {
    flex: 0.25,
    minWidth: 80,
    field: 'overallLag',
    headerName: 'Overall Lag'
  },
  {
    flex: 0.25,
    minWidth: 80,
    field: 'consumHostId',
    headerName: 'Coordinator host id'
  },
  {
    flex: 0.25,
    minWidth: 80,
    field: 'topics',
    headerName: 'Topics',
    renderCell: ({ row }: any) => {
      if (row.assignedTopics.length !== 0) {
        for (let i = 0; i < row.assignedTopics.length; i++) {
          return (
            <LightTooltip title={row.assignedTopics}>
              <div>
                <CustomChip label={row.assignedTopics} skin='light' color='primary' />
              </div>
            </LightTooltip>
          )
        }
      } else {
        return <CustomChip label='none' skin='light' color='primary' />
      }
    }
  }
]

export default function ConsumersComp() {
  const { consumers, getConsumers, isLoading } = useConsumer()
  const [query, setQuery] = useState('')
  const [currentData, setCurrentData] = useState<Consumer[]>([])
  const [state, setState] = useState({
    stable: 0,
    empty: 0,
    rebalancing: 0,
    dead: 0
  })

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isFull = useMediaQuery('(max-width:1100px)')

  const [totalLag, setTotalLag] = useState(0)
  useEffect(() => {
    getConsumers()
  }, [])

  useEffect(() => {
    if (consumers !== null && typeof consumers === 'object') {
      const val = Object.values(consumers)

      let newState = {
        stable: 0,
        empty: 0,
        rebalancing: 0,
        dead: 0
      }
      let newTotalLag = 0
      let newData = val.map((obj: any) => {
        if (obj.state === 'Stable') {
          newState.stable += 1
        } else if (obj.state === 'Empty') {
          newState.empty += 1
        } else if (obj.state === 'Rebalancing') {
          newState.rebalancing += 1
        } else if (obj.state === 'Dead') {
          newState.dead += 1
        }
        newTotalLag += obj.overallLag
        return {
          group: obj.group,
          state: obj.state,
          consumHostId: `${obj.host}:${obj.port}-${obj.brokerId}`,
          overallLag: obj.overallLag,
          assignedTopics: obj.assignedTopics
        }
      })

      setCurrentData(newData)
      setState(newState)
      setTotalLag(newTotalLag)
    }
  }, [consumers])

  useEffect(() => {
    let search_data = consumers.filter((consumer: any) => {
      return consumer.group.toLowerCase().includes(query.toLowerCase())
    })
    let newData = search_data.map((obj: any) => {
      return {
        group: obj.group,
        state: obj.state,
        consumHostId: `${obj.host}:${obj.port}-${obj.brokerId}`,
        overallLag: obj.overallLag,
        assignedTopics: obj.assignedTopics
      }
    })
    setCurrentData(newData)
  }, [query])

  function handleShow(consumerState: string) {
    if (consumerState === 'All') {
      let newData = consumers.map((obj: any) => {
        return {
          group: obj.group,
          state: obj.state,
          consumHostId: `${obj.host}:${obj.port}-${obj.brokerId}`,
          overallLag: obj.overallLag,
          assignedTopics: obj.assignedTopics
        }
      })
      setCurrentData(newData)
    } else {
      let show_data = consumers.filter((consumer: any) => consumer.state === consumerState)
      // console.log(show_data)
      let newData = show_data.map((obj: any) => {
        return {
          group: obj.group,
          state: obj.state,
          consumHostId: `${obj.host}:${obj.port}-${obj.brokerId}`,
          overallLag: obj.overallLag,
          assignedTopics: obj.assignedTopics
        }
      })

      setCurrentData(newData)
    }
  }

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Card sx={{ padding: 1, marginBottom: 2 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingLeft: 1
              }}
            >
              <h2>Consumers</h2>
              <Button
                variant='contained'
                color='primary'
                sx={{ height: 25, width: 200 }}
                onClick={() => handleShow('All')}
              >
                Show All
              </Button>
            </Box>
          </Card>
          <Box sx={{ marginBottom: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Card sx={{ width: isFull ? 200 : 260, padding: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexDirection: isMobile ? 'column' : 'row'
                }}
              >
                <p style={{ color: '#787eff', fontWeight: 600 }}>Stable</p>
                <Button variant='outlined' color='secondary' sx={{ height: 25 }} onClick={() => handleShow('Stable')}>
                  Show
                </Button>
              </Box>
              <CustomChip label={state.stable} skin='light' color='success' />
            </Card>
            <Card sx={{ width: isFull ? 200 : 260, padding: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexDirection: isMobile ? 'column' : 'row'
                }}
              >
                <p style={{ color: '#787eff', fontWeight: 600 }}>Empty</p>
                <Button variant='outlined' color='secondary' sx={{ height: 25 }} onClick={() => handleShow('Empty')}>
                  Show
                </Button>
              </Box>
              <CustomChip label={state.empty} skin='light' color='warning' />
            </Card>
            <Card sx={{ width: isFull ? 200 : 260, padding: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexDirection: isMobile ? 'column' : 'row'
                }}
              >
                <p style={{ color: '#787eff', fontWeight: 600 }}>Rebalancing</p>
                <Button
                  variant='outlined'
                  color='secondary'
                  sx={{ height: 25 }}
                  onClick={() => handleShow('Rebalancing')}
                >
                  Show
                </Button>
              </Box>
              <CustomChip label={state.rebalancing} skin='light' color='info' />
            </Card>
            <Card sx={{ width: isFull ? 200 : 260, padding: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexDirection: isMobile ? 'column' : 'row'
                }}
              >
                <p style={{ color: '#787eff', fontWeight: 600 }}>Dead</p>
                <Button variant='outlined' color='secondary' sx={{ height: 25 }} onClick={() => handleShow('Dead')}>
                  Show
                </Button>
              </Box>
              <CustomChip label={state.dead} skin='light' color='error' />
            </Card>
            <Card sx={{ width: isFull ? 200 : 260, padding: 3 }}>
              <p style={{ color: '#787eff', fontWeight: 600 }}>Total lag</p>
              <CustomChip label={totalLag} skin='light' color='warning' />
            </Card>
          </Box>
          <Card>
            <SearchComp setQuery={setQuery} />
            <Box sx={{ height: 700 }}>
              <DataGrid columns={columns} rows={currentData} getRowId={item => item.group} />
            </Box>
          </Card>
        </>
      )}
    </>
  )
}
