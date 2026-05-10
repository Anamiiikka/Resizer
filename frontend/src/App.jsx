import React from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'

export default function App() {
  return (
    <>
      <Header />
      <main style={{ flex: 1 }}>
        <Home />
      </main>
      <Footer />
    </>
  )
}
