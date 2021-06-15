import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Grommet } from 'grommet';
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, db } from "../lib/firebase"
import Login from "./login"
import { Loading } from "../components/Loading"
import { useEffect } from "react"
import firebase from "firebase"
import { store } from "../app/store"
import { Provider } from "react-redux"



function MyApp({ Component, pageProps }: AppProps) {
  const [user, loading] = useAuthState(auth)

  useEffect(() => {
    if (user) {
      db.collection("users").doc(user.uid).set({
        email: user.email,
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
        photoUrl: user.photoURL
      }, { merge: true })
    }
  }, [user])

  if (loading) return <Loading />
  if (!user) return <Login />

  return (
    <Provider store={store}>
      <Grommet plain>
        <Component {...pageProps} />
      </Grommet>
    </Provider>
  )
}
export default MyApp
