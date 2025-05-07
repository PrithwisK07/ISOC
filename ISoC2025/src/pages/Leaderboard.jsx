import React, { useEffect } from 'react'
import { motion } from 'framer-motion';  // Import Framer Motion
import './Leaderboard.css'
import Footer from '../components/Footer'

const Leaderboard = () => {

  useEffect(() => {
    // Scroll to top when visiting leaderboard page
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
    , []);

  return (
    <>
      <div className='leaderboardPage'>
        {/* Apply motion.div for animation */}
        <motion.div
          className="leaderBoard"
          initial={{ opacity: 0, y: 50 }}  // Initial state: start with opacity 0 and position 50px lower
          animate={{ opacity: 1, y: 0 }}   // Animate to opacity 1 and position 0px (normal position)
          transition={{ duration: 0.8 }}   // Animation duration: 0.8 seconds
        >
          <h1 style={{ letterSpacing: 1 }}>LeaderBoard</h1>
          <p> The LeaderBoard Page will be Live on <span> 15th May 2025</span></p>
          <p> For further updates, Join our Discord</p>
          <button><a href='https://discord.gg/AUX9RP8fMr'>Join Discord</a></button>
        </motion.div>
      </div>
      <Footer />
    </>
  )
}

export default Leaderboard
