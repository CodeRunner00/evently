import { useState } from 'react'
import { SessionProvider } from "next-auth/react"
import "./styles.scss"

import type { AppProps } from "next/app"
import type { Session } from "next-auth"
import { EventsContext } from '../contexts/events';

// Use of the <SessionProvider> is mandatory to allow components that call
// `useSession()` anywhere in your application to access the `session` object.
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {

  const [events, setEvents] = useState([])

  return (
    <SessionProvider session={session}>
      <EventsContext.Provider value={{ events, setEvents }}>
        <Component {...pageProps} />
      </EventsContext.Provider>
    </SessionProvider>
  )
}
