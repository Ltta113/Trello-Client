import Box from '@mui/material/Box'
import { useSelector } from 'react-redux'
import { getColorByName } from '~/assets/labels'
import { RootState } from '~/redux/store'

function CardLabel() {
  const card = useSelector((state: RootState) => state.card.card)

  return (
    <Box sx={{ pl: 4.7 }}>
      {card?.labels && card.labels.length > 0 && <Box sx={{ mb: 0, fontSize: 11 }}>Nhãn</Box>}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {card?.labels.map((label) => (
          <Box
            key={label._id}
            sx={{
              backgroundColor: getColorByName(label.color),
              color: 'black',
              fontSize: 13,
              p: 1,
              borderRadius: 1
            }}
          >
            {label.title}
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default CardLabel
