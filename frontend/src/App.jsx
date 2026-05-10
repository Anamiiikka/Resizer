import React from 'react'
import Header from './components/Header'
import Home from './pages/Home'

export default function App() {
  return (
    <>
      <Header />
      <main style={{ flex: 1 }}>
        <Home />
      </main>
    </>
  )
}
