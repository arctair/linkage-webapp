import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react'
import { v4 as uuidv4 } from 'uuid'

export interface LinkModel {
  id: string
  text: string
  href: string
}
export interface GroupModel {
  id: string
  name: string
  links: Array<LinkModel>
}
export interface ZoneModel {
  id: string
  groups: Array<GroupModel>
}
interface ZoneContextState {
  zoneModel?: ZoneModel
  loading: boolean
}
interface ZoneContext {
  state: ZoneContextState
  operations: {
    create: () => Promise<string>
    createGroup: () => void
    createLink: (groupName: string) => void
    setPathID: Dispatch<SetStateAction<string | undefined>>
  }
}

const zoneContext = createContext<ZoneContext>({
  state: {
    loading: false,
  },
  operations: {
    create: () => {
      throw Error('No ZoneProvider')
    },
    createGroup: () => {
      throw Error('No ZoneProvider')
    },
    createLink: () => {
      throw Error('No ZoneProvider')
    },
    setPathID: () => {
      throw Error('No ZoneProvider')
    },
  },
})

function zoneProviderReducer(
  state: ZoneContextState,
  action: any,
): ZoneContextState {
  switch (action.name) {
    case 'fetch':
      return { loading: true }
    case 'fetch-success':
      return { zoneModel: action.zoneModel, loading: false }
    case 'create':
      return { loading: true }
    case 'create-success':
      return { zoneModel: action.zoneModel, loading: false }
    case 'update':
      return { ...state, loading: true }
    case 'update-success':
      return { zoneModel: action.zoneModel, loading: false }
    default:
      return state
  }
}

interface ZoneProviderProps {
  children: ReactNode
}
export default function ZoneProvider({ children }: ZoneProviderProps) {
  const [pathID, setPathID] = useState<string>()
  const [state, dispatch] = useReducer(zoneProviderReducer, {
    loading: false,
  })

  useEffect(() => {
    ;(async function () {
      if (pathID) {
        dispatch({ name: 'fetch' })
        const response = await fetch(
          `https://linkage-api.cruftbusters.com/v1/zones/${pathID}`,
        )
        const zoneModel = { ...(await response.json()), id: pathID }
        dispatch({ name: 'fetch-success', zoneModel })
      }
    })()
  }, [pathID])

  return (
    <zoneContext.Provider
      children={children}
      value={{
        state,
        operations: {
          create: async () => {
            dispatch({ name: 'create' })
            const id = uuidv4()
            const response = await fetch(
              `https://linkage-api.cruftbusters.com/v1/zones/${id}`,
              {
                method: 'POST',
              },
            )
            const zoneModel = { ...(await response.json()), id }
            dispatch({ name: 'create-success', zoneModel })
            return id
          },
          createGroup: async () => {
            if (!state.zoneModel) return
            dispatch({ name: 'update' })
            const upZoneModel = {
              ...state.zoneModel,
              groups: (state.zoneModel?.groups || []).concat({
                id: uuidv4(),
                name: 'new group',
                links: [],
              }),
            }
            const response = await fetch(
              `https://linkage-api.cruftbusters.com/v1/zones/${state.zoneModel.id}`,
              {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(upZoneModel),
              },
            )
            const downZoneModel = {
              ...(await response.json()),
              id: state.zoneModel.id,
            }
            dispatch({
              name: 'update-success',
              zoneModel: downZoneModel,
            })
          },
          createLink: async (groupId) => {
            if (!state.zoneModel) return
            dispatch({ name: 'update' })
            const upZoneModel = {
              ...state.zoneModel,
              groups: (state.zoneModel?.groups || []).map((group) => {
                if (group.id === groupId) {
                  return {
                    ...group,
                    links: group.links.concat({
                      id: uuidv4(),
                      text: 'new link',
                      href: 'https://',
                    }),
                  }
                } else return group
              }),
            }
            const response = await fetch(
              `https://linkage-api.cruftbusters.com/v1/zones/${state.zoneModel.id}`,
              {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(upZoneModel),
              },
            )
            const downZoneModel = {
              ...(await response.json()),
              id: state.zoneModel.id,
            }
            dispatch({
              name: 'update-success',
              zoneModel: downZoneModel,
            })
          },
          setPathID,
        },
      }}
    />
  )
}

export function useZone() {
  return useContext(zoneContext)
}
