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
    setGroupName: (id: string, name: string) => void
    setLinkText: (id: string, text: string) => void
    setLinkHref: (id: string, href: string) => void
    setPathID: Dispatch<SetStateAction<string | undefined>>
  }
}

const throwErrNoZoneProvider = () => {
  throw Error('No ZoneProvider')
}
const zoneContext = createContext<ZoneContext>({
  state: {
    loading: false,
  },
  operations: {
    create: throwErrNoZoneProvider,
    createGroup: throwErrNoZoneProvider,
    createLink: throwErrNoZoneProvider,
    setGroupName: throwErrNoZoneProvider,
    setLinkText: throwErrNoZoneProvider,
    setLinkHref: throwErrNoZoneProvider,
    setPathID: throwErrNoZoneProvider,
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
      return { zoneModel: action.zoneModel, loading: true }
    case 'create-success':
      return { ...state, loading: false }
    case 'update':
      return { zoneModel: action.zoneModel, loading: true }
    case 'update-success':
      return { ...state, loading: false }
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
      if (pathID !== state.zoneModel?.id) {
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
            const id = uuidv4()
            const zoneModel = { id, groups: [] }
            dispatch({ name: 'create', zoneModel })
            await fetch(`https://linkage-api.cruftbusters.com/v1/zones/${id}`, {
              method: 'POST',
            })
            dispatch({ name: 'create-success' })
            return id
          },
          createGroup: async () => {
            if (!state.zoneModel) return
            const zoneModel = {
              ...state.zoneModel,
              groups: (state.zoneModel?.groups || []).concat({
                id: uuidv4(),
                name: 'new group',
                links: [],
              }),
            }
            dispatch({ name: 'update', zoneModel })
            await putZone(zoneModel)
            dispatch({ name: 'update-success' })
          },
          createLink: async (groupId) => {
            if (!state.zoneModel) return
            const zoneModel = {
              ...state.zoneModel,
              groups: (state.zoneModel?.groups || []).map((group) =>
                group.id === groupId
                  ? {
                      ...group,
                      links: group.links.concat({
                        id: uuidv4(),
                        text: 'new link',
                        href: 'https://',
                      }),
                    }
                  : group,
              ),
            }
            dispatch({ name: 'update', zoneModel })
            await putZone(zoneModel)
            dispatch({ name: 'update-success' })
          },
          setGroupName: async (id, name) => {
            if (!state.zoneModel) return
            const zoneModel = {
              ...state.zoneModel,
              groups: (state.zoneModel?.groups || []).map((group) =>
                group.id === id ? { ...group, name } : group,
              ),
            }
            dispatch({ name: 'update', zoneModel })
            await putZone(zoneModel)
            dispatch({ name: 'update-success' })
          },
          setLinkText: async (id, text) => {
            if (!state.zoneModel) return
            const zoneModel = {
              ...state.zoneModel,
              groups: (state.zoneModel?.groups || []).map((group) => ({
                ...group,
                links: group.links.map((link) =>
                  link.id === id ? { ...link, text } : link,
                ),
              })),
            }
            dispatch({ name: 'update', zoneModel })
            await putZone(zoneModel)
            dispatch({ name: 'update-success' })
          },
          setLinkHref: async (id, href) => {
            if (!state.zoneModel) return
            const zoneModel = {
              ...state.zoneModel,
              groups: (state.zoneModel?.groups || []).map((group) => ({
                ...group,
                links: group.links.map((link) =>
                  link.id === id ? { ...link, href } : link,
                ),
              })),
            }
            dispatch({ name: 'update', zoneModel })
            await putZone(zoneModel)
            dispatch({ name: 'update-success' })
          },
          setPathID,
        },
      }}
    />
  )
}

async function putZone(zoneModel: ZoneModel) {
  const response = await fetch(
    `https://linkage-api.cruftbusters.com/v1/zones/${zoneModel.id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(zoneModel),
    },
  )
  return {
    ...(await response.json()),
    id: zoneModel.id,
  }
}

export function useZone() {
  return useContext(zoneContext)
}
