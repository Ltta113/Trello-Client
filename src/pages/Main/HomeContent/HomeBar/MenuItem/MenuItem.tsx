import Box from '@mui/material/Box'
import SvgIcon from '@mui/material/SvgIcon'

type Props = {
  icon?: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & {
      title?: string
    }
  >
  color?: string
  title: string
  desc: string
}

export default function MenuItem({ icon, title, desc, color }: Props) {
  return (
    <Box
      sx={{
        p: '16px',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.1)'
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pb: 1.2 }}>
        {icon && <SvgIcon component={icon} inheritViewBox sx={{ fontSize: 20, color: color }} />}
        <Box>{title}</Box>
      </Box>
      <Box sx={{ fontSize: 11 }}>{desc}</Box>
    </Box>
  )
}
