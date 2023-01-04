import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import axios from 'axios'
import Layout from "../components/layout"
import AccessDenied from "../components/access-denied"

export default function ProtectedPage() {
  const { data: session, status } = useSession()
  const [content, setContent] = useState([])
  const [isLoadingContent, setIsLoadingContent] = useState(session ? true : false)

  // Fetch content from protected route
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/examples/protected?zip=07030&radius=15")
      console.log('session is ', session)
      const json = await res.json()
      if (json) {
        console.log('json is ', json)
        setIsLoadingContent(false)
        setContent(json.props)
      }
    }
    if (session) fetchData()
  }, [session])
  
  if (status === "loading" || isLoadingContent) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    );
  }

  // If no session exists, display access denied message
  if (!session) {
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    )
  }

  // If session exists, display content
  return (
    <Layout>
      <h1>Protected Page</h1>
      <p>
        <strong>{content ?? "\u00a0"}</strong>
      </p>
    </Layout>
  )
}
