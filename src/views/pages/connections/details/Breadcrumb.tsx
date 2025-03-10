import * as React from 'react'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import { useRouter } from 'next/router'

function handleClick(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
  event.preventDefault()
  console.info('You clicked a breadcrumb.')
}

export default function CustomSeparator() {
  const router = useRouter()
  const breadcrumbs = [
    <Link underline='hover' key='2' color='inherit' onClick={() => router.push('/connections')}>
      Connections
    </Link>,
    <Typography key='3' color='text.primary'>
      Cluster configuration
    </Typography>
  ]

  return (
    <Stack spacing={2}>
      <Breadcrumbs separator={<NavigateNextIcon fontSize='small' />} aria-label='breadcrumb'>
        {breadcrumbs}
      </Breadcrumbs>
    </Stack>
  )
}
