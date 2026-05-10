import React from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import styles from './App.module.css'

export default function App() {
  return (
    <div className={styles.shell}>
      <div className={styles.glowOrb} aria-hidden="true" />
      <Header />
      <main className={styles.main}>
        <Home />
      </main>
      <Footer />
    </div>
  )
}
