import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import reposData from "../data/reposdata";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

const ReposPage = () => {
  const [repos, setRepos] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/repos");
        const data = await response.json();
        setRepos(data);
      } catch (error) {
        console.error("Error fetching repositories:", error);
      }
    };
    fetchRepos();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const allLanguages = [
    "All",
    ...new Set(reposData.flatMap((repo) => repo.language)),
  ];

  const filteredRepos = repos.filter((repo) => {
    const matchesSearch = repo.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesLanguage =
      selectedLanguage === "All" || repo.language.includes(selectedLanguage);
    return matchesSearch && matchesLanguage;
  });

  return (
    <div className="bg-repeat" style={{
      backgroundImage: "url('/images/repopagebg2.png')",
      backgroundRepeat: "repeat",
      backgroundSize: "200%",
    }}>
      <style>
          {`
            @media (min-width: 768px) {
              div.bg-repeat {
                background-size: 100% !important;
              }
            }
          `}
        </style>
      <Header />
      <div className="px-6 mb-30 pt-4 md:pt-10 max-w-7xl mx-auto bg-transparent">
        <h2
          className="md:text-7xl text-4xl sm:text-5xl text-[#1f3cfc] font-bold mb-18 text-center"
          style={{
            fontFamily: "CameraObscuraDEMO, sans-serif",
            textShadow: `-2px -2px 0 #fff, 2px -2px 0 #fff, -2px 2px 0 #fff, 2px 2px 0 #fff, 0px 2px 0 #fff, 2px 0px 0 #fff, 0px -2px 0 #fff, -3px 0px 0 #fff`,
            letterSpacing: "2px",
          }}
        >
          Repositories
        </h2>

        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          {/* Search bar */}
          <input
            type="text"
            placeholder="Search repositories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-1/2 px-4 py-3 bg-white border rounded border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-black space-grotesk-regular"
          />

          {/* Language Filter Dropdown */}
          <div ref={dropdownRef} className="relative w-full sm:w-auto ">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="sm:w-auto bg-white border border-gray-300 rounded px-4 py-3 text-left shadow-sm space-grotesk-regular focus:outline cursor-pointer flex"
            >
              <span className="font-bold text-sm md:text-md text">
                Filter by Language :
              </span>
              <span className="ml-2 text-gray-600 text-sm md:text-md">
                {selectedLanguage}
              </span>
            </button>
            {showDropdown && (
              <ul className="absolute z-10 w-1/2 md:w-52 bg-white border mt-2 rounded shadow space-grotesk-regular max-h-60 overflow-y-auto">
                {allLanguages.map((lang) => (
                  <li
                    key={lang}
                    onClick={() => {
                      setSelectedLanguage(lang);
                      setShowDropdown(false);
                    }}
                    className={`px-4 py-2 cursor-pointer transition-transform duration-200 transform hover:scale-[1.05] ${
                      selectedLanguage === lang ? "font-bold" : "font-normal"
                    }`}
                    style={{ color: "black" }}
                  >
                    {lang}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Repos grid */}
        <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredRepos.length === 0 ? (
            <p className="text-center col-span-full text-gray-600 font-semibold text-lg md:text-2xl py-15">
              No repositories to show. Please search with different keywords...
            </p>
          ) : (
            filteredRepos.map((repo, index) => (
              <motion.div
                key={repo.id}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                className="bg-white border shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <img
                  src={repo.image}
                  alt={repo.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-5">
                  <h3 className="text-xl space-grotesk-regular font-semibold mb-2">
                    {repo.name}
                  </h3>
                  <p className="text-gray-600 space-grotesk-regular mb-4">
                    {repo.shortDescription}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex flex-wrap gap-2">
                      {repo.language.map((lang) => (
                        <span
                          key={lang}
                          className="bg-blue-100 text-blue-800 px-2 py-1 rounded space-grotesk-regular"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center space-x-4">
                      <span>⭐ {repo.stars}</span>
                      <span>🍴 {repo.forks}</span>
                    </div>
                  </div>
                  <Link
                    to={`/repo/${repo.id}`}
                    className="inline-block w-full text-center bg-[#1f3cfc] text-white py-2 px-4 rounded-xs hover:bg-[#1f3cfcef] transition-colors duration-200 space-grotesk-regular"
                  >
                    View Details
                  </Link>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ReposPage;
