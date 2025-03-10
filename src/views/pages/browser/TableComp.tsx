// ** React Imports
import { useEffect, useState, useCallback, ChangeEvent, SetStateAction } from 'react'
import Card from '@mui/material/Card'
import { DataGrid, GridColDef, GridRenderCellParams, GridRowId, GridSortModel } from '@mui/x-data-grid'
import { Browser, useBrowser } from 'src/context/BrowserContext'
import Loader from '../catalog/Loader'
import Icon from 'src/@core/components/icon'
import toast from 'react-hot-toast'
import {
  Box,
  Button,
  CardHeader,
  Checkbox,
  IconButton,
  ListItemText,
  MenuItem,
  PopperPlacementType,
  Select,
  SelectChangeEvent,
  TextField
} from '@mui/material'
import SideComp from './SideComp'
import Paper from 'src/@core/theme/overrides/paper'
import { render } from 'nprogress'
import select from 'src/@core/theme/overrides/select'
import { auto } from '@popperjs/core'

const columns: GridColDef[] = [
  {
    flex: 0.175,
    minWidth: 300,
    field: 'timestamp',
    headerName: 'Timestamp'
  },
  {
    flex: 0.175,
    type: 'number',
    minWidth: 120,
    headerName: 'Partitions',
    field: 'partitions'
  },
  {
    flex: 0.175,
    minWidth: 120,
    field: 'offset',
    headerName: 'Offset'
  },
  {
    flex: 0.175,
    field: 'key',
    minWidth: 80,
    headerName: 'Key'
  },
  {
    flex: 0.175,
    minWidth: 140,
    field: 'value',
    headerName: 'Value'
  }
]

interface Props {
  topicName?: string
  searchClick: boolean
  setSearchClick: React.Dispatch<React.SetStateAction<boolean>>
}

const TableServerSide = ({ topicName, searchClick, setSearchClick }: Props) => {
  const {
    browsers,
    consumeMessages,
    loading,
    produceLoad,
    searchByPartitions,
    searchLoad,
    searchByKeys,
    searchByDatetime,
    searchByHeaders,
    handlePagination,
    getRecordsCount,
    recordsCount
  } = useBrowser()
  const [currentTopics, setCurrentTopics] = useState<Browser[]>([])
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0
  })
  const [searchValue, setSearchValue] = useState<string>('')
  const [searchOption, setSearchOption] = useState<string>('')
  const [idArr, setIdArr] = useState<string[]>([])
  const [showSide, setShowSide] = useState(false)
  const [placement, setPlacement] = useState<PopperPlacementType>()
  const [searchChoice, setSearchChoice] = useState<string>('')
  const [selectionModel, setSelectionModel] = useState<GridRowId[]>([])

  // console.log('page', paginationModel)

  useEffect(() => {
    idArr.length !== 0 ? setShowSide(true) : setShowSide(false)
    setPlacement('left')
  }, [idArr])

  useEffect(() => {
    if (topicName) {
      // consumeMessages(topicName)

      handlePagination(paginationModel, topicName)
      getRecordsCount(topicName)
    }
  }, [topicName, paginationModel])

  useEffect(() => {
    setSearchOption('')
    setSearchChoice('')
    setSearchValue('')
    let array: SetStateAction<string[]> = []
    if (topicName && searchValue) {
      if (searchOption === 'partition') {
        searchByPartitions(topicName, Number(searchValue))
      } else if (searchOption === 'key') {
        toast('Write all the keys with , separator')
        try {
          let keySearchValue = searchValue.split(',')

          searchByKeys(keySearchValue, topicName, searchChoice)
        } catch (error) {
          console.log('error', error)
        }
      } else if (searchOption === 'timestamp') {
        toast('Write time range with - separator')
        try {
          let timestampSearchValue = searchValue.split('-')

          searchByDatetime(topicName, timestampSearchValue[0], timestampSearchValue[1])
        } catch (error) {
          console.log('error', error)
        }
      } else if (searchOption === 'header') {
        toast('Write headers value and keys with , separator')
        try {
          let headerSearchValue = searchValue.split(',')

          searchByHeaders(headerSearchValue, topicName, searchChoice)
        } catch (error) {
          console.log('error', error)
        }
      }
    }
  }, [searchClick])

  useEffect(() => {
    let data: any = []
    if (browsers !== null && typeof browsers === 'object') {
      data = browsers.map((obj: any) => {
        return {
          key: obj.message?.key,
          value: obj.message?.value,
          timestamp: obj.message?.timestamp.utcDateTime,
          partitions: obj.partition,
          offset: obj.offset,
          id: obj.message?.timestamp.utcDateTime || Date.now().toString(36)
        }
      })
      setCurrentTopics(data)
    }
  }, [browsers])

  const handleSearch = (value: string) => {
    setSearchValue(value)
  }

  const handleSelectSearch = () => {
    setSearchClick(true)
  }

  const handleChange = (event: SelectChangeEvent) => {
    setSearchOption(event.target.value)
  }
  const handleSearchChange = (event: SelectChangeEvent) => {
    setSearchChoice(event.target.value)
  }
  console.log('produce load', produceLoad)

  return (
    <>
      {loading || searchLoad || produceLoad ? (
        <Box sx={{ width: '100%', height: 500 }}>
          <Loader />
        </Box>
      ) : (
        <Card sx={{ width: '100%' }}>
          <Box
            sx={{
              gap: 2,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'stretch',
              justifyContent: 'start',
              p: theme => theme.spacing(4, 5, 4, 5)
            }}
          >
            <TextField
              size='small'
              value={searchValue}
              onChange={(event: ChangeEvent<HTMLInputElement>) => handleSearch(event.target.value)}
              placeholder='Search'
              InputProps={{
                startAdornment: (
                  <Box sx={{ mr: 2, display: 'flex' }}>
                    <Icon icon='mdi:magnify' />
                  </Box>
                )
              }}
              sx={{
                width: {
                  xs: 1,
                  sm: 'auto'
                },
                '& .MuiInputBase-root > svg': {
                  mr: 2
                }
              }}
            />
            <Select value={searchOption} label='' onChange={handleChange} sx={{ height: 40 }}>
              <MenuItem value='key'>
                <ListItemText primary='key' />
              </MenuItem>
              <MenuItem value='header'>
                <ListItemText primary='header' />
              </MenuItem>
              <MenuItem value='timestamp'>
                <ListItemText primary='timestamp' />
              </MenuItem>
              <MenuItem value='partition'>
                <ListItemText primary='partition' />
              </MenuItem>
            </Select>
            {searchOption === 'key' || searchOption === 'header' ? (
              <Select value={searchChoice} label='' onChange={handleSearchChange} sx={{ height: 40 }}>
                <MenuItem value='contained'>
                  <ListItemText primary='contained' />
                </MenuItem>
                <MenuItem value='exact'>
                  <ListItemText primary='exact' />
                </MenuItem>
              </Select>
            ) : (
              <></>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button variant='contained' color='secondary' sx={{ width: 130 }} onClick={() => handleSelectSearch()}>
                Search
              </Button>
            </Box>
          </Box>
          <Box>
            {showSide ? (
              <>
                <SideComp
                  open={showSide}
                  placement={placement}
                  topicName={topicName!}
                  currentTopics={currentTopics}
                  idArr={idArr}
                  setShowSide={setShowSide}
                  setSelectionModel={setSelectionModel}
                />
              </>
            ) : (
              <></>
            )}
            <DataGrid
              autoHeight
              rows={currentTopics}
              rowCount={searchClick ? currentTopics.length : recordsCount}
              sortingMode='server'
              filterMode='server'
              paginationMode='server'
              columns={columns}
              checkboxSelection
              // disableRowSelectionOnClick
              pageSizeOptions={[5, 10, 25, 50, 100]}
              getRowId={item => item.id}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              rowSelectionModel={selectionModel}
              onRowSelectionModelChange={selection => {
                setIdArr(selection as string[])
                if (selection.length > 1) {
                  const selectionSet = new Set(selectionModel)
                  const result = selection.filter(s => !selectionSet.has(s))
                  setSelectionModel(result)
                } else {
                  setSelectionModel(selection)
                }
                console.log('idArr', idArr, 'selectionModel', selectionModel)
              }}
            />
          </Box>
        </Card>
      )}
    </>
  )
}

export default TableServerSide
