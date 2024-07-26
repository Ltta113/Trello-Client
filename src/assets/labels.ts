export const labelsColor = [
  {
    group: 'light',
    items: [
      {
        name: 'bright_green',
        color: '#d4f6cc'
      },
      {
        name: 'light_yellow',
        color: '#f6e0b3'
      },
      {
        name: 'light_orange',
        color: '#ffebc3'
      },
      {
        name: 'light_red',
        color: '#f9d3d3'
      },
      {
        name: 'light_purple',
        color: '#e4d7ff'
      },
      {
        name: 'light_blue',
        color: '#cde2ff'
      },
      {
        name: 'light_sky',
        color: '#c6edfb'
      },
      {
        name: 'light_lime',
        color: '#d4efa8'
      },
      {
        name: 'light_pink',
        color: '#fdd0ec'
      },
      {
        name: 'light_black',
        color: '#dbe0e4'
      }
    ]
  },
  {
    group: 'normal',
    items: [
      {
        name: 'green',
        color: '#61bd4f'
      },
      {
        name: 'yellow',
        color: '#f2d600'
      },
      {
        name: 'orange',
        color: '#ff9f1a'
      },
      {
        name: 'red',
        color: '#eb5a46'
      },
      {
        name: 'purple',
        color: '#c377e0'
      },
      {
        name: 'blue',
        color: '#599dfe'
      },
      {
        name: 'sky',
        color: '#6bc5e0'
      },
      {
        name: 'lime',
        color: '#8acd30'
      },
      {
        name: 'pink',
        color: '#f797d2'
      },
      {
        name: 'black',
        color: '#8491a2'
      }
    ]
  },
  {
    group: 'dark',
    items: [
      {
        name: 'dark_green',
        color: '#519839'
      },
      {
        name: 'dark_yellow',
        color: '#d6b700'
      },
      {
        name: 'dark_orange',
        color: '#d29034'
      },
      {
        name: 'dark_red',
        color: '#b04632'
      },
      {
        name: 'dark_purple',
        color: '#89609e'
      },
      {
        name: 'dark_blue',
        color: '#0b64e4'
      },
      {
        name: 'dark_sky',
        color: '#206a83'
      },
      {
        name: 'dark_lime',
        color: '#56802c'
      },
      {
        name: 'dark_pink',
        color: '#943d73'
      },
      {
        name: 'dark_black',
        color: '#647086'
      }
    ]
  }
]

export const noneColor: LabelItem = {
  name: 'no_color',
  color: '#e3e7ea'
}

export type LabelItem = {
  name: string
  color: string
}

type LabelGroup = {
  group: string
  items: LabelItem[]
}

export const getItems = (labelsColor: LabelGroup[]): LabelItem[] => {
  const items: LabelItem[] = []
  const maxItems = Math.max(...labelsColor.map((group) => group.items.length))

  for (let i = 0; i < maxItems; i += 5) {
    labelsColor.forEach((group) => {
      items.push(...group.items.slice(i, i + 5))
    })
  }

  return items
}
export const getColorByName = (name: string): string => {
  for (const group of labelsColor) {
    const item = group.items.find((item) => item.name === name)
    if (item) {
      return item.color
    }
  }
  return '#ffffff'
}
export const getNormalLabels = () => {
  const normalGroup = labelsColor.find((group) => group.group === 'normal')
  return normalGroup ? normalGroup.items : []
}
