import Stack from '@mui/material/Stack'
import React from 'react'

export default function Loader() {
  return (
    <Stack
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10
      }}
    >
      <h3>Loading...</h3>
      <svg xmlns='http://www.w3.org/2000/svg' width='6em' height='7em' viewBox='0 0 24 24'>
        <path
          fill='none'
          stroke='currentColor'
          strokeDasharray={15}
          strokeDashoffset={15}
          strokeLinecap='round'
          strokeWidth={2}
          d='M12 3C16.9706 3 21 7.02944 21 12'
        >
          <animate fill='freeze' attributeName='stroke-dashoffset' dur='0.3s' values='15;0'></animate>
          <animateTransform
            attributeName='transform'
            dur='1.5s'
            repeatCount='indefinite'
            type='rotate'
            values='0 12 12;360 12 12'
          ></animateTransform>
        </path>
      </svg>
    </Stack>
  )
}
