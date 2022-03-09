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

export interface ZoneModel {}
interface ZoneContextState {
  id: string
  zoneModel: ZoneModel
  loading: boolean
}
interface ZoneContext {
  state: ZoneContextState
  operations: {
    create: () => Promise<string>
    setPathID: Dispatch<SetStateAction<string | undefined>>
  }
}

const zoneContext = createContext<ZoneContext>({
  state: {
    id: '',
    zoneModel: {},
    loading: false,
  },
  operations: {
    create: () => {
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
      return { id: '', zoneModel: {}, loading: true }
    case 'fetch-success':
      return { id: action.id, zoneModel: action.zone, loading: false }
    case 'create':
      return { id: '', zoneModel: '', loading: true }
    case 'create-success':
      return { id: action.id, zoneModel: action.zone, loading: false }
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
    id: '',
    zoneModel: {},
    loading: false,
  })

  useEffect(() => {
    ;(async function () {
      if (pathID) {
        dispatch({ name: 'fetch' })
        const response = await fetch(
          `https://linkage-api.cruftbusters.com/v1/zones/${pathID}`,
        )
        const zone = await response.json()
        dispatch({ name: 'fetch-success', id: pathID, zone })
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
            const zone = await response.json()
            dispatch({ name: 'create-success', id, zone })
            return id
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
